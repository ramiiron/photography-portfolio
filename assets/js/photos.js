/* photos.js — carga data/photos.json y asigna cada foto a su slot.
   La ÚNICA fuente de verdad de las fotos es data/photos.json (+ los archivos
   en assets/images/slots/). El HTML solo declara el nombre del slot.
   Los cambios del modo editor (localStorage) tienen prioridad como vista previa. */
(function () {
  "use strict";
  var STORAGE_KEY = "rbphoto.overrides.v1";

  function getOverrides() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function applySlot(el, entry, override) {
    var img = el.querySelector("img");
    if (!img) return;
    img.src = override || entry.src;
    img.alt = entry.alt || "";
    el.setAttribute("data-photo-label", entry.label || el.getAttribute("data-photo-slot"));
    if (override) el.classList.add("has-override");
  }

  function init() {
    fetch("data/photos.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var overrides = getOverrides();
        window.RB_PHOTOS = data;
        document.querySelectorAll("[data-photo-slot]").forEach(function (el) {
          var id = el.getAttribute("data-photo-slot");
          var entry = data.slots[id];
          if (entry) applySlot(el, entry, overrides[id]);
        });
        document.dispatchEvent(new CustomEvent("photos:ready"));
      })
      .catch(function () {
        /* Si photos.json no carga (ej. abrir el archivo local sin servidor),
           cada <img> ya trae su src por defecto en el HTML. */
      });
  }

  window.RBPhotoStore = { getOverrides: getOverrides, STORAGE_KEY: STORAGE_KEY };
  document.addEventListener("DOMContentLoaded", init);
})();
