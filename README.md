# Fatemeh Alizadeh research portfolio

A static portfolio about scientific information extraction, time-series forecasting, and quantitative modeling. Built with semantic HTML, CSS, and a small amount of vanilla JavaScript. No framework, build service, analytics, or external font is required.

## Preview

```sh
python3 -m http.server 8765
```

Open `http://localhost:8765`. Run `python3 scripts/check_site.py` to validate local links, public metadata, and required content. Case studies are generated from `data/projects.json` using `python3 scripts/build_case_pages.py`.

## Publish

The repository name must be `fatemealizadeh78.github.io`. Enable GitHub Pages with GitHub Actions. `.github/workflows/pages.yml` validates and publishes only `index.html`, `research/`, `assets/`, `styles.css`, `site.js`, `robots.txt`, `sitemap.xml`, and `.nojekyll`.

## Editorial notes

- All personal and academic claims come from the candidate's supplied CV, coursework, project artifacts, and explicit corrections.
- The three featured research repositories are linked directly. The older S&P 500 portfolio project is a separate academic project and is described separately in the background section.
- The extraction walkthrough is a synthetic schema illustration, not live model inference.
- NLP saved metrics, forecasting calibration bias, missing model artifacts, and financial evaluation assumptions are disclosed beside their results.
- A CV download is intentionally not offered until the candidate selects the final CV base. No phone number, transcript, private workbook, model weights, credentials, or student identifier is published.
- The reference portfolio at `mohsenshahverdy.github.io` inspired the emphasis on inspectable research and case studies. Its text, identity, design assets, and implementation were not copied.

See [publishing notes](docs/publishing.md) and [content sources](docs/content-sources.md).
