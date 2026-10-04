/* CineDhol reviews list page */
document.addEventListener("DOMContentLoaded", function () {
  CD.initSearch("searchForm", "searchInput");
  const main = document.getElementById("reviewsContent");
  const reviews = (window.CINEDHOL_REVIEWS || []).slice().sort(function (a, b) {
    return (b.date || "").localeCompare(a.date || "");
  });

  function stars(n) {
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  let html = '<div class="wrap"><div class="page" style="padding-bottom:10px">' +
    "<h1>Movie Reviews</h1>" +
    "<p>Honest, spoiler-free reviews written by the CineDhol team. No downloads, no piracy — just opinions.</p>" +
    "</div>";

  if (!reviews.length) {
    html += '<div class="wrap"><p class="empty">No reviews yet. Check back soon.</p></div>';
  } else {
    html += '<div class="wrap">';
    reviews.forEach(function (r) {
      html +=
        '<article class="review-card">' +
        '<h3><a href="review.html?slug=' + encodeURIComponent(r.slug) + '">' + CD.esc(r.title) + "</a></h3>" +
        '<div class="review-meta"><span class="stars">' + stars(r.stars) + "</span> · " +
        CD.esc(r.year || "") + " · " + CD.esc(r.date || "") + "</div>" +
        '<p class="review-excerpt">' + CD.esc(r.excerpt || "") + "</p>" +
        '<p><a href="review.html?slug=' + encodeURIComponent(r.slug) + '">Read full review →</a></p>' +
        "</article>";
    });
    html += "</div>";
  }

  html += '<div class="wrap">' + CD.adSlot("", "auto") + "</div>";
  main.innerHTML = html;
  CD.refreshAds();
});
