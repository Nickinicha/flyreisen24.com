# -*- coding: utf-8 -*-
"""Generate /en/faq/*.html and /de/faq/*.html from /th/faq/*.html (read-only on /th/)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TH_FAQ = ROOT / "th" / "faq"

SLUGS = [
    "01-passport-visa",
    "02-connection-time",
    "03-baggage-rules",
    "04-flight-changes",
    "05-codeshare-stopover",
    "06-frequent-flyer",
    "07-charter-overbooking",
    "08-online-checkin",
    "09-montreal-eu261",
    "10-saf-future",
    "11-airport-security",
    "12-travel-insurance",
    "13-airport-lounge",
    "14-special-needs",
    "15-booking-tips",
]

EN_TITLES = {
    "01-passport-visa": "Passport & Visa Bible",
    "02-connection-time": "Time Traps: Connection Flights",
    "03-baggage-rules": "Baggage Rules 2026",
    "04-flight-changes": "Flight Changes & Cancellations",
    "05-codeshare-stopover": "Codeshare & Open-Jaw",
    "06-frequent-flyer": "Frequent Flyer Programs",
    "07-charter-overbooking": "Charter Flights & Overbooking",
    "08-online-checkin": "Online Check-in Tips",
    "09-montreal-eu261": "Montreal Convention & EU261",
    "10-saf-future": "SAF & Sustainable Aviation",
    "11-airport-security": "Airport Security 2026",
    "12-travel-insurance": "Travel Insurance",
    "13-airport-lounge": "Airport Lounge Access",
    "14-special-needs": "Special Passengers & Children",
    "15-booking-tips": "Cheap Flight Booking Tips",
}

DE_TITLES = {
    "01-passport-visa": "Reisepass & Visum",
    "02-connection-time": "Umsteigezeit: Die Zeitfallen",
    "03-baggage-rules": "Gepäckregeln 2026",
    "04-flight-changes": "Umbuchung & Stornierung",
    "05-codeshare-stopover": "Codeshare & Open-Jaw",
    "06-frequent-flyer": "Vielfliegerprogramme",
    "07-charter-overbooking": "Charterflüge & Overbooking",
    "08-online-checkin": "Online Check-in Tipps",
    "09-montreal-eu261": "Montrealer Abkommen & EU261",
    "10-saf-future": "SAF & nachhaltiges Fliegen",
    "11-airport-security": "Sicherheitskontrolle 2026",
    "12-travel-insurance": "Reiseversicherung",
    "13-airport-lounge": "Airport Lounge Zugang",
    "14-special-needs": "Besondere Passagiere & Kinder",
    "15-booking-tips": "Günstige Flüge buchen",
}


def topic_num(slug: str) -> int:
    return int(slug[:2])


def replace_urls_except_th_hreflang(html: str, prefix: str) -> str:
    """prefix is '/en/faq/' or '/de/faq/'. Keep hreflang=th lines pointing to /th/faq/."""
    abs_th = "https://www.flyreisen24.com/th/faq/"
    abs_new = "https://www.flyreisen24.com" + prefix
    lines = html.splitlines(keepends=True)
    out = []
    for line in lines:
        if 'hreflang="th"' in line and "/th/faq/" in line:
            out.append(line)
        else:
            line = line.replace("/th/faq/", prefix)
            line = line.replace(abs_th, abs_new)
            out.append(line)
    return "".join(out)


def extract_category(html: str) -> str:
    m = re.search(
        r'<div class="article-meta">[\s\S]*?<span><i class="fas fa-tag"></i>\s*([^<]+)</span>',
        html,
    )
    return m.group(1).strip() if m else "Must Know"


def extract_read_minutes(html: str) -> str:
    m = re.search(r"อ่าน\s*(\d+)\s*นาที", html)
    return m.group(1) if m else "5"


def build_sidebar_toc(locale: str, current_slug: str) -> str:
    prefix = f"/{locale}/faq/"
    lines = []
    for i, slug in enumerate(SLUGS, start=1):
        title = EN_TITLES[slug] if locale == "en" else DE_TITLES[slug]
        cur = ' class="current"' if slug == current_slug else ""
        lines.append(
            f'          <li{cur}><a href="{prefix}{slug}.html"><span class="toc-num">{i:02d}</span>{title}</a></li>'
        )
    return "\n".join(lines)


def replace_hero_block(html: str, locale: str, slug: str) -> str:
    en_title = EN_TITLES[slug]
    de_title = DE_TITLES[slug]
    title = en_title if locale == "en" else de_title
    cat = extract_category(html)
    nn = topic_num(slug)
    mins = extract_read_minutes(html)
    if locale == "en":
        badge = f'<div class="article-badge">\n      <i class="fas fa-book-open"></i> {cat} · Topic {nn:02d}\n    </div>'
        h1 = f"<h1>{title}</h1>"
        sub = "<p class=\"article-hero-sub\">Practical, data-backed guide — full English translation of the article body is coming soon.</p>"
        meta1 = "<span><i class=\"fas fa-calendar-alt\"></i> Updated May 2026</span>"
        meta2 = f"<span><i class=\"fas fa-clock\"></i> {mins} min read</span>"
        meta3 = f"<span><i class=\"fas fa-tag\"></i> {cat}</span>"
    else:
        badge = f'<div class="article-badge">\n      <i class="fas fa-book-open"></i> {cat} · Thema {nn:02d}\n    </div>'
        h1 = f"<h1>{title}</h1>"
        sub = '<p class="article-hero-sub">Praxisnaher Ratgeber — die vollständige deutsche Übersetzung des Artikeltexts folgt in Kürze.</p>'
        meta1 = '<span><i class="fas fa-calendar-alt"></i> Aktualisiert Mai 2026</span>'
        meta2 = f"<span><i class=\"fas fa-clock\"></i> {mins} Min. Lesezeit</span>"
        meta3 = f'<span><i class="fas fa-tag"></i> {cat}</span>'
    inner = f"""    {badge}
    {h1}
    {sub}
    <div class="article-meta">
      {meta1}
      {meta2}
      {meta3}
    </div>"""
    return re.sub(
        r'(<div class="article-hero-inner">)[\s\S]*?(</div>\s*</header>)',
        r"\1\n" + inner + r"\n\2",
        html,
        count=1,
    )


def replace_breadcrumb(html: str, locale: str, slug: str) -> str:
    title = EN_TITLES[slug] if locale == "en" else DE_TITLES[slug]
    prefix = f"/{locale}/faq/"
    if locale == "en":
        inner = f"""    <a href="/"><i class="fas fa-home"></i> Home</a>
    <span class="bc-sep">›</span>
    <a href="{prefix}landing.html">Knowledge Hub</a>
    <span class="bc-sep">›</span>
    <span>{title}</span>"""
    else:
        inner = f"""    <a href="/"><i class="fas fa-home"></i> Startseite</a>
    <span class="bc-sep">›</span>
    <a href="{prefix}landing.html">Reisewissen</a>
    <span class="bc-sep">›</span>
    <span>{title}</span>"""
    return re.sub(
        r"(<nav class=\"breadcrumb\"[^>]*>\s*<div class=\"breadcrumb-inner\">)[\s\S]*?(</div>\s*</nav>)",
        r"\1\n" + inner + r"\n\2",
        html,
        count=1,
    )


def replace_top_nav(html: str, locale: str, slug: str) -> str:
    prefix = f"/{locale}/faq/"
    deals = "/en/deals_en.html" if locale == "en" else "/de/deals_de.html"
    lang_label = "EN" if locale == "en" else "DE"
    en_active = ' class="active"' if locale == "en" else ""
    de_active = ' class="active"' if locale == "de" else ""
    if locale == "en":
        nav = f"""    <ul class="top-nav-menu" id="topNavMenu">
      <li>
        <a href="#" class="dropdown-toggle" aria-expanded="false">
          <i class="fas fa-briefcase"></i> <span>Services</span>
          <i class="fas fa-chevron-down"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="https://flights.flyreisen24.com"><i class="fas fa-plane-departure"></i> Flights</a></li>
          <li><a href="/booking.html?url=https%3A%2F%2Ftrip.tpo.mx%2FbVJLx4bn"><i class="fas fa-hotel"></i> Hotels</a></li>
          <li><a href="/booking.html?url=https%3A%2F%2Fklook.tpo.mx%2FoOSUgcwd"><i class="fas fa-car"></i> Car Rental</a></li>
        </ul>
      </li>
      <li>
        <a href="{deals}" class="top-nav-prominent-link">
          <i class="fas fa-tags"></i> <span>Deals</span>
          <span class="new-badge">NEW</span>
        </a>
      </li>
      <li>
        <a href="#" class="dropdown-toggle" aria-expanded="false">
          <i class="fas fa-book-open"></i> <span>Knowledge</span>
          <i class="fas fa-chevron-down"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="{prefix}landing.html"><i class="fas fa-book-open"></i> 15 Questions Before You Fly</a></li>
          <li><a href="/tools.html"><i class="fas fa-wrench"></i> Tools</a></li>
        </ul>
      </li>
    </ul>

    <div class="nav-right">
      <a href="/contact.html" class="nav-help">
        <i class="fas fa-headset"></i> Help
      </a>
      <div class="language-dropdown" id="languageDropdown">
        <button class="lang-current" onclick="toggleLangDropdown()">
          <i class="fas fa-globe"></i>
          <span id="currentLang">{lang_label}</span>
          <i class="fas fa-chevron-down" style="font-size:10px"></i>
        </button>
        <div class="lang-dropdown-menu">
          <a href="/th/faq/{slug}.html">🇹🇭 ไทย (TH)</a>
          <a href="/en/faq/{slug}.html"{en_active}>🇬🇧 English (EN)</a>
          <a href="/de/faq/{slug}.html"{de_active}>🇩🇪 Deutsch (DE)</a>
        </div>
      </div>
    </div>"""
    else:
        nav = f"""    <ul class="top-nav-menu" id="topNavMenu">
      <li>
        <a href="#" class="dropdown-toggle" aria-expanded="false">
          <i class="fas fa-briefcase"></i> <span>Leistungen</span>
          <i class="fas fa-chevron-down"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="https://flights.flyreisen24.com"><i class="fas fa-plane-departure"></i> Flüge</a></li>
          <li><a href="/booking.html?url=https%3A%2F%2Ftrip.tpo.mx%2FbVJLx4bn"><i class="fas fa-hotel"></i> Hotels</a></li>
          <li><a href="/booking.html?url=https%3A%2F%2Fklook.tpo.mx%2FoOSUgcwd"><i class="fas fa-car"></i> Mietwagen</a></li>
        </ul>
      </li>
      <li>
        <a href="{deals}" class="top-nav-prominent-link">
          <i class="fas fa-tags"></i> <span>Angebote</span>
          <span class="new-badge">NEU</span>
        </a>
      </li>
      <li>
        <a href="#" class="dropdown-toggle" aria-expanded="false">
          <i class="fas fa-book-open"></i> <span>Wissen</span>
          <i class="fas fa-chevron-down"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a href="{prefix}landing.html"><i class="fas fa-book-open"></i> 15 Fragen vor dem Abflug</a></li>
          <li><a href="/tools.html"><i class="fas fa-wrench"></i> Reise-Tools</a></li>
        </ul>
      </li>
    </ul>

    <div class="nav-right">
      <a href="/contact.html" class="nav-help">
        <i class="fas fa-headset"></i> Hilfe
      </a>
      <div class="language-dropdown" id="languageDropdown">
        <button class="lang-current" onclick="toggleLangDropdown()">
          <i class="fas fa-globe"></i>
          <span id="currentLang">{lang_label}</span>
          <i class="fas fa-chevron-down" style="font-size:10px"></i>
        </button>
        <div class="lang-dropdown-menu">
          <a href="/th/faq/{slug}.html">🇹🇭 ไทย (TH)</a>
          <a href="/en/faq/{slug}.html"{en_active}>🇬🇧 English (EN)</a>
          <a href="/de/faq/{slug}.html"{de_active}>🇩🇪 Deutsch (DE)</a>
        </div>
      </div>
    </div>"""
    return re.sub(
        r"(<ul class=\"top-nav-menu\" id=\"topNavMenu\">)[\s\S]*?(</div>\s*<button class=\"menu-toggle\")",
        nav + r"\n  \2",
        html,
        count=1,
    )


def replace_prevnext(html: str, locale: str, slug: str) -> str:
    idx = SLUGS.index(slug)
    prefix = f"/{locale}/faq/"
    prev_slug = SLUGS[idx - 1] if idx > 0 else None
    next_slug = SLUGS[idx + 1] if idx < len(SLUGS) - 1 else None
    if locale == "en":
        back = f'<a href="{prefix}landing.html" class="back-toc">\n      <i class="fas fa-th-large"></i> Knowledge Hub\n    </a>'
        if prev_slug:
            pl = f"{topic_num(prev_slug):02d} — {EN_TITLES[prev_slug]}"
            prev_a = f'<a href="{prefix}{prev_slug}.html"><i class="fas fa-arrow-left"></i> {pl}</a>'
        else:
            prev_a = "<span></span>"
        if next_slug:
            nl = f"{topic_num(next_slug):02d} — {EN_TITLES[next_slug]}"
            next_a = f'<a href="{prefix}{next_slug}.html">{nl} <i class="fas fa-arrow-right"></i></a>'
        else:
            next_a = "<span></span>"
    else:
        back = f'<a href="{prefix}landing.html" class="back-toc">\n      <i class="fas fa-th-large"></i> Übersicht\n    </a>'
        if prev_slug:
            pl = f"{topic_num(prev_slug):02d} — {DE_TITLES[prev_slug]}"
            prev_a = f'<a href="{prefix}{prev_slug}.html"><i class="fas fa-arrow-left"></i> {pl}</a>'
        else:
            prev_a = "<span></span>"
        if next_slug:
            nl = f"{topic_num(next_slug):02d} — {DE_TITLES[next_slug]}"
            next_a = f'<a href="{prefix}{next_slug}.html">{nl} <i class="fas fa-arrow-right"></i></a>'
        else:
            next_a = "<span></span>"
    inner = f"""    {prev_a}
    {back}
    {next_a}"""
    block = f"""<!-- ══════════════════════════════════════
     PREV / NEXT NAV (under hero)
══════════════════════════════════════ -->
<div class="nav-prevnext">
  <div class="nav-prevnext-inner">
{inner}
  </div>
</div>

<!-- ══════════════════════════════════════
     MAIN CONTENT"""
    return re.sub(
        r"<!-- ══════════════════════════════════════\s*\n\s*PREV / NEXT NAV \(under hero\)[\s\S]*?<!-- ══════════════════════════════════════\s*\n\s*MAIN CONTENT",
        block,
        html,
        count=1,
    )


def replace_sidebar_block(html: str, locale: str, slug: str) -> str:
    toc = build_sidebar_toc(locale, slug)
    prefix = f"/{locale}/faq/"
    if locale == "en":
        head_toc = "All 15 topics"
        mct_head = "Minimum Connection Time (Quick Ref)"
        mct_note = "Always allow 30 min buffer"
        cta_h = "Ready to book?"
        cta_p = "Compare 500+ airlines in one search"
        cta_btn = "Find Cheap Flights"
        lang_head = "Language"
        th_l = f'<a href="/th/faq/{slug}.html">🇹🇭 Thai</a>'
        en_l = f'<a href="/en/faq/{slug}.html" class="active">🇬🇧 English (reading)</a>'
        de_l = f'<a href="/de/faq/{slug}.html">🇩🇪 Deutsch</a>'
    else:
        head_toc = "Alle 15 Themen"
        mct_head = "Mindest-Umsteigezeiten (Kurzübersicht)"
        mct_note = "Immer mindestens 30 Minuten Puffer einplanen"
        cta_h = "Bereit zum Buchen?"
        cta_p = "Über 500 Airlines im Vergleich"
        cta_btn = "Günstige Flüge finden"
        lang_head = "Sprache"
        th_l = f'<a href="/th/faq/{slug}.html">🇹🇭 Thai</a>'
        en_l = f'<a href="/en/faq/{slug}.html">🇬🇧 English</a>'
        de_l = f'<a href="/de/faq/{slug}.html" class="active">🇩🇪 Deutsch (aktiv)</a>'
    block = f"""  <aside class="sidebar">

    <div class="side-card">
      <div class="side-head"><i class="fas fa-list"></i> {head_toc}</div>
      <div class="side-body">
        <ol class="toc-list">
{toc}
        </ol>
      </div>
    </div>

    <div class="side-card">
      <div class="side-head"><i class="fas fa-stopwatch"></i> {mct_head}</div>
      <div class="side-body">
        <div class="mct-row"><span class="mct-code">BKK Suvarnabhumi</span><span class="mct-time">75 min</span></div>
        <div class="mct-row"><span class="mct-code">DXB Dubai</span><span class="mct-time">90 min</span></div>
        <div class="mct-row"><span class="mct-code">LHR Heathrow</span><span class="mct-time">90 min</span></div>
        <div class="mct-row"><span class="mct-code">IST Istanbul</span><span class="mct-time">100 min</span></div>
        <div class="mct-row"><span class="mct-code">FRA Frankfurt</span><span class="mct-time">45 min</span></div>
        <p style="font-size:11px;color:#9ca3af;margin-top:8px"><i class="fas fa-info-circle"></i> {mct_note}</p>
      </div>
    </div>

    <div class="cta-side">
      <h3>{cta_h}</h3>
      <p>{cta_p}</p>
      <a href="https://flights.flyreisen24.com" class="btn-cta-white">
        <i class="fas fa-plane"></i> {cta_btn}
      </a>
    </div>

    <div class="side-card">
      <div class="side-head"><i class="fas fa-globe"></i> {lang_head}</div>
      <div class="side-body">
        <div class="lang-links">
          {th_l}
          {en_l}
          {de_l}
        </div>
      </div>
    </div>

  </aside>"""
    return re.sub(
        r"<aside class=\"sidebar\">[\s\S]*?</aside>",
        block,
        html,
        count=1,
    )


def replace_footer(html: str, locale: str, slug: str) -> str:
    prefix = f"/{locale}/faq/"
    deals = "/en/deals_en.html" if locale == "en" else "/de/deals_de.html"
    if locale == "en":
        block = f"""<footer class="main-footer">
  <div class="footer-grid">

    <div class="footer-col">
      <img src="https://www.flyreisen24.com/fly_reisen24_logo_white.png"
           alt="FlyReisen24 Logo" height="32" loading="lazy"
           style="height:32px;margin-bottom:14px;display:block">
      <p>Your travel platform for the best deals worldwide.</p>
    </div>

    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="https://flights.flyreisen24.com"><i class="fas fa-plane-departure"></i> Search Flights</a></li>
        <li><a href="/booking.html?url=https%3A%2F%2Ftrip.tpo.mx%2FbVJLx4bn"><i class="fas fa-hotel"></i> Book Hotels</a></li>
        <li><a href="{deals}"><i class="fas fa-tags"></i> Travel Deals</a></li>
        <li><a href="/tools.html"><i class="fas fa-wrench"></i> Tools</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Knowledge Hub</h4>
      <ul>
        <li><a href="{prefix}landing.html"><i class="fas fa-book-open"></i> 15 Questions Before You Fly</a></li>
        <li><a href="{prefix}01-passport-visa.html"><i class="fas fa-passport"></i> Passport & Visa</a></li>
        <li><a href="{prefix}03-baggage-rules.html"><i class="fas fa-suitcase"></i> Baggage Rules</a></li>
        <li><a href="{prefix}09-montreal-eu261.html"><i class="fas fa-gavel"></i> Passenger Rights</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Info</h4>
      <ul>
        <li><a href="/contact.html"><i class="fas fa-headset"></i> Contact Us</a></li>
        <li><a href="/en/about_en.html"><i class="fas fa-info-circle"></i> About Us</a></li>
        <li><a href="/en/privacy_en.html"><i class="fas fa-lock"></i> Privacy Policy</a></li>
        <li><a href="/en/terms_en.html"><i class="fas fa-file-contract"></i> Terms of Use</a></li>
      </ul>
    </div>

  </div>
  <div class="footer-bottom">
    <span>© 2026 FlyReisen24. All Rights Reserved. | Powered by Travelpayouts</span>
    <span>
      <a href="/th/faq/landing.html">TH</a> ·
      <a href="/en/faq/landing.html">EN</a> ·
      <a href="/de/faq/landing.html">DE</a>
    </span>
  </div>
</footer>"""
    else:
        block = f"""<footer class="main-footer">
  <div class="footer-grid">

    <div class="footer-col">
      <img src="https://www.flyreisen24.com/fly_reisen24_logo_white.png"
           alt="FlyReisen24 Logo" height="32" loading="lazy"
           style="height:32px;margin-bottom:14px;display:block">
      <p>Deine Reiseplattform für die besten Deals weltweit.</p>
    </div>

    <div class="footer-col">
      <h4>Leistungen</h4>
      <ul>
        <li><a href="https://flights.flyreisen24.com"><i class="fas fa-plane-departure"></i> Flüge suchen</a></li>
        <li><a href="/booking.html?url=https%3A%2F%2Ftrip.tpo.mx%2FbVJLx4bn"><i class="fas fa-hotel"></i> Hotels buchen</a></li>
        <li><a href="{deals}"><i class="fas fa-tags"></i> Reiseangebote</a></li>
        <li><a href="/tools.html"><i class="fas fa-wrench"></i> Reise-Tools</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Reisewissen</h4>
      <ul>
        <li><a href="{prefix}landing.html"><i class="fas fa-book-open"></i> 15 Fragen vor dem Abflug</a></li>
        <li><a href="{prefix}01-passport-visa.html"><i class="fas fa-passport"></i> Reisepass & Visum</a></li>
        <li><a href="{prefix}03-baggage-rules.html"><i class="fas fa-suitcase"></i> Gepäckregeln</a></li>
        <li><a href="{prefix}09-montreal-eu261.html"><i class="fas fa-gavel"></i> Fluggastrechte</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Infos</h4>
      <ul>
        <li><a href="/contact.html"><i class="fas fa-headset"></i> Kontakt</a></li>
        <li><a href="/de/about_de.html"><i class="fas fa-info-circle"></i> Über uns</a></li>
        <li><a href="/de/privacy_de.html"><i class="fas fa-lock"></i> Datenschutz</a></li>
        <li><a href="/de/terms_de.html"><i class="fas fa-file-contract"></i> AGB</a></li>
      </ul>
    </div>

  </div>
  <div class="footer-bottom">
    <span>© 2026 FlyReisen24. Alle Rechte vorbehalten. | Powered by Travelpayouts</span>
    <span>
      <a href="/th/faq/landing.html">TH</a> ·
      <a href="/en/faq/landing.html">EN</a> ·
      <a href="/de/faq/landing.html">DE</a>
    </span>
  </div>
</footer>"""
    return re.sub(r"<footer class=\"main-footer\">[\s\S]*?</footer>", block, html, count=1)


def patch_json_ld(html: str, locale: str, slug: str) -> str:
    title = EN_TITLES[slug] if locale == "en" else DE_TITLES[slug]
    prefix = f"/{locale}/faq/"
    absu = f"https://www.flyreisen24.com{prefix}{slug}.html"
    lang = "en" if locale == "en" else "de"
    bc2 = "Knowledge Hub" if locale == "en" else "Reisewissen"
    landing_url = f"https://www.flyreisen24.com{prefix}landing.html"

    def article_repl(m: re.Match) -> str:
        j = m.group(0)
        j = re.sub(r'"headline"\s*:\s*"[^"]*"', f'"headline": "{title}"', j)
        j = re.sub(r'"url"\s*:\s*"https://www\.flyreisen24\.com/[^"]+"', f'"url": "{absu}"', j, count=1)
        j = re.sub(r'"inLanguage"\s*:\s*"th"', f'"inLanguage": "{lang}"', j)
        return j

    html = re.sub(
        r'<script type="application/ld\+json">\s*\{\s*"@context"[^@]*"@type"\s*:\s*"Article"[^<]*</script>',
        article_repl,
        html,
        count=1,
        flags=re.DOTALL,
    )

    def bc_repl(m: re.Match) -> str:
        j = m.group(0)
        j = re.sub(
            r'"position"\s*:\s*2[^}]+',
            f'"position": 2, "name": "{bc2}", "item": "{landing_url}"',
            j,
            count=1,
        )
        j = re.sub(
            r'"position"\s*:\s*3[^}]+',
            f'"position": 3, "name": "{title}", "item": "{absu}" ',
            j,
            count=1,
        )
        return j

    html = re.sub(
        r'<script type="application/ld\+json">\s*\{\s*"@context"[^@]*"@type"\s*:\s*"BreadcrumbList"[^<]*</script>',
        bc_repl,
        html,
        count=1,
        flags=re.DOTALL,
    )
    return html


def patch_head_meta(html: str, locale: str, slug: str) -> str:
    title = EN_TITLES[slug] if locale == "en" else DE_TITLES[slug]
    prefix = f"/{locale}/faq/"
    absu = f"https://www.flyreisen24.com{prefix}{slug}.html"
    lang = "en" if locale == "en" else "de"
    desc = (
        f"{title} — in-depth guide (English translation of the article body pending)."
        if locale == "en"
        else f"{title} — ausführlicher Ratgeber (deutsche Übersetzung des Artikeltexts ausstehend)."
    )
    html = html.replace('<html lang="th">', f'<html lang="{lang}">', 1)
    html = re.sub(r"<title>[^<]*</title>", f"<title>{title} | FlyReisen24</title>", html, count=1)
    html = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{desc}"',
        html,
        count=1,
    )
    html = re.sub(
        r'<link rel="canonical" href="https://www\.flyreisen24\.com/th/faq/[^"]+"',
        f'<link rel="canonical" href="{absu}"',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:url"\s+content="https://www\.flyreisen24\.com/th/faq/[^"]+"',
        f'<meta property="og:url"         content="{absu}"',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:title"\s+content="[^"]+"',
        f'<meta property="og:title"       content="{title} | FlyReisen24"',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:description" content="[^"]+"',
        f'<meta property="og:description" content="{desc}"',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:locale"\s+content="th_TH"',
        '<meta property="og:locale"      content="en_US"'
        if locale == "en"
        else '<meta property="og:locale"      content="de_DE"',
        html,
        count=1,
    )
    return html


def restore_x_default_to_th(html: str, slug: str) -> str:
    """Keep x-default pointing at the Thai URL (same as source TH pages)."""
    th_abs = f"https://www.flyreisen24.com/th/faq/{slug}.html"
    return re.sub(
        r'(<link rel="alternate" hreflang="x-default"\s+href=")https://www\.flyreisen24\.com/(?:en|de)/faq/'
        + re.escape(slug)
        + r'\.html(">)',
        rf"\1{th_abs}\2",
        html,
        count=1,
    )


def insert_article_placeholder(html: str, locale: str) -> str:
    cmt = (
        "<!-- CONTENT PLACEHOLDER: English translation pending -->\n"
        if locale == "en"
        else "<!-- CONTENT PLACEHOLDER: Deutsche Übersetzung ausstehend -->\n"
    )
    return html.replace(
        '<article class="article-body">',
        '<article class="article-body">\n\n      ' + cmt,
        1,
    )


def patch_article_bottom_nav(html: str, locale: str, slug: str) -> str:
    """Replace back-to-index label inside article when still Thai."""
    return html.replace(
        '<i class="fas fa-th-large"></i> สารบัญ',
        '<i class="fas fa-th-large"></i> ' + ("Knowledge Hub" if locale == "en" else "Übersicht"),
    )


def transform_detail(html: str, locale: str, slug: str) -> str:
    prefix = f"/{locale}/faq/"
    html = patch_head_meta(html, locale, slug)
    html = replace_urls_except_th_hreflang(html, prefix)
    html = restore_x_default_to_th(html, slug)
    html = patch_json_ld(html, locale, slug)
    html = replace_top_nav(html, locale, slug)
    html = replace_breadcrumb(html, locale, slug)
    html = replace_hero_block(html, locale, slug)
    html = replace_prevnext(html, locale, slug)
    html = insert_article_placeholder(html, locale)
    html = replace_sidebar_block(html, locale, slug)
    html = replace_footer(html, locale, slug)
    html = patch_article_bottom_nav(html, locale, slug)
    # bottom article nav row with prev/next labels - optional second block
    return html


def write_landing_pages() -> None:
    """Copy EN/DE hub landing to /en/faq/landing.html and /de/faq/landing.html."""
    candidates_en = [
        ROOT / "landing_en.html",
        ROOT / "tools" / "landing_en.html",
        ROOT / "en" / "faq_landing_en.html",
    ]
    candidates_de = [
        ROOT / "landing_de.html",
        ROOT / "tools" / "landing_de.html",
        ROOT / "de" / "faq_landing_de.html",
    ]
    out_en = ROOT / "en" / "faq" / "landing.html"
    out_de = ROOT / "de" / "faq" / "landing.html"
    for p in candidates_en:
        if p.is_file():
            text = p.read_text(encoding="utf-8")
            text = text.replace(
                "Your travel platform for the best deals — flights, hotels and activities from top partners worldwide.",
                "Your travel platform for the best deals worldwide.",
            )
            out_en.write_text(text, encoding="utf-8")
            break
    for p in candidates_de:
        if p.is_file():
            text = p.read_text(encoding="utf-8")
            text = text.replace(
                "Deine Reiseplattform für die besten Deals — Flüge, Hotels und Aktivitäten von Top-Partnern weltweit.",
                "Deine Reiseplattform für die besten Deals weltweit.",
            )
            out_de.write_text(text, encoding="utf-8")
            break


def append_sitemap_entries() -> None:
    sm = ROOT / "sitemap-1.xml"
    if not sm.is_file():
        return
    text = sm.read_text(encoding="utf-8")
    if "en/faq/landing.html" in text and "/en/faq/01-passport-visa.html" in text:
        return
    urls = [
        "https://www.flyreisen24.com/en/faq/landing.html",
        "https://www.flyreisen24.com/de/faq/landing.html",
    ]
    for slug in SLUGS:
        urls.append(f"https://www.flyreisen24.com/en/faq/{slug}.html")
        urls.append(f"https://www.flyreisen24.com/de/faq/{slug}.html")
    blocks = []
    for loc in urls:
        blocks.append(
            f"""  <url>
    <loc>{loc}</loc>
    <lastmod>2026-05-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>"""
        )
    insert = "\n\n  <!-- FAQ EN/DE series -->\n" + "\n".join(blocks) + "\n"
    text = text.replace("</urlset>", insert + "</urlset>")
    sm.write_text(text, encoding="utf-8")


def main() -> None:
    (ROOT / "en" / "faq").mkdir(parents=True, exist_ok=True)
    (ROOT / "de" / "faq").mkdir(parents=True, exist_ok=True)
    legacy = [
        "baggage-rules.html",
        "booking-types.html",
        "charter-overbooking.html",
        "connection-time.html",
        "flight-changes.html",
        "frequent-flyer.html",
        "online-checkin.html",
        "passenger-rights.html",
        "passport-visa.html",
        "saf-future.html",
    ]
    for loc in ("en", "de"):
        for name in legacy:
            p = ROOT / loc / "faq" / name
            if p.is_file():
                p.unlink()
    write_landing_pages()
    for slug in SLUGS:
        src = TH_FAQ / f"{slug}.html"
        raw = src.read_text(encoding="utf-8")
        en_html = transform_detail(raw, "en", slug)
        de_html = transform_detail(raw, "de", slug)
        (ROOT / "en" / "faq" / f"{slug}.html").write_text(en_html, encoding="utf-8")
        (ROOT / "de" / "faq" / f"{slug}.html").write_text(de_html, encoding="utf-8")
    append_sitemap_entries()
    print(
        "Wrote EN/DE FAQ: landing + 15 detail each; sitemap-1.xml updated if needed. "
        "Landings from landing_en.html / landing_de.html at repo root (or tools/)."
    )


if __name__ == "__main__":
    main()
