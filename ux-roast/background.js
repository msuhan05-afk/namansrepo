/*
 * UX Roast — background service worker.
 *
 * The heavy lifting happens in the popup (it injects the analyzer and captures
 * the tab). This worker exists so the action has a stable home, opens the full
 * report, and offers a screenshot fallback for browsers that restrict
 * captureVisibleTab to a background/extension context.
 */
const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "UXROAST_CAPTURE") {
    const opts = { format: "jpeg", quality: 70 };
    const done = (dataUrl) => sendResponse({ ok: !!dataUrl, dataUrl: dataUrl || null });
    try {
      const p = api.tabs.captureVisibleTab(msg.windowId, opts);
      if (p && typeof p.then === "function") {
        p.then(done).catch(() => done(null));
      } else {
        // Chrome MV2-style callback fallback.
        api.tabs.captureVisibleTab(msg.windowId, opts, done);
      }
    } catch (e) {
      done(null);
    }
    return true; // keep the message channel open for the async response
  }

  if (msg && msg.type === "UXROAST_OPEN_REPORT") {
    api.tabs.create({ url: api.runtime.getURL("report.html") });
    sendResponse({ ok: true });
    return true;
  }
});
