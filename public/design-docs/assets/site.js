/* PI-DS 문서 사이트 동작 — 테마 토글·모바일 내비·검색. 정본: build/assets/site.js */
(function () {
  "use strict";

  // ── 테마 토글 ──
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var root = document.documentElement;
      var cur = root.getAttribute("data-theme");
      var os = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = (cur || os) === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("pids-theme", next);
    });
  }

  // ── 모바일 내비 ──
  var navBtn = document.querySelector(".nav-toggle");
  if (navBtn) {
    navBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      navBtn.setAttribute("aria-expanded", String(open));
      navBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
  }

  // ── 검색 ──
  var input = document.getElementById("search");
  var results = document.getElementById("search-results");
  if (!input || !results) return;
  var index = null;

  function load() {
    if (index) return Promise.resolve(index);
    return fetch((window.PIDS_REL || "./") + "assets/search-index.json")
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; return index; });
  }

  function render(items, q) {
    if (!items.length) {
      results.innerHTML = '<div class="sr-empty">"' + q.replace(/</g, "&lt;") + '" 검색 결과 없음</div>';
    } else {
      results.innerHTML = items.slice(0, 8).map(function (it) {
        var pos = it.text.toLowerCase().indexOf(q.toLowerCase());
        var snippet = pos >= 0 ? it.text.slice(Math.max(0, pos - 20), pos + 60) : it.text.slice(0, 80);
        return '<a href="' + (window.PIDS_REL || "./") + it.url + '">' +
          '<span class="sr-title">' + it.title.replace(/</g, "&lt;") + "</span>" +
          '<span class="sr-text">…' + snippet.replace(/</g, "&lt;") + "…</span></a>";
      }).join("");
    }
    results.hidden = false;
  }

  input.addEventListener("input", function () {
    var q = input.value.trim();
    if (q.length < 2) { results.hidden = true; return; }
    load().then(function (idx) {
      var ql = q.toLowerCase();
      var hits = idx.filter(function (it) {
        return it.title.toLowerCase().indexOf(ql) >= 0 ||
          it.headings.join(" ").toLowerCase().indexOf(ql) >= 0 ||
          it.text.toLowerCase().indexOf(ql) >= 0;
      });
      // 제목 일치 우선
      hits.sort(function (a, b) {
        return (b.title.toLowerCase().indexOf(ql) >= 0 ? 1 : 0) - (a.title.toLowerCase().indexOf(ql) >= 0 ? 1 : 0);
      });
      render(hits, q);
    });
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { results.hidden = true; input.blur(); }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".site-search")) results.hidden = true;
  });
})();
