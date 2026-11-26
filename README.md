# Hitomi Cabrera — Portfolio

Live site: https://tommycabrera.github.io/TommyCabrera-portfolio/

## Folder structure

```
index.html              page markup
assets/css/styles.css   all styles
assets/js/app.js        all behaviour (routing, Work page, case studies, animations)
images/work/            Work screenshots, one folder per project
images/work/manifest.js the list of screenshots each project shows
_headers                security headers (used by Cloudflare Pages / Netlify)
robots.txt              keeps search engines and AI crawlers out of /images/
404.html                not-found page
```

## Adding Work screenshots

1. Put the image files in the project's folder, e.g. `images/work/dr-paws/01-cover.png`.
   Folders: `dr-paws`, `shift-ai`, `xo-ai-builder`, `apply-portal`, `xlearner`, `insultify`.
2. Open `images/work/manifest.js` and list each file under that project, in display order:
   ```js
   'dr-paws': [
     { file: '01-cover.png', caption: 'Gut Glow product page' },
     { file: '02-quiz.png',  caption: 'Quiz funnel' },
   ],
   ```
   The first image is the cover. `width` and `height` are optional.
3. Commit. The site updates in a minute or two.

A project with an empty list keeps its built-in recreated screens.

Tips: export at about 2000 px wide, and compress (WebP or optimised PNG/JPG) to keep the site fast.
Add a small watermark to anything sensitive: a public website cannot stop visitors saving what they can see.
