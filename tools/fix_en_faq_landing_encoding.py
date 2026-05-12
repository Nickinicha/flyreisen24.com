# -*- coding: utf-8 -*-
"""Fix mojibake in en/faq_landing_en.html (first-pass Unicode repairs)."""
import pathlib

p = pathlib.Path(__file__).resolve().parent.parent / "en" / "faq_landing_en.html"
text = p.read_text(encoding="utf-8")
pairs = [
    ("\u0e42\u0082\u0e0c", "\u20ac"),
    ("\u0e42\u20ac\u201d", "\u2014"),
    ("\u0e42\u20ac\u201c", "\u2014"),
    ("\u0e22\u0e17", "\u00b7"),
    ("\u0e17\u0e17", "\u00b7\u00b7"),
]
for a, b in pairs:
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8", newline="\n")
