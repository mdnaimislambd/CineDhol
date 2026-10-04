/* CineDhol search results page */
document.addEventListener("DOMContentLoaded", async function () {
  CD.initSearch("searchForm", "searchInput");
  const main = document.getElementById("searchContent");
  const params = new URLSearchParams(location.search);
  const q = (params.get("q") || "").trim();

  document.getElementById("searchInput").value = q;
  document.title = (q ? 'Results for "' + q + '"' : "Search") + " — CineDhol";

  if (!q) {
    main.innerHTML = '<div class="wrap"><p class="empty">Type a movie or show name in the search box above.</p></div>';
    return;
  }
  if (!CD.hasKey()) {
    main.appendChild(CD.setupNotice());
    return;
  }

  let page = 1, totalPages = 1;
  main.innerHTML =
    '<div class="wrap"><div class="section"><div class="section-head"><h2>Results for "' +
    CD.esc(q) + '"</h2></div><div class="grid" id="resGrid"></div>' +
    '<div class="center"><button class="btn ghost" id="moreBtn" style="display:none">Load more</button></div></div></div>' +
    CD.adSlot("", "auto");

  const grid = document.getElementById("resGrid");
  const moreBtn = document.getElementById("moreBtn");
  moreBtn.onclick = function () { page++; load(); };

  async function load() {
    try {
      if (page === 1) CD.spinner(grid);
      const data = await CD.tmdb("/search/multi", { query: q, page: page, include_adult: "false" });
      const items = (data.results || []).filter(function (m) {
        return (m.media_type === "movie" || m.media_type === "tv") && m.poster_path;
      });
      if (page === 1) {
        grid.innerHTML = "";
        if (!items.length && !(data.results || []).length) {
          grid.innerHTML = '<p class="empty">No results found. Try another title.</p>';
        }
      }
      items.forEach(function (m) { grid.appendChild(CD.card(m)); });
      totalPages = data.total_pages || 1;
      moreBtn.style.display = page < totalPages ? "" : "none";
      CD.refreshAds();
    } catch (err) {
      grid.innerHTML = '<p class="empty">Search failed. Check your API key and try again.</p>';
    }
  }
  load();
});
