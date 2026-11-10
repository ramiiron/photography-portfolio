/* editor.js — modo "Cambiar fotos" sin tocar código.
   Activación: botón "Cambiar fotos" del footer, o abrir la página con ?edit=1.
   En modo editor, cada foto muestra su nombre de slot; al hacerle clic se puede
   - subir un archivo desde el computador/teléfono (se comprime a máx. 1600px), o
   - pegar el link (URL) de una foto ya subida.
   Los cambios quedan guardados en ESTE navegador como vista previa.
   "Descargar photos.json" genera el archivo actualizado para reemplazar
   data/photos.json en GitHub (subir el archivo, sin editar código). */
(function () {
  "use strict";
  var currentSlot = null;

  function store() { return window.RBPhotoStore; }

  function setOverride(slotId, value) {
    var all = store().getOverrides();
    if (value) all[slotId] = value; else delete all[slotId];
    localStorage.setItem(store().STORAGE_KEY, JSON.stringify(all));
  }

  function refreshSlot(slotId) {
    var el = document.querySelector('[data-photo-slot="' + slotId + '"]');
    if (!el || !window.RB_PHOTOS) return;
    var entry = window.RB_PHOTOS.slots[slotId];
    var img = el.querySelector("img");
    var override = store().getOverrides()[slotId];
    if (img && entry) img.src = override || entry.src;
    el.classList.toggle("has-override", !!override);
  }

  function openDialog(slotId) {
    currentSlot = slotId;
    var entry = window.RB_PHOTOS && window.RB_PHOTOS.slots[slotId];
    document.getElementById("editor-slot-name").textContent =
      (entry ? entry.label : slotId) + "  ·  archivo: " + slotId + ".jpg";
    document.getElementById("editor-url").value = store().getOverrides()[slotId] || "";
    document.getElementById("editor-file").value = "";
    document.getElementById("editor-dialog").classList.add("open");
  }

  function closeDialog() {
    document.getElementById("editor-dialog").classList.remove("open");
    currentSlot = null;
  }

  function fileToDataUrl(file, done) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1600;
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        if (scale >= 1) { done(reader.result); return; }
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        done(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function downloadJson() {
    if (!window.RB_PHOTOS) return;
    var data = JSON.parse(JSON.stringify(window.RB_PHOTOS));
    var overrides = store().getOverrides();
    Object.keys(overrides).forEach(function (slotId) {
      if (data.slots[slotId] && overrides[slotId].indexOf("data:") !== 0) {
        data.slots[slotId].src = overrides[slotId];
      }
    });
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "photos.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function enableEditMode() {
    document.body.classList.add("edit-mode");
    if (location.search.indexOf("edit=1") === -1) {
      history.replaceState(null, "", location.pathname + "?edit=1" + location.hash);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (location.search.indexOf("edit=1") !== -1) document.body.classList.add("edit-mode");

    var btn = document.getElementById("edit-photos-btn");
    if (btn) btn.addEventListener("click", enableEditMode);

    document.getElementById("editor-exit").addEventListener("click", function () {
      document.body.classList.remove("edit-mode");
    });
    document.getElementById("editor-reset-all").addEventListener("click", function () {
      localStorage.removeItem(store().STORAGE_KEY);
      Object.keys(window.RB_PHOTOS ? window.RB_PHOTOS.slots : {}).forEach(refreshSlot);
    });
    document.getElementById("editor-download").addEventListener("click", downloadJson);

    document.querySelectorAll("[data-photo-slot]").forEach(function (el) {
      el.addEventListener("click", function () {
        if (document.body.classList.contains("edit-mode")) openDialog(el.getAttribute("data-photo-slot"));
      });
    });

    document.getElementById("editor-apply-url").addEventListener("click", function () {
      var url = document.getElementById("editor-url").value.trim();
      if (currentSlot && url) { setOverride(currentSlot, url); refreshSlot(currentSlot); }
      closeDialog();
    });
    document.getElementById("editor-file").addEventListener("change", function (ev) {
      var file = ev.target.files[0];
      if (!file || !currentSlot) return;
      var slot = currentSlot;
      fileToDataUrl(file, function (dataUrl) { setOverride(slot, dataUrl); refreshSlot(slot); });
      closeDialog();
    });
    document.getElementById("editor-reset-slot").addEventListener("click", function () {
      if (currentSlot) { setOverride(currentSlot, null); refreshSlot(currentSlot); }
      closeDialog();
    });
    document.getElementById("editor-cancel").addEventListener("click", closeDialog);
  });
})();
