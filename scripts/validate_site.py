from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ERRORS = []


def fail(message):
    ERRORS.append(message)


def require(path):
    target = ROOT / path
    if not target.exists():
        fail(f"missing required file: {path}")
    return target


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.scripts = []
        self.styles = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "script" and attrs.get("src"):
            self.scripts.append(attrs["src"])
        if tag == "link" and attrs.get("rel") == "stylesheet" and attrs.get("href"):
            self.styles.append(attrs["href"])


def local_path(page, value):
    if value.startswith(("http://", "https://", "mailto:", "tel:", "#")):
        return None
    clean = value.split("#", 1)[0].split("?", 1)[0]
    if not clean:
        return None
    return (page.parent / clean).resolve()


index = require("index.html")
resume = require("resume/index.html")
require("js/app.js")
require("js/analytics.js")
require("css/case-studies.css")
require("assets/favicon.svg")
require("assets/social-card.svg")
require(".nojekyll")

pages = [index, resume]
all_ids = 0
for page in pages:
    if not page.exists():
        continue
    text = page.read_text(encoding="utf-8")
    if "{%" in text or "{{" in text or "layout:" in text[:100]:
        fail(f"template/build-time syntax found in pure static page: {page.relative_to(ROOT)}")

    parser = SiteParser()
    parser.feed(text)
    duplicates = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    if duplicates:
        fail(f"duplicate HTML ids in {page.relative_to(ROOT)}: {', '.join(duplicates)}")
    all_ids += len(parser.ids)

    for value in parser.styles + parser.scripts + parser.links:
        target = local_path(page, value)
        if target is None:
            continue
        if value.endswith("/"):
            target = target / "index.html"
        if not target.exists():
            try:
                shown = target.relative_to(ROOT)
            except ValueError:
                shown = target
            fail(f"broken local reference from {page.relative_to(ROOT)}: {value} -> {shown}")

index_text = index.read_text(encoding="utf-8") if index.exists() else ""
required_markers = [
    "vifalqueiro@gmail.com",
    "whatsapp-link",
    "Data Engineer",
    "Applied AI",
    "PySpark",
    "Airflow",
    "10+ TB",
    "Dermaly AI",
    "aws_data_lakehouse_pipeline",
    "Why hire me",
    "Problem → architecture → decisions → evidence",
    "Interactive architecture",
    "AI requires evaluation",
    "data-track=\"resume_click\"",
    "./js/analytics.js",
    "./assets/social-card.svg",
    "./resume/index.html",
]
for marker in required_markers:
    if marker not in index_text:
        fail(f"required portfolio marker missing: {marker}")

analytics_text = (ROOT / "js/analytics.js").read_text(encoding="utf-8") if (ROOT / "js/analytics.js").exists() else ""
for event in ["portfolio_view", "project_view", "dataLayer", "PORTFOLIO_ANALYTICS_ENDPOINT"]:
    if event not in analytics_text:
        fail(f"analytics contract missing: {event}")

resume_text = resume.read_text(encoding="utf-8") if resume.exists() else ""
for marker in ["Professional Summary", "Cloud Data Engineer", "Applied AI", "Print / Save PDF", "../index.html"]:
    if marker not in resume_text:
        fail(f"resume marker missing: {marker}")

for forbidden in ["index.md", "resume.md", "_includes/"]:
    if (ROOT / forbidden).exists():
        fail(f"legacy Jekyll source still present: {forbidden}")

css_files = list((ROOT / "css").glob("*.css"))
for css in css_files:
    content = css.read_text(encoding="utf-8")
    for imported in re.findall(r'@import\s+url\(["\']?([^"\')]+)', content):
        imported_path = (css.parent / imported).resolve()
        if not imported_path.exists():
            fail(f"missing CSS import: {imported_path.relative_to(ROOT)}")

if ERRORS:
    print("Portfolio validation failed:")
    for error in ERRORS:
        print(f" - {error}")
    sys.exit(1)

print("Portfolio validation passed")
print(" - architecture: pure static HTML/CSS/JavaScript")
print(" - entrypoints: index.html, resume/index.html")
print(" - recruiter proof: case studies, why-hire section, engineering principles")
print(" - analytics: provider-ready funnel instrumentation")
print(f" - CSS modules checked: {len(css_files)}")
print(f" - unique section ids checked: {all_ids}")
