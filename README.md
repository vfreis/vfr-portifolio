# VFR Portfolio 2.0

Professional portfolio for **Vinicios Falqueiro Reis — Data Engineer + Applied AI & ML**.

## Architecture

The portfolio is **pure static HTML + CSS + JavaScript**.

- `index.html` is the production entrypoint.
- `resume/index.html` is the resume page.
- `css/`, `js/` and `assets/` are referenced with relative paths.
- No Jekyll, Liquid, Markdown rendering, npm build, bundler or frontend framework is required.
- `.nojekyll` explicitly disables GitHub Pages Jekyll processing.

The downloaded repository can be previewed by double-clicking `index.html` in a browser. A local HTTP server is optional.

## Recruiter conversion design

The portfolio is structured as a proof engine rather than a generic personal page:

- quantified impact above the fold;
- a concise **Why hire me** section;
- flagship projects written as **Problem → Decisions → Challenge → Result → Evidence** case studies;
- interactive AWS architecture explaining the responsibility of each system node;
- Dermaly positioned as a full Data → AI → Evaluation → Product lifecycle;
- visual evidence panels, architecture, code proof and measurable outcomes;
- technology cards connected to real responsibilities and metrics;
- explicit engineering principles;
- recruiter-specific final CTA with email, WhatsApp, LinkedIn and résumé.

## Current evidence

- 10+ TB/month data processing.
- ~20% pipeline runtime reduction.
- 95% recurring workflow automation.
- ~40% scheduling reliability improvement.
- ~50% lower manual ingestion effort.
- 15% cost savings.
- ~25% higher data accuracy.
- ~30% productivity improvement.
- ~20% operational efficiency improvement.
- AWS Data Lakehouse flagship case.
- Dermaly Applied AI & ML production case.
- Data Migration & File Profiling Toolkit.
- Superstore and RFM analytics/ML project lab.

## Analytics instrumentation

`js/analytics.js` provides a provider-ready event contract without hard-coding a third-party account.

Tracked funnel events include:

- `portfolio_view`
- `recruiter_mode`
- `engineer_mode`
- `project_view`
- `project_open`
- `architecture_node`
- `resume_click`
- `linkedin_click`
- `github_click`
- `whatsapp_click`
- `email_click`

Every event is pushed to `window.dataLayer`, emitted as a `portfolio:analytics` browser event and counted locally for QA. If a production collector is configured later, define `window.PORTFOLIO_ANALYTICS_ENDPOINT` before `analytics.js`; events will also be sent with `navigator.sendBeacon`.

A real cross-user analytics provider still requires an external account/endpoint or Measurement ID. The repository intentionally does not invent one.

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
node --check js/analytics.js
```

CI verifies:

- pure static entrypoints;
- no Liquid/Jekyll template syntax;
- local HTML/CSS/JS references;
- duplicate IDs;
- required recruiter proof/case-study content;
- analytics event contract;
- JavaScript syntax;
- HTTP smoke tests for home, résumé, scripts, styles and social card.

## Deployment

Target: **GitHub Pages using GitHub Actions**.

The Pages workflow validates the site, uploads the static repository and deploys it with no compilation stage.

Canonical deployment URL prepared in metadata:

`https://vfreis.github.io/vfr-portifolio/`

### Custom domain

The code is ready for a custom domain, but a `CNAME` is intentionally not committed until a domain actually owned by the user is selected. After that, deployment only requires:

1. add the domain to GitHub Pages;
2. configure the required DNS records;
3. commit a `CNAME` file containing the exact domain;
4. update canonical/Open Graph URLs to the custom domain.

## Contact

- Email: `vifalqueiro@gmail.com`
- WhatsApp: `+55 11 99340-8348`
- LinkedIn: `linkedin.com/in/vfalqueiroreis`
- GitHub: `github.com/vfreis`
