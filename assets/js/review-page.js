/* CineDhol single review page */
document.addEventListener("DOMContentLoaded", function () {
  CD.initSearch("searchForm", "searchInput");
  const main = document.getElementById("reviewContent");
  const slug = new URLSearchParams(location.search).get("slug");
  const r = (window.CINEDHOL_REVIEWS || []).find(function (x) { return x.slug === slug; });

  if (!r) {
    main.innerHTML = '<div class="wrap"><p class="empty">Review not found. <a href="reviews.html">All reviews</a></p></div>';
    return;
  }

  document.title = r.title + " — Review — CineDhol";

  function stars(n) {
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }
  function list(items) {
    return "<ul>" + (items || []).map(function (x) { return "<li>" + CD.esc(x) + "</li>"; }).join("") + "</ul>";
  }

  main.innerHTML =
    '<div class="wrap"><div class="page">' +
    "<h1>" + CD.esc(r.title) + "</h1>" +
    '<div class="review-meta"><span class="stars">' + stars(r.stars) + "</span> · " +
    CD.esc(r.year || "") + " · Published " + CD.esc(r.date || "") + "</div>" +
    '<div class="review-full">' +
    (r.body || []).map(function (p) { return "<p>" + CD.esc(p) + "</p>"; }).join("") +
    "</div>" +
    '<div class="pros-cons"><div><h4>✅ What works</h4>' + list(r.pros) +
    "</div><div><h4>❌ What doesn't</h4>" + list(r.cons) + "</div></div>" +
    '<p><a href="reviews.html">← All reviews</a></p>' +
    "</div></div>" +
    '<div class="wrap">' + CD.adSlot("", "auto") + "</div>";

  CD.refreshAds();
});
