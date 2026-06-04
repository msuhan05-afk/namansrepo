/*
 * UX Roast — page analysis engine.
 *
 * `uxRoastAnalyze` is injected wholesale into the inspected tab via
 * chrome.scripting.executeScript({ func: uxRoastAnalyze }). Because the
 * function is serialized and re-evaluated in the page, it must be fully
 * self-contained: every helper lives inside it and it returns a plain
 * JSON-serializable object.
 */
function uxRoastAnalyze() {
  "use strict";

  // ---- small utilities -----------------------------------------------------
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const round = (n, d = 0) => {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
  };

  function isVisible(el) {
    if (!el || el.nodeType !== 1) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.visibility === "collapse") return false;
    if (parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function accessibleName(el) {
    const aria = el.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const labelledby = el.getAttribute("aria-labelledby");
    if (labelledby) {
      const txt = labelledby
        .split(/\s+/)
        .map((id) => {
          const n = document.getElementById(id);
          return n ? n.textContent.trim() : "";
        })
        .join(" ")
        .trim();
      if (txt) return txt;
    }
    if (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA") {
      if (el.id) {
        const lab = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (lab && lab.textContent.trim()) return lab.textContent.trim();
      }
      const wrap = el.closest("label");
      if (wrap && wrap.textContent.trim()) return wrap.textContent.trim();
      if (el.getAttribute("title")) return el.getAttribute("title").trim();
      if (el.getAttribute("placeholder")) return el.getAttribute("placeholder").trim();
      return "";
    }
    const txt = (el.textContent || "").trim();
    if (txt) return txt;
    if (el.getAttribute("title")) return el.getAttribute("title").trim();
    const img = el.querySelector("img[alt]");
    if (img && img.getAttribute("alt").trim()) return img.getAttribute("alt").trim();
    return "";
  }

  // ---- colour / contrast ----------------------------------------------------
  function parseColor(str) {
    if (!str) return null;
    const m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    const [r, g, b] = parts;
    const a = parts.length >= 4 ? parts[3] : 1;
    return { r, g, b, a };
  }

  function blend(fg, bg) {
    // fg over bg, both {r,g,b,a}
    const a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const ch = (f, b) => (f * fg.a + b * bg.a * (1 - fg.a)) / a;
    return { r: ch(fg.r, bg.r), g: ch(fg.g, bg.g), b: ch(fg.b, bg.b), a };
  }

  function effectiveBg(el) {
    let node = el;
    let acc = { r: 0, g: 0, b: 0, a: 0 };
    while (node && node.nodeType === 1) {
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) {
        acc = blend(acc, c);
        if (acc.a >= 0.99) break;
      }
      node = node.parentElement;
    }
    if (acc.a < 0.99) acc = blend(acc, { r: 255, g: 255, b: 255, a: 1 }); // assume white canvas
    return acc;
  }

  function luminance(c) {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function contrastRatio(c1, c2) {
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function shortSelector(el) {
    if (!el || el.nodeType !== 1) return "";
    if (el.id) return `#${el.id}`;
    let s = el.tagName.toLowerCase();
    if (el.classList.length) s += "." + Array.from(el.classList).slice(0, 2).join(".");
    return s;
  }

  function snippet(el, max = 60) {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    return t.length > max ? t.slice(0, max) + "…" : t;
  }

  // ==========================================================================
  // 1. LAYOUT STRUCTURE
  // ==========================================================================
  function analyzeLayout() {
    const issues = [];
    const landmarks = {
      header: document.querySelector("header, [role=banner]") != null,
      nav: document.querySelector("nav, [role=navigation]") != null,
      main: document.querySelector("main, [role=main]") != null,
      footer: document.querySelector("footer, [role=contentinfo]") != null,
    };
    if (!landmarks.main)
      issues.push({ severity: "high", title: "No <main> landmark", detail: "Screen-reader and keyboard users have no quick way to jump to primary content." });
    if (!landmarks.header)
      issues.push({ severity: "low", title: "No <header> / banner landmark", detail: "Wrap the top bar in <header> so the page masthead is identifiable." });
    if (!landmarks.nav)
      issues.push({ severity: "low", title: "No <nav> landmark", detail: "Primary navigation isn't marked up as <nav>." });
    if (!landmarks.footer)
      issues.push({ severity: "low", title: "No <footer> landmark", detail: "Wrap supplementary/legal content in <footer>." });

    // Heading outline
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter(isVisible);
    const h1s = headings.filter((h) => h.tagName === "H1");
    if (h1s.length === 0)
      issues.push({ severity: "high", title: "Missing <h1>", detail: "Every page should have exactly one top-level heading describing the page." });
    else if (h1s.length > 1)
      issues.push({ severity: "medium", title: `${h1s.length} <h1> elements`, detail: "Multiple H1s muddy the document outline. Keep a single page title." });

    let skipped = 0;
    let prev = 0;
    for (const h of headings) {
      const lvl = parseInt(h.tagName[1], 10);
      if (prev && lvl > prev + 1) skipped++;
      prev = lvl;
    }
    if (skipped > 0)
      issues.push({ severity: "medium", title: `Heading levels skip ${skipped}×`, detail: "Don't jump from e.g. H2 to H4 — it breaks the outline for assistive tech." });

    // Semantic richness: ratio of generic divs/spans to total elements
    const all = document.body ? document.body.getElementsByTagName("*").length : 0;
    const generic = document.body ? document.body.querySelectorAll("div,span").length : 0;
    const divRatio = all ? generic / all : 0;
    if (all > 150 && divRatio > 0.75)
      issues.push({ severity: "low", title: "Div-heavy markup", detail: `${round(divRatio * 100)}% of elements are generic <div>/<span>. Prefer semantic tags (section, article, nav, ul…).` });

    // Viewport / responsiveness
    const vp = document.querySelector('meta[name="viewport"]');
    if (!vp)
      issues.push({ severity: "high", title: "No responsive viewport meta", detail: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile layout.' });

    // Horizontal overflow (a common layout smell)
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (overflow > 4)
      issues.push({ severity: "medium", title: "Horizontal scroll / overflow", detail: `Content overflows the viewport by ~${round(overflow)}px, causing sideways scrolling.` });

    return {
      issues,
      stats: { landmarks, headingCount: headings.length, h1Count: h1s.length, divRatio: round(divRatio, 2) },
    };
  }

  // ==========================================================================
  // 2. ACCESSIBILITY
  // ==========================================================================
  function analyzeAccessibility() {
    const issues = [];

    if (!document.documentElement.getAttribute("lang"))
      issues.push({ severity: "medium", title: "No lang attribute on <html>", detail: "Set <html lang> so screen readers use the right pronunciation." });

    if (!document.title || !document.title.trim())
      issues.push({ severity: "medium", title: "Empty <title>", detail: "Give the page a descriptive <title> for tabs, history and search." });

    // Images without alt
    const imgs = Array.from(document.querySelectorAll("img")).filter(isVisible);
    const noAlt = imgs.filter((i) => !i.hasAttribute("alt"));
    if (noAlt.length)
      issues.push({
        severity: "high",
        title: `${noAlt.length} image${noAlt.length > 1 ? "s" : ""} missing alt text`,
        detail: "Add alt attributes (use alt=\"\" for purely decorative images).",
        examples: noAlt.slice(0, 3).map((i) => i.currentSrc || i.src || shortSelector(i)),
      });

    // Form controls without labels
    const controls = Array.from(document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea")).filter(isVisible);
    const unlabeled = controls.filter((c) => !accessibleName(c));
    if (unlabeled.length)
      issues.push({
        severity: "high",
        title: `${unlabeled.length} form field${unlabeled.length > 1 ? "s" : ""} without a label`,
        detail: "Associate a <label>, aria-label, or aria-labelledby with every input.",
        examples: unlabeled.slice(0, 3).map(shortSelector),
      });

    // Buttons / links without accessible name
    const actionable = Array.from(document.querySelectorAll("button, a[href], [role=button]")).filter(isVisible);
    const nameless = actionable.filter((b) => !accessibleName(b));
    if (nameless.length)
      issues.push({
        severity: "high",
        title: `${nameless.length} button/link${nameless.length > 1 ? "s" : ""} with no accessible name`,
        detail: "Icon-only controls need aria-label or visually-hidden text.",
        examples: nameless.slice(0, 3).map(shortSelector),
      });

    // Tiny tap targets (WCAG 2.5.8 — 24×24 CSS px min)
    const small = actionable.filter((b) => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && (r.width < 24 || r.height < 24);
    });
    if (small.length > 2)
      issues.push({ severity: "medium", title: `${small.length} small tap targets`, detail: "Interactive targets under 24×24px are hard to hit on touch devices." });

    // Duplicate ids
    const ids = {};
    let dupes = 0;
    document.querySelectorAll("[id]").forEach((el) => {
      const id = el.id;
      ids[id] = (ids[id] || 0) + 1;
      if (ids[id] === 2) dupes++;
    });
    if (dupes)
      issues.push({ severity: "low", title: `${dupes} duplicated id${dupes > 1 ? "s" : ""}`, detail: "Duplicate ids break label associations and in-page anchors." });

    // Positive tabindex (anti-pattern)
    const posTab = Array.from(document.querySelectorAll("[tabindex]")).filter((el) => parseInt(el.getAttribute("tabindex"), 10) > 0);
    if (posTab.length)
      issues.push({ severity: "medium", title: `${posTab.length} positive tabindex`, detail: "tabindex > 0 fights the natural focus order. Use 0 or -1 only." });

    return {
      issues,
      stats: { images: imgs.length, imagesNoAlt: noAlt.length, controls: controls.length, unlabeled: unlabeled.length, namelessActions: nameless.length },
    };
  }

  // ==========================================================================
  // 3. CTA HIERARCHY
  // ==========================================================================
  function analyzeCTA() {
    const issues = [];
    const candidates = Array.from(document.querySelectorAll("button, a[href], [role=button], input[type=submit]")).filter(isVisible);

    const scored = candidates
      .map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const bg = parseColor(cs.backgroundColor);
        const hasFill = bg && bg.a > 0.05;
        const area = r.width * r.height;
        const fontW = parseInt(cs.fontWeight, 10) || 400;
        const fontSize = parseFloat(cs.fontSize) || 16;
        // Prominence: filled background + size + weight + radius.
        let prominence = 0;
        if (hasFill) prominence += 3;
        prominence += clamp(area / 6000, 0, 3);
        prominence += fontW >= 600 ? 1 : 0;
        prominence += fontSize >= 16 ? 0.5 : 0;
        prominence += parseFloat(cs.borderRadius) > 0 ? 0.5 : 0;
        const aboveFold = r.top < (window.innerHeight || 800);
        return { el, prominence: round(prominence, 2), area, aboveFold, name: accessibleName(el) };
      })
      .sort((a, b) => b.prominence - a.prominence);

    const prominent = scored.filter((s) => s.prominence >= 4);
    const aboveFold = scored.filter((s) => s.aboveFold && s.name);

    if (candidates.length === 0) {
      issues.push({ severity: "medium", title: "No clear call-to-action", detail: "The page exposes no buttons or actionable links — what should the visitor do next?" });
    } else if (prominent.length === 0) {
      issues.push({ severity: "high", title: "No visually dominant CTA", detail: "Nothing stands out as the primary action. Give your main CTA a filled, high-contrast style." });
    } else if (prominent.length >= 4) {
      issues.push({
        severity: "high",
        title: `${prominent.length} competing primary CTAs`,
        detail: "Too many loud buttons flatten the hierarchy. Promote one primary action; demote the rest to secondary/tertiary styles.",
        examples: prominent.slice(0, 4).map((s) => s.name || shortSelector(s.el)),
      });
    } else if (prominent.length >= 2) {
      // Check whether the top two are near-identical in prominence (ambiguous primary).
      if (Math.abs(prominent[0].prominence - prominent[1].prominence) < 0.6)
        issues.push({ severity: "medium", title: "Ambiguous primary CTA", detail: "Two CTAs look equally important. Differentiate the primary one with stronger contrast or size." });
    }

    if (candidates.length > 0 && aboveFold.length === 0)
      issues.push({ severity: "medium", title: "No CTA above the fold", detail: "Visitors must scroll before they find an action. Surface a CTA in the initial viewport." });

    // Vague CTA labels
    const vague = /^(click here|here|read more|learn more|more|submit|go|ok|button|link)$/i;
    const vagueOnes = scored.filter((s) => s.name && vague.test(s.name.trim()));
    if (vagueOnes.length > 1)
      issues.push({
        severity: "low",
        title: `${vagueOnes.length} vague CTA labels`,
        detail: 'Labels like "Click here" / "Learn more" lack context out of flow. Describe the outcome ("Start free trial").',
        examples: Array.from(new Set(vagueOnes.map((s) => s.name))).slice(0, 4),
      });

    return {
      issues,
      stats: {
        total: candidates.length,
        prominent: prominent.length,
        topProminence: scored[0] ? scored[0].prominence : 0,
        primary: prominent[0] ? prominent[0].name || shortSelector(prominent[0].el) : null,
      },
    };
  }

  // ==========================================================================
  // 4. CONTRAST
  // ==========================================================================
  function analyzeContrast() {
    const issues = [];
    const offenders = [];
    let checked = 0;

    const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const seen = new Set();
    let node;
    const MAX = 1200;
    let visited = 0;
    while ((node = walker.nextNode()) && visited < MAX) {
      visited++;
      const el = node.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      if (!isVisible(el)) continue;

      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color);
      if (!fg || fg.a === 0) continue;
      const bg = effectiveBg(el);
      const fgOnBg = fg.a < 1 ? blend(fg, bg) : fg;
      const ratio = contrastRatio(fgOnBg, bg);
      checked++;

      const size = parseFloat(cs.fontSize) || 16;
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = isLarge ? 3.0 : 4.5;

      if (ratio < required) {
        offenders.push({
          ratio: round(ratio, 2),
          required,
          text: snippet(el, 50),
          selector: shortSelector(el),
          color: cs.color,
          background: `rgb(${round(bg.r)}, ${round(bg.g)}, ${round(bg.b)})`,
          size: round(size),
        });
      }
    }

    offenders.sort((a, b) => a.ratio - b.ratio);
    if (offenders.length) {
      const severe = offenders.filter((o) => o.ratio < 3).length;
      issues.push({
        severity: severe > 0 ? "high" : "medium",
        title: `${offenders.length} low-contrast text element${offenders.length > 1 ? "s" : ""}`,
        detail: `Text below WCAG AA contrast (4.5:1, or 3:1 for large text). Worst measured: ${offenders[0].ratio}:1.`,
        examples: offenders.slice(0, 4).map((o) => `${o.ratio}:1 — "${o.text || o.selector}"`),
      });
    }

    return { issues, stats: { checked, failures: offenders.length, worst: offenders[0] ? offenders[0].ratio : null }, offenders: offenders.slice(0, 20) };
  }

  // ==========================================================================
  // SCORING
  // ==========================================================================
  function scoreCategory(issues) {
    const weight = { high: 14, medium: 7, low: 3 };
    let penalty = 0;
    for (const i of issues) penalty += weight[i.severity] || 3;
    return clamp(round(100 - penalty), 0, 100);
  }

  const layout = analyzeLayout();
  const a11y = analyzeAccessibility();
  const cta = analyzeCTA();
  const contrast = analyzeContrast();

  const categories = {
    layout: { label: "Layout Structure", weight: 0.25, score: scoreCategory(layout.issues), issues: layout.issues, stats: layout.stats },
    accessibility: { label: "Accessibility", weight: 0.3, score: scoreCategory(a11y.issues), issues: a11y.issues, stats: a11y.stats },
    cta: { label: "CTA Hierarchy", weight: 0.2, score: scoreCategory(cta.issues), issues: cta.issues, stats: cta.stats },
    contrast: { label: "Contrast", weight: 0.25, score: scoreCategory(contrast.issues), issues: contrast.issues, stats: contrast.stats, offenders: contrast.offenders },
  };

  let overall = 0;
  for (const k in categories) overall += categories[k].score * categories[k].weight;
  overall = clamp(round(overall), 0, 100);

  // ---- recommendations (prioritized, deduped from issues) -------------------
  const recommendations = [];
  for (const key in categories) {
    for (const issue of categories[key].issues) {
      recommendations.push({
        category: categories[key].label,
        severity: issue.severity,
        title: issue.title,
        detail: issue.detail,
        examples: issue.examples || null,
      });
    }
  }
  const sevRank = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

  const counts = { high: 0, medium: 0, low: 0 };
  recommendations.forEach((r) => counts[r.severity]++);

  let grade = "F";
  if (overall >= 90) grade = "A";
  else if (overall >= 80) grade = "B";
  else if (overall >= 70) grade = "C";
  else if (overall >= 60) grade = "D";

  let verdict;
  if (overall >= 90) verdict = "Polished. A few nits aside, this is a confident, accessible experience.";
  else if (overall >= 75) verdict = "Solid foundation with some rough edges worth smoothing.";
  else if (overall >= 60) verdict = "Functional but flawed — users are hitting friction.";
  else if (overall >= 40) verdict = "Rough. Core usability and accessibility gaps need attention.";
  else verdict = "Brutal. This page fights its users at almost every turn.";

  return {
    schema: 1,
    url: location.href,
    title: document.title || location.hostname,
    hostname: location.hostname,
    timestamp: Date.now(),
    viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 },
    score: overall,
    grade,
    verdict,
    counts,
    categories,
    recommendations,
  };
}

// Expose for popup.js (used as the `func` passed to executeScript).
if (typeof window !== "undefined") window.uxRoastAnalyze = uxRoastAnalyze;
