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


class IdParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])


index = require("index.md")
require("resume.md")
require("js/app.js")

if index.exists():
    index_text = index.read_text(encoding="utf-8")
    includes = re.findall(r"{%\s*include\s+([^\s%]+)\s*%}", index_text)
    if not includes:
        fail("index.md does not declare any includes")

    html_parts = []
    for include in includes:
        path = require(f"_includes/{include}")
        if path.exists():
            html_parts.append(path.read_text(encoding="utf-8"))

    styles = re.findall(r'href="(?:\.\./|\./)?(css/[^"?#]+\.css)', index_text)
    scripts = re.findall(r'src="(?:\.\./|\./)?(js/[^"?#]+\.js)', index_text)
    for asset in styles + scripts:
        require(asset)

    # Resolve CSS @imports recursively.
    pending = [ROOT / asset for asset in styles]
    visited = set()
    while pending:
        css = pending.pop()
        if css in visited or not css.exists():
            continue
        visited.add(css)
        content = css.read_text(encoding="utf-8")
        for imported in re.findall(r'@import\s+url\(["\']?([^"\')]+)', content):
            imported_path = (css.parent / imported).resolve()
            if not imported_path.exists():
                fail(f"missing CSS import: {imported_path.relative_to(ROOT)}")
            else:
                pending.append(imported_path)

    parser = IdParser()
    parser.feed("\n".join(html_parts))
    duplicates = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    if duplicates:
        fail(f"duplicate HTML ids: {', '.join(duplicates)}")

    rendered_source = index_text + "\n" + "\n".join(html_parts)
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
    ]
    for marker in required_markers:
        if marker not in rendered_source:
            fail(f"required portfolio marker missing: {marker}")

    if "{{ site.baseurl }}" in rendered_source:
        fail("site.baseurl placeholder found; use project-pages-safe relative paths")

resume = ROOT / "resume.md"
if resume.exists():
    resume_text = resume.read_text(encoding="utf-8")
    for marker in ["Professional Summary", "Cloud Data Engineer", "Applied AI", "Print / Save PDF"]:
        if marker not in resume_text:
            fail(f"resume marker missing: {marker}")

if ERRORS:
    print("Portfolio validation failed:")
    for error in ERRORS:
        print(f" - {error}")
    sys.exit(1)

print("Portfolio validation passed")
print(f" - includes: {len(includes)}")
print(f" - CSS modules checked: {len(visited)}")
print(f" - unique section ids: {len(parser.ids)}")
