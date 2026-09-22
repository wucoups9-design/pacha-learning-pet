"""Small dependency-free checks for the static GitHub Pages site."""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.title = ""
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("src", "href"):
            value = attrs.get(key)
            if value and not value.startswith(("#", "http:", "https:", "mailto:", "data:")):
                self.refs.append(value.split("#", 1)[0].split("?", 1)[0])
        self._in_title = tag == "title"

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data.strip()


def fail(message):
    print(f"FAIL: {message}")
    return 1


def main():
    errors = []
    required = [
        "index.html",
        "demo/index.html",
        "demo/app.js",
        "demo/styles.css",
        "assets/pets/doudou-concept-v1.png",
        "README.md",
    ]
    for item in required:
        if not (ROOT / item).exists():
            errors.append(f"missing {item}")

    for page_path in (ROOT / "index.html", ROOT / "demo/index.html"):
        parser = PageParser()
        try:
            parser.feed(page_path.read_text(encoding="utf-8"))
        except Exception as exc:  # pragma: no cover - defensive CLI output
            errors.append(f"cannot parse {page_path.relative_to(ROOT)}: {exc}")
            continue
        if not parser.title:
            errors.append(f"missing title in {page_path.relative_to(ROOT)}")
        for ref in parser.refs:
            target = (page_path.parent / ref).resolve()
            if not target.exists():
                errors.append(f"broken reference in {page_path.relative_to(ROOT)}: {ref}")

    app = (ROOT / "demo/app.js").read_text(encoding="utf-8")
    for marker in ("unlockNextChapter", "growthCount", "plantLab", "petReactions", "addEventListener"):
        if marker not in app:
            errors.append(f"missing interaction marker: {marker}")

    docs = (ROOT / "docs/doudou-growth-path.md").read_text(encoding="utf-8")
    for chapter in ("水上探险", "阳台园丁", "光影侦探", "天气管家", "小小发明家"):
        if chapter not in docs:
            errors.append(f"missing growth chapter: {chapter}")

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        return 1
    print("PASS: static site structure, references, and growth-line markers are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
