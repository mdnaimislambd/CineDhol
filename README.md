# CineDhol

A legal movie & TV discovery site: trending titles, search, trailers, cast,
legal streaming options, genre browser, and your own reviews.
Movie data comes from the free [TMDB API](https://www.themoviedb.org/settings/api).
No pirated content — AdSense-friendly.

Live: `https://mdnaimislambd.github.io/CineDhol/` (after GitHub Pages is enabled)

## Setup (5 minutes)

### 1. Get a free TMDB API key
1. Sign up at https://www.themoviedb.org/
2. Go to Settings → API → request an API key (choose "Developer")
3. Open `assets/js/config.js` and paste the key:
   ```js
   TMDB_API_KEY: "paste-your-key-here",
   ```
4. Commit & push — the site starts working immediately.

### 2. Write your reviews (needed for AdSense approval)
Edit `assets/js/reviews-data.js`:
- Delete the two SAMPLE entries
- Add your own reviews (200+ words each, your own words, Bengali or English)
- Follow the same format (slug, title, year, stars, date, excerpt, body, pros, cons)

### 3. Set your contact email
In `contact.html`, replace `hello@cinedhol.example` with your real email.

### 4. AdSense (after Google approves your site)
1. Apply at https://www.google.com/adsense/ with your live site URL
2. When approved, paste your publisher ID in `assets/js/config.js`:
   ```js
   ADSENSE_CLIENT_ID: "ca-pub-XXXXXXXXXXXXXXXX",
   ```
3. In your AdSense dashboard, create ad units. The site has ad slots on the
   home page, movie pages, search page and review pages. To use your own ad
   unit IDs, find `CD.adSlot("", "auto")` calls in `assets/js/*.js` and put
   the ad unit ID as the first argument, e.g. `CD.adSlot("1234567890", "auto")`.
4. Push — ads appear automatically. (Slots stay hidden until the publisher ID is set.)

## Deploy
Push to the `main` branch — GitHub Pages serves the site automatically.
No build step, no server needed.

## Files
| File | What it is |
|---|---|
| `index.html` | Home: hero, trending/popular/top-rated rows, Bollywood & South rows, genre browser |
| `movie.html` | Detail page: overview, trailer, cast, legal watch options, similar titles |
| `search.html` | Search results |
| `reviews.html` / `review.html` | Your review list + single review pages |
| `about.html`, `contact.html`, `privacy-policy.html`, `disclaimer.html` | Required info pages (AdSense wants these) |
| `assets/js/config.js` | API key + AdSense ID (the only file you must edit) |
| `assets/js/reviews-data.js` | Your reviews live here |
| `robots.txt`, `sitemap.xml` | SEO — update the domain if you use a custom domain |
