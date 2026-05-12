# -*- coding: utf-8 -*-
"""Rebuild /th/faq/01-15 with index.html top-nav + breadcrumb + main-footer verbatim, landing.css inlined, article styles preserved."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FAQ = ROOT / "th" / "faq"
INDEX = ROOT / "index.html"
LANDING = FAQ / "landing.html"
SHELL_CSS = FAQ / "faq-series-shell.css"

META = [
    ("01-passport-visa.html", "long", "must", "Passport & Visa Bible"),
    ("02-connection-time.html", "long", "must", "Time Traps & MCT"),
    ("03-baggage-rules.html", "long", "must", "Baggage Rules 2026"),
    ("04-flight-changes.html", "long", "tips", "Flight Changes & Cancellations"),
    ("05-codeshare-stopover.html", "booking", "tips", "Codeshare & Open-Jaw"),
    ("06-frequent-flyer.html", "long", "tips", "Frequent Flyer"),
    ("07-charter-overbooking.html", "long", "rights", "Charter & Overbooking"),
    ("08-online-checkin.html", "long", "tips", "Online Check-in"),
    ("09-montreal-eu261.html", "long", "rights", "Montreal & EU261"),
    ("10-saf-future.html", "long", "tech", "SAF & Sustainable Aviation"),
    ("11-airport-security.html", "long", "must", "Airport Security 2026"),
    ("12-travel-insurance.html", "long", "rights", "Travel Insurance"),
    ("13-airport-lounge.html", "long", "tips", "Airport Lounge"),
    ("14-special-needs.html", "long", "rights", "Special needs & children"),
    ("15-booking-tips.html", "booking", "tips", "Booking tips"),
]

SIDEBAR = """
    <div class="side-card">
      <div class="side-card-head"><i class="fas fa-list"></i> สารบัญ 15 หัวข้อ</div>
      <div class="side-card-body">
        <ol class="toc-list">
          <li><a href="/th/faq/01-passport-visa.html"><span class="toc-num">01</span>Passport & Visa Bible</a></li>
          <li><a href="/th/faq/02-connection-time.html"><span class="toc-num">02</span>Time Traps ต่อเครื่อง</a></li>
          <li><a href="/th/faq/03-baggage-rules.html"><span class="toc-num">03</span>Baggage Rules 2026</a></li>
          <li><a href="/th/faq/04-flight-changes.html"><span class="toc-num">04</span>Flight Changes & Cancel</a></li>
          <li><a href="/th/faq/05-codeshare-stopover.html"><span class="toc-num">05</span>Codeshare & Open-Jaw</a></li>
          <li><a href="/th/faq/06-frequent-flyer.html"><span class="toc-num">06</span>Frequent Flyer</a></li>
          <li><a href="/th/faq/07-charter-overbooking.html"><span class="toc-num">07</span>Charter & Overbooking</a></li>
          <li><a href="/th/faq/08-online-checkin.html"><span class="toc-num">08</span>Online Check-in Tips</a></li>
          <li><a href="/th/faq/09-montreal-eu261.html"><span class="toc-num">09</span>Montreal & EU261</a></li>
          <li><a href="/th/faq/10-saf-future.html"><span class="toc-num">10</span>SAF & การบินยั่งยืน</a></li>
          <li><a href="/th/faq/11-airport-security.html"><span class="toc-num">11</span>Airport Security 2026</a></li>
          <li><a href="/th/faq/12-travel-insurance.html"><span class="toc-num">12</span>ประกันการเดินทาง</a></li>
          <li><a href="/th/faq/13-airport-lounge.html"><span class="toc-num">13</span>Airport Lounge Access</a></li>
          <li><a href="/th/faq/14-special-needs.html"><span class="toc-num">14</span>ผู้โดยสารพิเศษ & เด็ก</a></li>
          <li><a href="/th/faq/15-booking-tips.html"><span class="toc-num">15</span>เคล็ดลับจองตั๋วถูก</a></li>
        </ol>
      </div>
    </div>
    <div class="side-card">
      <div class="side-card-head"><i class="fas fa-stopwatch"></i> MCT ขั้นต่ำ (ด่วน)</div>
      <div class="side-card-body">
        <div class="mct-row"><span class="mct-code">BKK สุวรรณภูมิ</span><span class="mct-time">75 นาที</span></div>
        <div class="mct-row"><span class="mct-code">DXB ดูไบ</span><span class="mct-time">90 นาที</span></div>
        <div class="mct-row"><span class="mct-code">LHR ฮีทโธรว์</span><span class="mct-time">90 นาที</span></div>
        <div class="mct-row"><span class="mct-code">IST อิสตันบูล</span><span class="mct-time">100 นาที</span></div>
        <div class="mct-row"><span class="mct-code">FRA แฟรงก์เฟิร์ต</span><span class="mct-time">45 นาที</span></div>
        <p style="font-size:11px;color:var(--muted);margin-top:10px;"><i class="fas fa-info-circle"></i> แนะนำให้เผื่อเวลาเพิ่ม 30 นาทีเสมอ</p>
      </div>
    </div>
    <div class="cta-side">
      <h3>🎯 พร้อมจองแล้ว?</h3>
      <p>เปรียบเทียบราคาตั๋วเครื่องบินจากสายการบิน 500+ ในที่เดียว</p>
      <a href="https://flights.flyreisen24.com" class="btn-white">ค้นหาตั๋วราคาถูก</a>
    </div>
"""

_CACHE = {}


def _index_text():
    if "index" not in _CACHE:
        _CACHE["index"] = INDEX.read_text(encoding="utf-8")
    return _CACHE["index"]


def load_index_top_nav():
    if "nav" not in _CACHE:
        t = _index_text()
        m = re.search(r'<nav class="top-nav">[\s\S]*?</nav>', t)
        _CACHE["nav"] = m.group(0).strip() if m else ""
    return _CACHE["nav"]


def load_index_footer():
    if "footer" not in _CACHE:
        t = _index_text()
        m = re.search(r'<footer class="main-footer">[\s\S]*?</footer>', t)
        _CACHE["footer"] = m.group(0).strip() if m else ""
    return _CACHE["footer"]


def load_index_nav_breadcrumb_footer_css():
    if "idxcss" not in _CACHE:
        t = _index_text()
        m = re.search(r"<style>([\s\S]*?)</style>", t)
        block = m.group(1) if m else ""
        s1 = block.find("/* ===== BREADCRUMB ===== */")
        e1 = block.find("/* ===== HERO ===== */")
        s2 = block.find("/* ===== FOOTER ===== */")
        e2 = block.find("/* ===== RESPONSIVE ===== */")
        s3 = block.find("/* ===== RESPONSIVE ===== */")
        parts = []
        if s1 != -1 and e1 != -1:
            parts.append(block[s1:e1].strip())
        if s2 != -1 and e2 != -1:
            parts.append(block[s2:e2].strip())
        if s3 != -1:
            parts.append(block[s3:].strip())
        _CACHE["idxcss"] = "\n\n".join(parts)
    return _CACHE["idxcss"]


def load_landing_style_inner_stripped():
    if "landcss" not in _CACHE:
        t = LANDING.read_text(encoding="utf-8")
        m = re.search(r"<style>([\s\S]*?)</style>", t)
        block = m.group(1) if m else ""
        block = re.sub(
            r"/\* Global top nav[\s\S]*?\.site-nav-placeholder\s*\{[^}]*\}\s*",
            "",
            block,
            count=1,
        )
        block = re.sub(
            r"\.breadcrumb\s*\{[\s\S]*?\.bc-sep\s*\{[^}]*\}\s*",
            "",
            block,
            count=1,
        )
        _CACHE["landcss"] = block.strip()
    return _CACHE["landcss"]


def load_detail_shell_addon_css():
    if "addon" not in _CACHE:
        t = SHELL_CSS.read_text(encoding="utf-8")
        i = t.find(".detail-main")
        _CACHE["addon"] = t[i:].strip() if i != -1 else ""
    return _CACHE["addon"]


HEAD_LINKS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&family=IBM+Plex+Sans+Thai:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
"""


def extract_head_meta_and_styles(html: str):
    title_m = re.search(r"<title>[^<]*</title>", html, re.I)
    title = title_m.group(0) if title_m else "<title>FlyReisen24</title>"
    canon_m = re.search(r'<link[^>]+rel=["\"]canonical["\"][^>]*>', html, re.I)
    canon = canon_m.group(0) if canon_m else ""
    json_ld = "".join(re.findall(r'<script type="application/ld\+json">[\s\S]*?</script>', html))
    json_ld = json_ld.replace("https://www.flyreisen24.com/th/faq_th.html", "https://www.flyreisen24.com/th/faq/landing.html")
    json_ld = json_ld.replace("/th/faq_th.html", "/th/faq/landing.html")
    styles = "".join(re.findall(r"<style[^>]*>[\s\S]*?</style>", html, re.I))
    return title, canon, json_ld, styles


def inner_styles_only(styles_html: str):
    parts = re.findall(r"<style[^>]*>([\s\S]*?)</style>", styles_html, re.I)
    return "\n\n".join(p.strip() for p in parts)


def extract_tail_scripts(html: str):
    pn = re.search(r'<nav class="series-prevnext"[\s\S]*?</nav>', html, re.I)
    prev = pn.group(0) if pn else ""
    cm = re.search(r'<script[^>]+src=["\']/common\.js["\'][^>]*>\s*</script>', html, re.I)
    start = pn.end() if pn else 0
    end = cm.start() if cm else len(html)
    tail = html[start:end]
    tail = re.sub(r"<footer[^>]*>[\s\S]*?</footer>", "", tail, flags=re.I)
    return prev, tail.strip() + ("\n" if tail.strip() else "\n")


def extract_main_long(html: str):
    m = re.search(r'<article class="article-body">([\s\S]*)</article>', html)
    if m:
        return m.group(1).strip()
    m = re.search(r'<main class="container article-body">([\s\S]*)</main>', html)
    return m.group(1).strip() if m else ""


def extract_main_booking(html: str):
    m = re.search(r'<main class="container article-body">([\s\S]*)</main>', html)
    if m:
        return m.group(1).strip()
    m = re.search(r"<main[^>]*>([\s\S]*)</main>", html)
    return m.group(1).strip() if m else ""


def extract_main_stub(html: str):
    m = re.search(r'<div class="wrap">([\s\S]*)<nav class="series-prevnext"', html)
    return m.group(1).strip() if m else ""


def parse_hero_long(html: str):
    m = re.search(r'<section class="article-hero">([\s\S]*?)</section>', html)
    if not m:
        return parse_hero_booking(html)
    inner = m.group(1)
    h1m = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", inner, re.I)
    h1 = h1m.group(1).strip() if h1m else "Topic"
    descm = re.search(r'<p class="hero-desc">([\s\S]*?)</p>', inner)
    desc = descm.group(1).strip() if descm else ""
    tnm = re.search(r'<div class="topic-num">([\s\S]*?)</div>', inner)
    if tnm:
        badge = tnm.group(1).strip()
    else:
        tbm = re.search(r'<div class="topic-badge">([\s\S]*?)</div>', inner, re.I)
        badge = tbm.group(1).strip() if tbm else '<i class="fas fa-book-open"></i> FlyReisen24'
    return badge, h1, desc


def parse_hero_booking(html: str):
    m = re.search(r"<header class=\"hero\">([\s\S]*?)</header>", html)
    inner = m.group(1) if m else ""
    h1m = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", inner, re.I)
    h1 = h1m.group(1).strip() if h1m else "Topic"
    h1 = re.sub(r"<br\s*/?>", "<br>", h1)
    subm = re.search(r'<p class="hero-sub">([\s\S]*?)</p>', inner)
    sub = subm.group(1).strip() if subm else ""
    badgem = re.search(r'<div class="(?:topic-badge|hero-badge)">([\s\S]*?)</div>', inner, re.I)
    badge_txt = badgem.group(1).strip() if badgem else ""
    if not badge_txt:
        badge = '<i class="fas fa-layer-group"></i> TOPIC'
    elif "<i " in badge_txt or "<svg" in badge_txt:
        badge = badge_txt
    else:
        badge = f'<i class="fas fa-layer-group"></i> {badge_txt}'
    return badge, h1, sub


def parse_hero_stub(html: str):
    tm = re.search(r"<title>([^<|]+)", html)
    title = tm.group(1).strip() if tm else "Topic"
    hm = re.search(r"<h1>([^<]+)</h1>", html)
    h1 = hm.group(1).strip() if hm else title
    pm = re.search(r"<p>([^<]{10,400})</p>", html)
    desc = pm.group(1).strip() if pm else ""
    num_m = re.search(r"หัวข้อ (\d+)/15", html)
    num = num_m.group(1) if num_m else "?"
    badge = f'<i class="fas fa-bookmark"></i> หัวข้อ {num} / 15'
    return badge, h1, desc


def breadcrumb_index_three(dest: str, label: str):
    url = f"https://www.flyreisen24.com/th/faq/{dest}"
    return f"""<nav class="breadcrumb" aria-label="breadcrumb">
    <div class="breadcrumb-container">
        <ol class="breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a href="/" itemprop="item"><span itemprop="name"><i class="fas fa-home"></i> หน้าแรก</span></a>
                <meta itemprop="position" content="1">
            </li>
            <li class="breadcrumb-separator" aria-hidden="true">›</li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a href="/th/faq/landing.html" itemprop="item"><span itemprop="name">คลังความรู้</span></a>
                <meta itemprop="position" content="2">
            </li>
            <li class="breadcrumb-separator" aria-hidden="true">›</li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a href="{url}" itemprop="item"><span itemprop="name">{label}</span></a>
                <meta itemprop="position" content="3">
            </li>
        </ol>
    </div>
</nav>
"""


def build_combined_style(page_article_css: str):
    idx = load_index_nav_breadcrumb_footer_css()
    land = load_landing_style_inner_stripped()
    addon = load_detail_shell_addon_css()
    art = inner_styles_only(page_article_css)
    return f"""<style>
{idx}

/* === FAQ series (from th/faq/landing.html, minus duplicate nav/breadcrumb) === */
{land}

/* === Detail layout (accent bar, reading progress; footer rules align with index) === */
{addon}

/* === Page-specific article styles === */
{art}
</style>
"""


def build(dest: str, layout: str, accent: str, label: str, raw: str):
    title, canon, json_ld, styles = extract_head_meta_and_styles(raw)
    prevnext, tail = extract_tail_scripts(raw)
    acc = f"detail-accent--{accent}"

    if layout == "long":
        main_inner = extract_main_long(raw)
        badge, h1, desc = parse_hero_long(raw)
    elif layout == "booking":
        main_inner = extract_main_booking(raw)
        badge, h1, desc = parse_hero_booking(raw)
    else:
        main_inner = extract_main_stub(raw)
        badge, h1, desc = parse_hero_stub(raw)

    if re.search(r"\bTOPIC\b", badge or "", re.I) or (badge and "TOPIC" in badge):
        num = dest[:2]
        badge = f'<i class="fas fa-bookmark"></i> หัวข้อ {num}/15'

    if not main_inner:
        raise SystemExit(f"empty main: {dest}")

    hero_desc = f'<p class="hero-sub">{desc}</p>' if desc else ""

    inner_wrap = (
        f'<article class="article-body">\n{main_inner}\n</article>'
        if layout != "booking"
        else f'<main class="container article-body">\n{main_inner}\n</main>'
    )

    combined_style = build_combined_style(styles)
    bc = breadcrumb_index_three(dest, label)
    top_nav = load_index_top_nav()
    footer = load_index_footer()

    return f"""<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
{title}
{canon}
<meta name="robots" content="index, follow">
{HEAD_LINKS}
{combined_style}
{json_ld}
</head>
<body>
<div class="reading-progress" id="readingProgress"></div>
{bc}
{top_nav}
<header class="hero">
  <div class="hero-inner">
    <div class="hero-badge">{badge}</div>
    <h1>{h1}</h1>
    {hero_desc}
  </div>
</header>
<div class="page-body">
  <main class="detail-main">
    <div class="detail-content-shell {acc}">
      {inner_wrap}
    </div>
  </main>
  <aside class="sidebar">
{SIDEBAR}
  </aside>
</div>
{prevnext}
{footer}
{tail}
<script src="/common.js" defer></script>
</body>
</html>
"""


def main():
    for dest, layout, accent, label in META:
        p = FAQ / dest
        raw = p.read_text(encoding="utf-8")
        out = build(dest, layout, accent, label, raw)
        p.write_text(out, encoding="utf-8")
        print("shell", dest)


if __name__ == "__main__":
    main()
