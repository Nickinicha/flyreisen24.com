(function(){
  function addAlerts(){
    var menu=document.getElementById("topNavMenu");
    if(!menu || document.getElementById("navAlertsLink")) return;
    var lang=(document.documentElement.lang||"th").slice(0,2);
    var alertsHref= lang==="en" ? "/en/travel-alerts/index.html" : "/th/travel-alerts/index.html";
    var futureHref= lang==="en" ? "/en/guides/future-air-taxi.html" : "/th/guides/future-air-taxi.html";
    var li=document.createElement("li");
    li.innerHTML='<a href="'+alertsHref+'" id="navAlertsLink"><i class="fas fa-bullhorn"></i> <span id="navAlerts">Travel Alerts</span></a>';
    menu.appendChild(li);
    var tools=menu.querySelector("#navToolsLink");
    if(tools && !document.getElementById("navFutureLink")){
      var wrap=tools.closest("ul");
      if(wrap){
        var f=document.createElement("li");
        f.innerHTML='<a href="'+futureHref+'" id="navFutureLink"><i class="fas fa-helicopter"></i> <span id="navFuture">\u0e2d\u0e19\u0e32\u0e04\u0e15\u0e01\u0e32\u0e23\u0e40\u0e14\u0e34\u0e19\u0e17\u0e32\u0e07</span></a>';
        wrap.appendChild(f);
      }
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", addAlerts);
  else addAlerts();
  window.addEventListener("load", addAlerts);
})();
