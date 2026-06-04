/* UX Roast — full report renderer + PDF export. */
(function () {
  "use strict";
  const api = window.uxApi;
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "uxRoastReport";

  const CAT_ORDER = ["layout", "accessibility", "cta", "contrast"];

  function getCss(v) {
    return getComputedStyle(document.body).getPropertyValue(v).trim() || "#6366f1";
  }
  function scoreColor(score) {
    if (score >= 80) return getCss("--good");
    if (score >= 60) return getCss("--warn");
    return getCss("--bad");
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch (e) {
      return new Date(ts).toString();
    }
  }

  function render(report) {
    document.title = `UX Roast — ${report.hostname || "report"} (${report.score}/100)`;
    $("page-title").textContent = report.title || report.hostname;
    const url = $("page-url");
    url.textContent = report.url;
    url.href = report.url;
    $("meta").textContent =
      `${fmtDate(report.timestamp)}  ·  Viewport ${report.viewport.width}×${report.viewport.height}` +
      (report.viewport.dpr ? ` @${report.viewport.dpr}×` : "");
    $("verdict").textContent = report.verdict;
    $("footer-date").textContent = fmtDate(report.timestamp);

    // Gauge
    $("score").textContent = report.score;
    $("grade").textContent = "Grade " + report.grade;
    const C = 2 * Math.PI * 52;
    const fill = $("gauge-fill");
    fill.style.strokeDasharray = C;
    fill.style.stroke = scoreColor(report.score);
    requestAnimationFrame(() => {
      fill.style.strokeDashoffset = C * (1 - report.score / 100);
    });

    // Counts
    const counts = $("counts");
    counts.innerHTML = "";
    [
      ["high", "Critical", report.counts.high],
      ["medium", "Moderate", report.counts.medium],
      ["low", "Minor", report.counts.low],
    ].forEach(([sev, label, n]) => {
      if (!n) return;
      const span = document.createElement("span");
      span.className = "pill " + sev;
      span.innerHTML = `<span class="dot"></span>${n} ${label}`;
      counts.appendChild(span);
    });
    if (!report.recommendations.length) {
      const span = document.createElement("span");
      span.className = "pill low";
      span.textContent = "No issues found 🎉";
      counts.appendChild(span);
    }

    // Category grid
    const cats = $("cats");
    cats.innerHTML = "";
    CAT_ORDER.forEach((key) => {
      const c = report.categories[key];
      const color = scoreColor(c.score);
      const el = document.createElement("div");
      el.className = "cat";
      const n = c.issues.length;
      const foot = n ? `${n} issue${n > 1 ? "s" : ""} detected` : "No issues";
      el.innerHTML = `
        <div class="cat-top">
          <span class="cat-name">${c.label}</span>
          <span class="cat-score" style="color:${color}">${c.score}</span>
        </div>
        <div class="cat-bar"><span style="width:0%;background:${color}"></span></div>
        <p class="cat-foot">${foot}</p>`;
      cats.appendChild(el);
      requestAnimationFrame(() => {
        el.querySelector(".cat-bar > span").style.width = c.score + "%";
      });
    });

    // Screenshot
    if (report.screenshot) {
      $("shot").src = report.screenshot;
    } else {
      $("shot-block").classList.add("hidden");
    }

    // Recommendations
    const recs = $("recs");
    recs.innerHTML = "";
    if (!report.recommendations.length) {
      recs.innerHTML = `<p class="clean">✓ This page passed every check. Nice work.</p>`;
    }
    report.recommendations.forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "rec";
      let examples = "";
      if (r.examples && r.examples.length) {
        examples = `<ul class="rec-examples">${r.examples
          .map((e) => `<li title="${escapeHtml(e)}">${escapeHtml(e)}</li>`)
          .join("")}</ul>`;
      }
      div.innerHTML = `
        <div class="rec-rank">${i + 1}</div>
        <div class="rec-body">
          <div class="rec-head">
            <span class="pill ${r.severity}"><span class="dot"></span>${sevLabel(r.severity)}</span>
            <span class="rec-title">${escapeHtml(r.title)}</span>
            <span class="rec-cat">· ${escapeHtml(r.category)}</span>
          </div>
          <p class="rec-detail">${escapeHtml(r.detail)}</p>
          ${examples}
        </div>`;
      recs.appendChild(div);
    });

    // Detailed findings per category
    const details = $("details");
    details.innerHTML = "";
    CAT_ORDER.forEach((key) => {
      const c = report.categories[key];
      const color = scoreColor(c.score);
      const wrap = document.createElement("div");
      wrap.className = "detail-cat";
      let body;
      if (!c.issues.length) {
        body = `<div class="clean">✓ No issues in this category.</div>`;
      } else {
        body = c.issues
          .map(
            (it) => `
          <div class="finding ${it.severity}">
            <span class="bar"></span>
            <div>
              <div class="finding-title">${escapeHtml(it.title)}</div>
              <div class="finding-detail">${escapeHtml(it.detail)}</div>
            </div>
          </div>`
          )
          .join("");
      }
      wrap.innerHTML = `
        <h3>${c.label} <span class="score-tag" style="color:${color}">${c.score}/100</span></h3>
        ${body}`;
      details.appendChild(wrap);
    });

    $("export-pdf").addEventListener("click", () => window.print());
  }

  async function load() {
    let report = null;
    try {
      const data = await api.storage.local.get(STORAGE_KEY);
      report = data && data[STORAGE_KEY];
    } catch (e) {
      console.error(e);
    }
    if (!report) {
      $("empty").classList.remove("hidden");
      return;
    }
    $("report").classList.remove("hidden");
    render(report);
  }

  function sevLabel(s) {
    return s === "high" ? "Critical" : s === "medium" ? "Moderate" : "Minor";
  }

  load();
})();
