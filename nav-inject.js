(function () {
  function addResourceLinks() {
    var knowledge = document.getElementById("navKnowledgeLink");
    var wrap = knowledge ? knowledge.closest("ul") : null;
    if (!wrap) return;
    var lang = (document.documentElement.lang || "th").slice(0, 2);
    var alertsHref = lang === "en" ? "/en/travel-alerts/index.html" : "/th/travel-alerts/index.html";
    var futureHref = lang === "en" ? "/en/guides/future-air-taxi.html" : "/th/guides/future-air-taxi.html";
    if (!document.getElementById("navFutureLink")) {
      var f = document.createElement("li");
      f.innerHTML = '<a href="' + futureHref + '" id="navFutureLink"><i class="fas fa-helicopter"></i> <span id="navFuture">' + (lang === "en" ? "Future travel" : "อนาคตการเดินทาง") + "</span></a>";
      wrap.appendChild(f);
    }
    var alerts = document.getElementById("navAlertsLink");
    if (!alerts) {
      var a = document.createElement("li");
      a.innerHTML = '<a href="' + alertsHref + '" id="navAlertsLink"><i class="fas fa-bullhorn"></i> <span id="navAlerts">Travel Alerts</span></a>';
      wrap.appendChild(a);
    } else if (alerts.closest("ul") !== wrap) {
      wrap.appendChild(alerts.closest("li") || alerts.parentElement);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addResourceLinks);
  else addResourceLinks();
  window.addEventListener("load", addResourceLinks);
})();
