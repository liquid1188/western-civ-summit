# International Summit for Western Civilization

Eleventy site. `npm install`, then `npm start` to preview or `npm run build` (output in `_site`).

Each year is one file in `src/summits/` (2027.md, 2028.md, ...) holding the theme, program, videos, speeches, and photos. Home, Program, and Register always show the year set in `src/_data/site.json` (`currentYear`). The editor at `/admin/` (Sveltia) edits both.

Before launch: put Jane's Web3Forms key in `site.json`, set `setupMode` to false, and fill in the venue.
