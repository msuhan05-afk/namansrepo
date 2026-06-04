/* UX Roast — popup controller. */
(function () {
  "use strict";
  const api = window.uxApi;
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "uxRoastReport";

  const views = {
    idle: $("view-idle"),
    loading: $("view-loading"),
    result: $("view-result"),
    error: $("view-error"),
  };
  function show(name) {
    for (const k in views) views[k].classList.toggle("hidden", k !== name);
  }

  function scoreColor(score) {
    if (score >= 80) return getCss("--good");
    if (score >= 60) return getCss("--warn");
    return getCss("--bad");
  }
  function getCss(v) {
    return getComputedStyle(document.body).getPropertyValue(v).trim() || "#6366f1";
  }

  async function activeTab() {
    const tabs = await api.tabs.query({ active: true, currentWindow: true });
    return tabs && tabs[0];
  }

  function restrictedUrl(url) {
    return (
      !url ||
      /^(chrome|edge|about|moz-extension|chrome-extension|view-source|devtools):/i.test(url) ||
      /^https?:\/\/chrome\.google\.com\/webstore/i.test(url) ||
      /^https?:\/\/(addons|microsoftedge)\./i.test(url)
    );
  }

  async function captureScreenshot(windowId) {
    // Try directly from the popup first; fall back to the background worker.
    try {
      const p = api.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 70 });
      const dataUrl = await p;
      if (dataUrl) return dataUrl;
    } catch (e) {
      /* fall through */
    }
    try {
      const res = await api.runtime.sendMessage({ type: "UXROAST_CAPTURE", windowId });
      return res && res.ok ? res.dataUrl : null;
    } catch (e) {
      return null;
    }
  }

  async function run() {
    const tab = await activeTab();
    if (!tab || restrictedUrl(tab.url)) {
      return fail("This page can't be roasted. Open a normal http(s) website and try again.");
    }
    show("loading");

    try {
      $("loading-step").textContent = "Capturing page…";
      const screenshot = await captureScreenshot(tab.windowId);

      $("loading-step").textContent = "Analyzing layout, a11y, CTAs & contrast…";
      const results = await api.scripting.executeScript({
        target: { tabId: tab.id },
        func: window.uxRoastAnalyze,
      });
      const report = results && results[0] && results[0].result;
      if (!report) throw new Error("No data returned from the page.");

      report.screenshot = screenshot || null;
      await api.storage.local.set({ [STORAGE_KEY]: report });
      render(report);
      show("result");
    } catch (err) {
      console.error(err);
      fail("Couldn't analyze this page. It may block content scripts (some store/bank pages do). " + (err.message || ""));
    }
  }

  function fail(msg) {
    $("error-msg").textContent = msg;
    show("error");
  }

  function render(report) {
    // Gauge
    $("score").textContent = report.score;
    $("grade").textContent = "Grade " + report.grade;
    $("verdict").textContent = report.verdict;
    const fill = $("gauge-fill");
    const C = 2 * Math.PI * 52;
    fill.style.strokeDasharray = C;
    fill.style.stroke = scoreColor(report.score);
    // animate next frame
    requestAnimationFrame(() => {
      fill.style.strokeDashoffset = C * (1 - report.score / 100);
    });

    // Counts
    const counts = $("counts");
    counts.innerHTML = "";
    const order = [
      ["high", "Critical", report.counts.high],
      ["medium", "Moderate", report.counts.medium],
      ["low", "Minor", report.counts.low],
    ];
    for (const [sev, label, n] of order) {
      if (!n) continue;
      const span = document.createElement("span");
      span.className = "pill " + sev;
      span.innerHTML = `<span class="dot"></span>${n} ${label}`;
      counts.appendChild(span);
    }
    if (!report.counts.high && !report.counts.medium && !report.counts.low) {
      const span = document.createElement("span");
      span.className = "pill low";
      span.textContent = "No issues found 🎉";
      counts.appendChild(span);
    }

    // Categories
    const cats = $("cats");
    cats.innerHTML = "";
    for (const key of ["layout", "accessibility", "cta", "contrast"]) {
      const c = report.categories[key];
      const el = document.createElement("div");
      el.className = "cat";
      const color = scoreColor(c.score);
      el.innerHTML = `
        <div class="cat-top">
          <span class="cat-name">${c.label}</span>
          <span class="cat-score" style="color:${color}">${c.score}</span>
        </div>
        <div class="cat-bar"><span style="width:0%;background:${color}"></span></div>`;
      cats.appendChild(el);
      requestAnimationFrame(() => {
        el.querySelector(".cat-bar > span").style.width = c.score + "%";
      });
    }

    // Top issues (highest severity first, max 4)
    const list = $("top-issues");
    list.innerHTML = "";
    const top = report.recommendations.slice(0, 4);
    if (!top.length) {
      const li = document.createElement("li");
      li.className = "issue low";
      li.innerHTML = `<span class="bar"></span><div class="issue-body"><div class="issue-title">Nothing to fix</div><div class="issue-detail">This page passed every check.</div></div>`;
      list.appendChild(li);
    }
    for (const r of top) {
      const li = document.createElement("li");
      li.className = "issue " + r.severity;
      li.innerHTML = `<span class="bar"></span>
        <div class="issue-body">
          <div class="issue-title">${escapeHtml(r.title)}</div>
          <div class="issue-detail">${escapeHtml(r.detail)}</div>
        </div>`;
      list.appendChild(li);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---- wire up --------------------------------------------------------------
  $("run").addEventListener("click", run);
  $("rerun").addEventListener("click", run);
  $("error-back").addEventListener("click", () => show("idle"));
  $("open-report").addEventListener("click", async () => {
    await api.tabs.create({ url: api.runtime.getURL("report.html") });
    window.close();
  });

  (async function init() {
    const tab = await activeTab();
    if (tab) {
      try {
        $("target").textContent = new URL(tab.url).hostname || tab.url;
      } catch (e) {
        $("target").textContent = tab.url || "";
      }
      if (restrictedUrl(tab.url)) {
        $("idle-note").textContent = "This kind of page (browser/internal) can't be analyzed.";
        $("run").disabled = true;
        $("run").style.opacity = 0.5;
        $("run").style.cursor = "not-allowed";
      }
    }
  })();
})();
