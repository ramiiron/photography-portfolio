/* photos.js — carga data/photos.json y asigna cada foto a su slot.
   La ÚNICA fuente de verdad de las fotos es data/photos.json (+ los archivos
   en assets/images/slots/). El HTML solo declara el nombre del slot. */
(function () {
  "use strict";

  function applySlot(el, entry) {
    var img = el.querySelector("img");
    if (!img) return;
    img.src = entry.src;
    img.alt = entry.alt || "";
  }

  function init() {
    fetch("data/photos.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        window.RB_PHOTOS = data;
        document.querySelectorAll("[data-photo-slot]").forEach(function (el) {
          var entry = data.slots[el.getAttribute("data-photo-slot")];
          if (entry) applySlot(el, entry);
        });
        document.dispatchEvent(new CustomEvent("photos:ready"));
      })
      .catch(function () {
        /* Si photos.json no carga (ej. abrir el archivo local sin servidor),
           cada <img> ya trae su src por defecto en el HTML. */
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
