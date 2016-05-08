// <button id="install-btn">Install</button>
/* global alert, console */
"use strict";
// Install app
if (navigator.mozApps) {
    var checkIfInstalled = navigator.mozApps.getSelf();
    checkIfInstalled.onsuccess = function () {
        if (checkIfInstalled.result) {
            // Already installed
            console.log("Installed");
        } else {
          if (navigator.userAgent.indexOf('Firefox') > -1 && navigator.userAgent.indexOf("Mobile") > -1) {
            // If is Firefox OS
            var installBtn = document.createElement("button");
            var installBtnContainer = document.querySelector("#install-btn-container");
            installBtn.id = "install-btn";
            installBtn.className = "ui-btn";
            installBtn.innerHTML = "Install"
            installBtnContainer.appendChild(installBtn);
            var manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
            installBtn.onclick = function () {
                var installApp = navigator.mozApps.install(manifestURL);
                installApp.onsuccess = function() {
                    installBtn.style.display = "none";
                };
                installApp.onerror = function() {
                    alert("Install failed\n\n:" + installApp.error.name);
                };
            };
          }
        }
    };
} else {
  console.log("Open Web Apps not supported");
}
