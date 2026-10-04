/* CineDhol movie / TV detail page */
document.addEventListener("DOMContentLoaded", async function () {
  CD.initSearch("searchForm", "searchInput");
  const main = document.getElementById("detailContent");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const type = params.get("type") === "tv" ? "tv" : "movie";

  if (!id) {
    main.innerHTML = '<div class="wrap"><p class="empty">No title selected. <a href="index.html">Go home</a></p></div>';
    return;
  }
  if (!CD.hasKey()) {
    main.appendChild(CD.setupNotice());
    return;
  }

  try {
    const d = await CD.tmdb("/" + type + "/" + id, {
      append_to_response: "credits,videos,similar,watch/providers",
    });
    render(d);
  } catch (err) {
    main.innerHTML = '<div class="wrap"><p class="empty">Could not load this title. It may have been removed.</p></div>';
  }

  function render(d) {
    const title = d.title || d.name || "Untitled";
    document.title = title + " (" + CD.yearOf(d) + ") — CineDhol";
    const trailer = (d.videos && d.videos.results || []).find(function (v) {
      return v.site === "YouTube" && v.type === "Trailer";
    }) || (d.videos && d.videos.results || []).find(function (v) { return v.site === "YouTube"; });

    const prov = (((d["watch/providers"] || {}).results || {})[CD.config.TMDB_REGION] || {});
    const flat = prov.flatrate || [];
    const rent = prov.rent || [];
    const buy = prov.buy || [];

    function provBlock(label, list) {
      if (!list.length) return "";
      return "<h3 class='block-title'>Watch " + label + "</h3><div class='providers'>" +
        list.map(function (p) {
          return '<span class="provider"><img loading="lazy" src="' + CD.img(p.logo_path, "w92") +
            '" alt="' + CD.esc(p.provider_name) + '"><span>' + CD.esc(p.provider_name) + "</span></span>";
        }).join("") + "</div>";
    }

    const cast = (d.credits && d.credits.cast || []).slice(0, 12);
    const similar = (d.similar && d.similar.results || []).slice(0, 12);

    main.innerHTML =
      '<div class="detail-hero"><div class="detail-bg" style="background-image:url(' + CD.img(d.backdrop_path, "w1280") + ')"></div>' +
      '<div class="wrap"><div class="detail-inner">' +
        '<img class="poster" src="' + CD.img(d.poster_path, "w500") + '" alt="' + CD.esc(title) + ' poster">' +
        '<div class="detail-info">' +
          "<h1>" + CD.esc(title) + "</h1>" +
          (d.tagline ? '<div class="tagline">“' + CD.esc(d.tagline) + "”</div>" : "") +
          '<div class="meta-row">' +
            "<span><strong>★ " + CD.ratingOf(d) + "</strong> / 10</span>" +
            "<span>" + CD.yearOf(d) + "</span>" +
            (d.runtime ? "<span>" + d.runtime + " min</span>" : "") +
            (d.number_of_seasons ? "<span>" + d.number_of_seasons + " season(s)</span>" : "") +
            "<span>" + CD.esc((d.original_language || "").toUpperCase()) + "</span>" +
          "</div>" +
          '<div class="genres">' + (d.genres || []).map(function (g) {
            return '<span class="genre-tag">' + CD.esc(g.name) + "</span>";
          }).join("") + "</div>" +
          '<p class="overview">' + CD.esc(d.overview || "No overview available.") + "</p>" +
          '<div class="actions">' +
            (trailer ? '<a class="btn" href="#trailer">▶ Watch Trailer</a>' : "") +
            '<a class="btn ghost" href="reviews.html">Read Reviews</a>' +
          "</div>" +
        "</div>" +
      "</div></div></div>" +

      '<div class="wrap">' +
        CD.adSlot("", "auto") +
        (trailer
          ? "<h3 class='block-title' id='trailer'>Official Trailer</h3>" +
            '<div class="trailer-wrap"><iframe src="https://www.youtube.com/embed/' + trailer.key +
            '" title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
          : "") +
        provBlock("now on", flat) + provBlock("for rent on", rent) + provBlock("to buy on", buy) +
        (flat.length + rent.length + buy.length === 0
          ? "<h3 class='block-title'>Where to Watch</h3><p class='review-meta'>Streaming availability for your region is not listed right now. Check Netflix, Prime Video or your local services.</p>"
          : "") +
        (cast.length ? "<h3 class='block-title'>Top Cast</h3><div class='cast-row'>" +
          cast.map(function (c) {
            return '<div class="cast"><img loading="lazy" src="' + CD.img(c.profile_path, "w185") +
              '" alt="' + CD.esc(c.name) + '"><div class="n">' + CD.esc(c.name) +
              '</div><div class="c">' + CD.esc(c.character || "") + "</div></div>";
          }).join("") + "</div>" : "") +
        CD.adSlot("", "auto") +
        (similar.length ? "<h3 class='block-title'>You May Also Like</h3><div class='row' id='simRow'></div>" : "") +
      "</div>";

    const simRow = document.getElementById("simRow");
    if (simRow) similar.forEach(function (m) {
      m.media_type = type;
      simRow.appendChild(CD.card(m));
    });
    // render ad slots added dynamically by render()
    CD.refreshAds();
  }
});
