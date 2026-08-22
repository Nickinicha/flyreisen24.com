#!/usr/bin/env python3
"""Replace broken deals URLs with /deals across the site."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", "node_modules", "__pycache__", "_archive", "archive"}

REPLACEMENTS = [
    ("/th/deals_th.html", "/deals"),
    ("/en/deals_en.html", "/deals"),
    ("/de/deals_de.html", "/deals"),
    ("/deals.html", "/deals"),
    ("https://www.flyreisen24.com/deals.html", "https://www.flyreisen24.com/deals"),
]

EXTENSIONS = {".html", ".js", ".xml", ".py", ".md"}


def should_process(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    return path.suffix.lower() in EXTENSIONS


def main() -> None:
    changed = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or not should_process(path):
            continue
        if path.name == "fix_deals_links.py":
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))
    print(f"Updated {len(changed)} files:")
    for name in sorted(changed):
        print(f"  - {name}")


if __name__ == "__main__":
    main()
