# -*- coding: utf-8 -*-
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = ROOT / "th" / "faq_th.html"
dst_dir = ROOT / "th" / "archive"
dst_dir.mkdir(parents=True, exist_ok=True)
dst = dst_dir / "faq_th_old.html"
if src.exists():
    shutil.move(str(src), str(dst))
    text = dst.read_text(encoding="utf-8")
    meta = '<meta http-equiv="refresh" content="0; url=/th/faq/landing.html">\n'
    if 'http-equiv="refresh"' not in text and "<head>" in text:
        text = text.replace("<head>", "<head>\n" + meta, 1)
        dst.write_text(text, encoding="utf-8")
    print("moved to", dst)
else:
    print("already moved or missing:", src)
