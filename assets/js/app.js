/* CineDhol shared helpers */
(function () {
  const C = window.CINEDHOL || {};
  const API = "https://api.themoviedb.org/3";
  const IMG = "https://image.tmdb.org/t/p/";

  const hasKey = () => !!(C.TMDB_API_KEY && C.TMDB_API_KEY.trim());

  function img(path, size) {
    if (!path) return "assets/img/placeholder.svg";
    return IMG + (size || "w500") + path;
  }

  async function tmdb(path, params) {
    if (!hasKey()) throw new Error("no-api-key");
    const q = new URLSearchParams(
      Object.assign(
        { api_key: C.TMDB_API_KEY, language: C.TMDB_LANG || "en-US", region: C.TMDB_REGION || "BD" },
        params || {}
      )
    );
    const res = await fetch(API + path + "?" + q.toString());
    if (!res.ok) throw new Error("tmdb-" + res.status);
    return res.json();
  }

  function yearOf(m) {
    const d = m.release_date || m.first_air_date || "";
    return d ? d.slice(0, 4) : "—";
  }

  function ratingOf(m) {
    const v = m.vote_average;
    return v ? Number(v).toFixed(1) : "NR";
  }

  function detailUrl(m) {
    const type = m.media_type === "tv" ? "tv" : "movie";
    return "movie.html?type=" + type + "&id=" + m.id;
  }

  function card(m) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = detailUrl(m);
    const title = m.title || m.name || "Untitled";
    a.innerHTML =
      '<img loading="lazy" src="' + img(m.poster_path, "w342") + '" alt="' + esc(title) + ' poster">' +
      '<div class="card-body">' +
        '<div class="card-title">' + esc(title) + "</div>" +
        '<div class="card-sub"><span>' + yearOf(m) + '</span><span class="rating">★ ' + ratingOf(m) + "</span></div>" +
      "</div>";
    return a;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function rowShell(title, linkHref) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.innerHTML =
      '<div class="wrap"><div class="section-head"><h2>' + esc(title) + "</h2>" +
      (linkHref ? '<a href="' + linkHref + '">View all →</a>' : "") +
      '</div><div class="row"></div></div>';
    return sec;
  }

  function spinner(el) {
    el.innerHTML = '<div class="spinner"></div>';
  }

  function setupNotice() {
    const n = document.createElement("div");
    n.className = "wrap";
    n.innerHTML =
      '<div class="notice"><strong>Setup needed:</strong> paste your free TMDB API key into ' +
      "<code>assets/js/config.js</code> (get one at themoviedb.org → Settings → API). " +
      "The site will go live automatically once the key is saved.</div>";
    return n;
  }

  /* ---- AdSense ---- */
  function fillSlot(slot, client) {
    if (slot.dataset.adDone) return;
    slot.dataset.adDone = "1";
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", client);
    ins.setAttribute("data-ad-slot", slot.getAttribute("data-ad-slot") || "");
    ins.setAttribute("data-ad-format", slot.getAttribute("data-ad-format") || "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    slot.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  function loadAdsScript(client, done) {
    if (document.querySelector('script[data-adsbygoogle]')) { done && done(); return; }
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-adsbygoogle", "1");
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    s.crossOrigin = "anonymous";
    s.onload = function () { done && done(); };
    document.head.appendChild(s);
  }

  function processSlots() {
    const client = ((window.CINEDHOL || {}).ADSENSE_CLIENT_ID || "").trim();
    document.querySelectorAll(".ad-slot").forEach(function (slot) {
      if (!client) { slot.style.display = "none"; return; }
      slot.style.display = "";
      if (!slot.querySelector(".ad-label")) {
        const l = document.createElement("div");
        l.className = "ad-label";
        l.textContent = "Advertisement";
        slot.prepend(l);
      }
      fillSlot(slot, client);
    });
  }

  function initAds() {
    const client = ((window.CINEDHOL || {}).ADSENSE_CLIENT_ID || "").trim();
    if (!client) {
      document.querySelectorAll(".ad-slot").forEach(function (s) { s.style.display = "none"; });
      return;
    }
    loadAdsScript(client, processSlots);
  }

  function adSlot(slotId, format) {
    return (
      '<div class="ad-slot" data-ad-slot="' + (slotId || "") + '" data-ad-format="' + (format || "auto") + '">' +
      '<div class="ad-label">Advertisement</div></div>'
    );
  }

  /* ---- header search ---- */
  function initSearch(formId, inputId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const q = document.getElementById(inputId).value.trim();
      if (q) location.href = "search.html?q=" + encodeURIComponent(q);
    });
  }

  function markActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      if (a.getAttribute("href") === path) a.classList.add("active");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initAds();
    markActiveNav();
  });

  window.CD = {
    config: C, hasKey: hasKey, tmdb: tmdb, img: img, card: card,
    esc: esc, yearOf: yearOf, ratingOf: ratingOf, detailUrl: detailUrl,
    rowShell: rowShell, spinner: spinner, setupNotice: setupNotice,
    adSlot: adSlot, initSearch: initSearch, refreshAds: processSlots,
  };
})();
