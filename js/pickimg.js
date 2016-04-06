/* global MozActivity, alert, console, Notification */
"use strict";
(function () {

    // WebActivities
    var pickImage = document.getElementById("player-photo");
    if (pickImage) {
        pickImage.onclick = function () {
            var pick = new MozActivity({
                name: "pick",
                data: {
                  type: ["image/png", "image/jpg", "image/jpeg"],
                    // In FxOS 1.3 and before the user is allowed to crop the
                    // image by default, but this can cause out-of-memory issues
                    // so we explicitly disable it.
                    nocrop: true // don't allow the user to crop the image
                }
            });

            pick.onsuccess = function () {
                // var selImg;
                var img = document.createElement("img");
                img.src = window.URL.createObjectURL(this.result.blob);
                img.style.width = "100px";
                img.style.height = "100px";
                img.id = "player-photo";
                img.className = "player-photo";

                // document.getElementById("logger").innerHTML = this.result.toString();
                console.log(this.result);
                console.log(this.result.blob);
                // console.log(window.URL.createObjectURL(this.result.blob.mozFullPath) );


                var imagePresenter = document.querySelector("#image-presenter");
                imagePresenter.removeChild(document.getElementById("player-photo"));
                imagePresenter.appendChild(img);
                imagePresenter.style.display = "block";

                // asyncStorage.setItem('player-photo', window.URL.createObjectURL(this.result.blob), function() {
                asyncStorage.setItem('player-photo', this.result.blob, function() {
                  console.log('player-photo stored');
                    console.log(this.result.blob);
                  window.URL.revokeObjectURL(this.result.blob);  /* uvolni se z pameti */

                  document.location.reload(true);
                });

            };

            pick.onerror = function () {
                console.error("Can't load the image");
            };
        };
    }

})();
