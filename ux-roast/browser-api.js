/* Cross-browser WebExtension namespace shim.
 * Firefox exposes `browser` (promise-based); Chrome exposes `chrome`.
 * In MV3 both return promises for the APIs we use (scripting, tabs, storage),
 * so a simple alias is enough. Exposed as window.uxApi. */
(function () {
  const api = typeof browser !== "undefined" && browser.runtime ? browser : chrome;
  if (typeof window !== "undefined") window.uxApi = api;
})();
