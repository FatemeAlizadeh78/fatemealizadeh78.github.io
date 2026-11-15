# Publishing and maintenance

GitHub Pages serves this repository through the included Actions workflow. Configure Settings → Pages → GitHub Actions, or create the Pages configuration with build type `workflow` through the GitHub REST API.

The deployment job uses least-scope job permissions: `pages: write` and `id-token: write`. Pull requests run validation without deployment. The public artifact is an explicit allowlist and does not include the content-authoring scripts or repository documentation.

To update a case study, edit `data/projects.json`, run `python3 scripts/build_case_pages.py`, then `python3 scripts/check_site.py`. Keep generated pages in Git. Verify keyboard tabs and mobile navigation when changing `site.js`; check widths around 390px and 1440px when changing CSS.

Do not add a CV download until the candidate chooses the approved base and authorizes the public version. Keep email/LinkedIn contact links current; never add private transcripts, phone numbers, student identifiers, model secrets, or licensed source data.
