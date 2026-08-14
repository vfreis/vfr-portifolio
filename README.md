# VFR Portfolio 2.0

Professional portfolio for **Vinicios Falqueiro Reis — Data Engineer + Applied AI & ML**.

## Architecture

The portfolio is now **pure static HTML + CSS + JavaScript**.

- `index.html` is the production entrypoint.
- `resume/index.html` is the resume page.
- `css/`, `js/` and `assets/` are referenced with relative paths.
- No Jekyll, Liquid, Markdown rendering, npm build, bundler or frontend framework is required.
- `.nojekyll` explicitly disables GitHub Pages Jekyll processing.

This means the downloaded repository can be previewed by double-clicking `index.html` in a browser. A local HTTP server is optional, not required.

## Positioning

- Data Engineering is the core discipline.
- Applied AI & ML is presented through concrete production responsibilities.
- Business impact is quantified wherever the CV provides evidence.
- Recruiters get a concise outcome-oriented view.
- Engineers can switch to deeper implementation and architecture details.

## Current content

- Hero with international positioning and direct contact CTAs.
- Animated data + AI pipeline visualization.
- Primary impact metrics: 10+ TB/month, -20% runtime, 95% automated workflows, -50% manual ingestion effort.
- Secondary impact: +40% scheduling reliability, 15% cost savings, +25% data accuracy, +30% productivity, +20% operational efficiency.
- AWS Data Lakehouse flagship case.
- Dermaly Applied AI & ML case.
- Data Migration & File Profiling Toolkit.
- Superstore and RFM analytics/ML project lab.
- Full professional experience timeline.
- Technology evidence across platforms, engineering, AI/ML, quality/operations and analytics.
- Native static resume with Print / Save PDF support.
- Email, WhatsApp, LinkedIn and GitHub contact paths.

## Local preview

### Simplest

Open `index.html` directly.

### HTTP preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Validation

```bash
python scripts/validate_site.py
node --check js/app.js
```

CI verifies that:

- pure static entrypoints exist;
- no Liquid/Jekyll template syntax remains;
- local HTML/CSS/JS links resolve;
- duplicate IDs are rejected;
- required portfolio evidence is present;
- JavaScript syntax is valid.

## Deployment

Target: **GitHub Pages using GitHub Actions**.

After the foundation PR is approved and merged to `main`, the Pages workflow publishes the repository as a static artifact. No compilation step is involved.

A custom domain can be added later with a `CNAME` file once the final domain is chosen.

## Contact

- Email: `vifalqueiro@gmail.com`
- WhatsApp: `+55 11 99340-8348`
- LinkedIn: `linkedin.com/in/vfalqueiroreis`
- GitHub: `github.com/vfreis`
