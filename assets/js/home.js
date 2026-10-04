/* CineDhol home page */
document.addEventListener("DOMContentLoaded", async function () {
  CD.initSearch("searchForm", "searchInput");
  const main = document.getElementById("homeContent");

  if (!CD.hasKey()) {
    main.appendChild(CD.setupNotice());
    return;
  }

  try {
    // Hero: trending this week
    const trending = await CD.tmdb("/trending/movie/week", { page: 1 });
    buildHero(trending.results.slice(0, 5));

    // Ad slot under hero
    main.insertAdjacentHTML("beforeend", CD.adSlot("", "auto"));

    // Rows
    addRow(main, "Trending This Week", null, trending.results);
    const popular = await CD.tmdb("/movie/popular", { page: 1 });
    addRow(main, "Popular Movies", null, popular.results);

    main.insertAdjacentHTML("beforeend", CD.adSlot("", "auto"));

    const top = await CD.tmdb("/movie/top_rated", { page: 1 });
    addRow(main, "Top Rated", null, top.results);

    // Bollywood + South Indian rows (legal discovery via TMDB)
    const hindi = await CD.tmdb("/discover/movie", {
      with_original_language: "hi", sort_by: "popularity.desc", page: 1,
    });
    addRow(main, "Bollywood Hits", null, hindi.results);

    const south = await CD.tmdb("/discover/movie", {
      with_original_language: "te|ta|ml|kn", sort_by: "popularity.desc", page: 1,
    });
    addRow(main, "South Indian Cinema", null, south.results);

    const bd = await CD.tmdb("/discover/movie", {
      with_origin_country: "BD", sort_by: "popularity.desc", page: 1,
    });
    addRow(main, "Bangladeshi Cinema", null, bd.results);

    // Genre browser
    buildGenres(main);

    // render any ad slots added dynamically above
    CD.refreshAds();
  } catch (err) {
    main.innerHTML =
      '<div class="wrap"><div class="notice"><strong>Could not load movies.</strong> ' +
      "Check your TMDB API key in <code>assets/js/config.js</code> and reload.</div></div>";
  }

  function addRow(parent, title, link, items) {
    const sec = CD.rowShell(title, link);
    const row = sec.querySelector(".row");
    items.slice(0, 20).forEach(function (m) { row.appendChild(CD.card(m)); });
    parent.appendChild(sec);
  }

  function buildHero(items) {
    const hero = document.getElementById("hero");
    let i = 0;
    function show(n) {
      i = (n + items.length) % items.length;
      const m = items[i];
      hero.querySelector(".hero-bg").style.backgroundImage =
        "url(" + CD.img(m.backdrop_path, "w1280") + ")";
      hero.querySelector(".hero-kicker").textContent = "# " + (i + 1) + " trending this week";
      hero.querySelector("h1").textContent = m.title || m.name;
      hero.querySelector(".hero-desc").textContent = (m.overview || "").slice(0, 180) + "…";
      hero.querySelector(".hero-meta").innerHTML =
        "<span>★ " + CD.ratingOf(m) + "</span><span>" + CD.yearOf(m) + "</span>";
      hero.querySelector(".hero-link").href = CD.detailUrl(m);
    }
    hero.querySelector(".hero-prev").onclick = function () { show(i - 1); };
    hero.querySelector(".hero-next").onclick = function () { show(i + 1); };
    show(0);
    setInterval(function () { show(i + 1); }, 8000);
  }

  async function buildGenres(parent) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.innerHTML =
      '<div class="wrap"><div class="section-head"><h2>Browse by Genre</h2></div>' +
      '<div class="chips" id="genreChips"></div><div class="grid" id="genreGrid"></div>' +
      '<div class="center"><button class="btn ghost" id="genreMore" style="display:none">Load more</button></div></div>';
    parent.appendChild(sec);

    const list = await CD.tmdb("/genre/movie/list", {});
    const chips = sec.querySelector("#genreChips");
    const grid = sec.querySelector("#genreGrid");
    const more = sec.querySelector("#genreMore");
    let genreId = null, page = 1, totalPages = 1;

    list.genres.slice(0, 12).forEach(function (g) {
      const b = document.createElement("button");
      b.className = "chip";
      b.textContent = g.name;
      b.onclick = function () {
        chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        b.classList.add("active");
        genreId = g.id; page = 1; grid.innerHTML = "";
        load();
      };
      chips.appendChild(b);
    });

    more.onclick = function () { page++; load(); };

    async function load() {
      CD.spinner(grid);
      const data = await CD.tmdb("/discover/movie", {
        with_genres: genreId, sort_by: "popularity.desc", page: page,
      });
      if (page === 1) grid.innerHTML = "";
      else grid.querySelector(".spinner") && grid.querySelector(".spinner").remove();
      data.results.forEach(function (m) { grid.appendChild(CD.card(m)); });
      totalPages = data.total_pages;
      more.style.display = page < totalPages ? "" : "none";
    }

    // auto-select first genre
    chips.querySelector(".chip").click();
  }
});
