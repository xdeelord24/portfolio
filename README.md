# Jundee Mark G. Molina — Developer Portfolio

Personal portfolio site for **Jundee Mark G. Molina, MSc** — Full Stack Developer / AI Engineer (Manila, PH).

- **Live:** https://jundee-molina.netlify.app
- **GitHub:** https://github.com/xdeelord24

## Stack

Plain, dependency-free static site — `index.html` + `styles.css` + `script.js`. No build step.

- Responsive single page (hero, about, experience timeline, filterable projects, skills, contact)
- Project screenshot gallery with full-size viewing, keyboard navigation and mobile layouts
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

## Screenshot gallery

The five PNGs in `assets/projects/` are actual application captures, displayed with their original proportions:

- **AR Generator:** Today and My Work views rendered from the application's components with synthetic Test/Alpha/Beta task fixtures.
- **NuShed Site Studio:** 3D studio, layout editor and concept drawing workspace using the application's example designs. Drawing sheets are conceptual and are not construction documents.

Screenshots were reviewed for private data before publication. Marketing illustrations and production health records are not used. When replacing a screenshot, use sample data and review the entire image for names, contact information, credentials and internal details.

Gallery links in `index.html` specify `data-gallery`, `data-title`, `data-caption`, and image alt text. The viewer groups images by `data-gallery`. Escape closes it; Left/Right arrows move between screens. Without JavaScript or native dialog support, the links open the PNG files directly.
