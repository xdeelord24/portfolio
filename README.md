# Jundee Mark G. Molina — Developer Portfolio

Personal portfolio site for **Jundee Mark G. Molina, MSc** — Full Stack Developer / AI Engineer (Manila, PH).

- **Live:** https://jundee-molina.netlify.app
- **GitHub:** https://github.com/xdeelord24

## Stack

Plain, dependency-free static site — `index.html` + `styles.css` + `script.js`. No build step.

- Responsive single page (hero, about, experience timeline, filterable projects, skills, contact)
- Live "Open source" section pulls public repositories from the GitHub REST API at runtime
- Deployed on Netlify (publish directory `.`; see `netlify.toml` for security headers)

## Local preview

```bash
# any static server works, e.g.
python -m http.server 5500
# then open http://localhost:5500
```

## Deploy

Pushing to `main` triggers a Netlify production deploy (continuous deployment from this repo).

## Updating content

- Experience / projects / skills are plain HTML sections in `index.html` — edit the cards directly.
- The GitHub username used for the live repo feed lives at the top of `script.js` (`GH_USER`).
