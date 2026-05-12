# -*- coding: utf-8 -*-
"""One-off: pull EN/DE FAQ landing HTML from agent transcript JSONL."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JL = Path(
    r"C:\Users\user\.cursor\projects\d-flyreisen24-com\agent-transcripts"
    r"\f7f3e538-077e-4d91-851d-6314bbba43c4\f7f3e538-077e-4d91-851d-6314bbba43c4.jsonl"
)


def main() -> None:
    line = JL.read_text(encoding="utf-8").splitlines()[402]
    obj = json.loads(line)
    text = obj["message"]["content"][0]["text"]
    assert text.startswith("<user_query>")
    text = text[len("<user_query>") :].strip()
    assert text.endswith("</user_query>")
    text = text[: -len("</user_query>")].strip()
    sep = "\n++++++\n"
    i = text.find("<!DOCTYPE html>")
    if i < 0:
        raise SystemExit("no doctype")
    j = text.find(sep, i)
    if j < 0:
        raise SystemExit("no sep")
    en = text[i:j]
    de = text[j + len(sep) :].strip()
    en = en.replace(
        "<p>Your travel platform for the best deals — flights, hotels and activities from top partners worldwide.</p>",
        "<p>Your travel platform for the best deals worldwide.</p>",
    )
    de = de.replace(
        "<p>Deine Reiseplattform für die besten Deals — Flüge, Hotels und Aktivitäten von Top-Partnern weltweit.</p>",
        "<p>Deine Reiseplattform für die besten Deals weltweit.</p>",
    )
    fixes = [
        (
            "forEach(function(m){m.classList.remove('show')});",
            "forEach(function(m){m.classList.remove('show');});",
        ),
        (
            "forEach(function(l){l.classList.remove('dropdown-active')});",
            "forEach(function(l){l.classList.remove('dropdown-active');});",
        ),
    ]
    for bad, good in fixes:
        en = en.replace(bad, good)
        de = de.replace(bad, good)
    (ROOT / "en" / "faq").mkdir(parents=True, exist_ok=True)
    (ROOT / "de" / "faq").mkdir(parents=True, exist_ok=True)
    (ROOT / "en" / "faq" / "landing.html").write_text(en, encoding="utf-8")
    (ROOT / "de" / "faq" / "landing.html").write_text(de, encoding="utf-8")
    (ROOT / "landing_en.html").write_text(en, encoding="utf-8")
    (ROOT / "landing_de.html").write_text(de, encoding="utf-8")
    print("OK", len(en), len(de))


if __name__ == "__main__":
    main()
