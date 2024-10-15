"use strict";

(function () {
  const weloopSrc = "https://cdn.weloop.ai/snippet/weloopai.js";

  function injectScript(src, key) {
    const children = document.querySelectorAll("script[data-id='weloopai']");
    if (children.length === 0 && key) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-id", "weloopai");
      script.setAttribute("data-key", key);
      parent.document.body.append(script);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    //view mode -> hide extension
    const tableauUrl =
      window.location !== window.parent.location
        ? document.referrer
        : document.location.href;
    const parser = new URL(tableauUrl);
    if (parser.pathname.includes("/views") && window.frameElement) {
      const currentIframeId = window.frameElement.id;
      const numberId = currentIframeId.split("_").pop();
      const divPanelId = "tabZoneId" + numberId;
      parent.document.getElementById(divPanelId).style.display = "none";
    }

    if (typeof parent.weloopai !== "undefined") {
      return false;
    }

    tableau.extensions.initializeAsync().then(function () {
      tableau.extensions.dashboardContent.dashboard
        .getParametersAsync()
        .then(function (params) {
          const weloopParams =
            params && params.find((param) => param.name === "WeLoopProjectKey");
          if (
            weloopParams &&
            weloopParams.currentValue &&
            weloopParams.currentValue.value
          ) {
            injectScript(weloopSrc, weloopParams.currentValue.value);
          }
        });
    });
  });
})();
