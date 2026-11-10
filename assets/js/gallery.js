/* gallery.js — carga data/gallery.json, arma la grilla con filtros por
   categoría y el lightbox. La ÚNICA fuente de la galería es data/gallery.json
   (+ los archivos en assets/images/gallery/). */
(function () {
  "use strict";

  var grid = document.getElementById("gallery-grid");
  var filtersEl = document.getElementById("gallery-filters");
  var countEl = document.getElementById("gallery-count");
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCap = document.getElementById("lightbox-caption");
  var lbCounter = document.getElementById("lightbox-counter");

  var photos = [];
  var visible = [];
  var current = 0;

  function render(list) {
    visible = list;
    grid.innerHTML = "";
    list.forEach(function (p, i) {
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = p.src;
      img.alt = p.alt || "";
      img.loading = "lazy";
      fig.appendChild(img);
      fig.addEventListener("click", function () { openLb(i); });
      grid.appendChild(fig);
    });
    countEl.textContent = list.length + (list.length === 1 ? " photo" : " photos");
  }

  function setFilter(cat, btn) {
    filtersEl.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.toggle("active", b === btn);
    });
    render(cat === "all" ? photos : photos.filter(function (p) { return p.cat === cat; }));
  }

  function openLb(i) {
    current = i;
    show();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  function show() {
    var p = visible[current];
    lbImg.src = p.src;
    lbImg.alt = p.alt || "";
    lbCap.textContent = p.alt || "";
    lbCounter.textContent = (current + 1) + " / " + visible.length;
  }
  function step(d) {
    current = (current + d + visible.length) % visible.length;
    show();
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLb);
  document.getElementById("lightbox-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("lightbox-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  fetch("data/gallery.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      photos = data.photos || [];
      var all = document.createElement("button");
      all.type = "button";
      all.className = "filter-btn active";
      all.textContent = "All";
      all.addEventListener("click", function () { setFilter("all", all); });
      filtersEl.appendChild(all);
      (data.categories || []).forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "filter-btn";
        b.textContent = c.label;
        b.addEventListener("click", function () { setFilter(c.id, b); });
        filtersEl.appendChild(b);
      });
      render(photos);
    })
    .catch(function () {
      countEl.textContent = "The gallery could not be loaded.";
    });
})();
