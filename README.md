# Web agency sites

Two sites in one folder (ready for GitHub Pages):

```
web-agency/
├── index.html                  <- your agency site (SwiftSite)
├── assets/style.css
├── assets/main.js
└── work/hope-grows/index.html  <- Hope Grows sample site (friend's nonprofit)
```

## 1. Preview locally

Double-click `index.html` to open it in your browser, which works for a quick look.
To preview both sites exactly like they'll work online:

```
cd ~/Projects/web-agency
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser (Hope Grows is at http://localhost:8000/work/hope-grows/).

## 2. Edit the placeholders FIRST

Search `index.html` and `assets/main.js` for these and swap in the real thing:

- `SwiftSite`: your business name (decide on one; replace everywhere)
- `hello@swiftsite.com`: your real email (2 places)
- `(555) 010-0000`: your real phone (a few places in index.html)

For the Hope Grows site, search `work/hope-grows/index.html` for `hopgrowsaz@gmail.com`.
That email is a guess. Ask your friend for their real contact email, and ask them to
confirm the campsite details (price, rules) before publishing it as theirs.

## 3. Publish (GitHub Pages, same flow as your research site)

```
cd ~/Projects/web-agency
git init
git add .
git commit -m "Agency site + Hope Grows sample"
gh repo create web-agency --public --source=. --push
```

Later, buy your own domain (e.g. swiftsite.com or similar, ~$12/yr at Cloudflare or
Namecheap) and attach it in the same Pages settings screen.

Then: repo page on github.com → Settings → Pages → Source: "Deploy from a branch" →
Branch: `main` / `/ (root)` → Save. In about a minute your site is live at
`https://wh1sper1.github.io/web-agency/` and the Hope Grows sample at
`https://wh1sper1.github.io/web-agency/work/hope-grows/`.

## 4. Show the Hope Grows sample to your friend

Easiest: send them the live link after publishing. If they want it as their real site,
publish it under their own GitHub account/domain, and it's one HTML file, they can host it
free almost anywhere (GitHub Pages, Cloudflare Pages, Netlify drag-and-drop).
