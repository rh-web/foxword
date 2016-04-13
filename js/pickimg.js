"use strict";
(function () {
    // WebActivity - pick an image
    var pickImage = document.getElementById("photo-presenter");
    if (pickImage) {
        pickImage.onclick = function () {
            var pick = new MozActivity({
                name: "pick",
                data: {
                  type: ["image/png", "image/jpg", "image/jpeg"],
                  nocrop: true // don't allow the user to crop the image
                }
            });

            pick.onsuccess = function () {
                var img = document.createElement("img");
                img.src = window.URL.createObjectURL(this.result.blob);
                img.id = "player-photo";
                img.className = "player-photo";

                console.log(this.result);
                console.log(this.result.blob);
                console.log(window.URL.createObjectURL(this.result.blob));

                var imagePresenter = document.querySelector("#photo-presenter");
                imagePresenter.removeChild(document.getElementById("player-photo"));
                imagePresenter.appendChild(img);
                imagePresenter.style.display = "block";

                asyncStorage.setItem('player-photo', this.result.blob, function() {
                  console.log('player-photo stored');
                  document.location.reload(true);
                });
                window.URL.revokeObjectURL(this.result.blob);  // release memory
            };

            pick.onerror = function () {
                console.error("Can't load the image");
            };
        };
    }

})();
