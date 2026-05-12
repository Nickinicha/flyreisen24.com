# -*- coding: utf-8 -*-
from pathlib import Path

FAQ = Path(__file__).resolve().parent.parent / "th" / "faq"

# dest, source (None = stub), short title for prev/next
SERIES = [
    ("01-passport-visa.html", "passport-visa.html", "Passport & Visa"),
    ("02-connection-time.html", "connection-time.html", "ต่อเครื่อง / MCT"),
    ("03-baggage-rules.html", "baggage-rules.html", "สัมภาระ & ของเหลว"),
    ("04-flight-changes.html", "flight-changes.html", "เปลี่ยนตั๋ว / ยกเลิก"),
    ("05-codeshare-stopover.html", "booking-types.html", "Codeshare & Open-Jaw"),
    ("06-frequent-flyer.html", "frequent-flyer.html", "Frequent Flyer"),
    ("07-charter-overbooking.html", "charter-overbooking.html", "Charter & Overbooking"),
    ("08-online-checkin.html", "online-checkin.html", "Online Check-in"),
    ("09-montreal-eu261.html", "passenger-rights.html", "Montreal & EU261"),
    ("10-saf-future.html", "saf-future.html", "SAF & อนาคตการบิน"),
    ("11-airport-security.html", None, "รปภ.สนามบิน 2026"),
    ("12-travel-insurance.html", None, "ประกันการเดินทาง"),
    ("13-airport-lounge.html", None, "Lounge สนามบิน"),
    ("14-special-needs.html", None, "ผู้โดยสารพิเศษ & เด็ก"),
    ("15-booking-tips.html", "booking-types.html", "เคล็ดลับจองตั๋ว"),
]

# Slug replacements (except booking-types — handled per dest)
CORE_MAP = [
    ("passport-visa.html", "01-passport-visa.html"),
    ("connection-time.html", "02-connection-time.html"),
    ("baggage-rules.html", "03-baggage-rules.html"),
    ("flight-changes.html", "04-flight-changes.html"),
    ("frequent-flyer.html", "06-frequent-flyer.html"),
    ("charter-overbooking.html", "07-charter-overbooking.html"),
    ("online-checkin.html", "08-online-checkin.html"),
    ("passenger-rights.html", "09-montreal-eu261.html"),
    ("saf-future.html", "10-saf-future.html"),
]

BACK_SNIPPET = (
    '\n<div class="series-back-wrap" style="max-width:1100px;margin:0 auto;padding:12px 24px 0;'
    'font-family:IBM Plex Sans Thai,system-ui,sans-serif;font-size:15px">'
    '<a href="/th/faq/landing.html" style="color:#003d82;font-weight:700;text-decoration:none">'
    "← กลับสารบัญ</a></div>\n"
)


def replace_pairs(html: str, pairs) -> str:
    for old, new in pairs:
        html = html.replace(f"/th/faq/{old}", f"/th/faq/{new}")
        html = html.replace(
            f"https://www.flyreisen24.com/th/faq/{old}",
            f"https://www.flyreisen24.com/th/faq/{new}",
        )
        html = html.replace(
            f"https://flyreisen24.com/th/faq/{old}",
            f"https://www.flyreisen24.com/th/faq/{new}",
        )
    return html


def link_pairs_for(dest: str):
    pairs = list(CORE_MAP)
    if dest == "05-codeshare-stopover.html":
        pairs.append(("booking-types.html", "05-codeshare-stopover.html"))
    elif dest == "15-booking-tips.html":
        pairs.append(("booking-types.html", "15-booking-tips.html"))
    else:
        pairs.append(("booking-types.html", "05-codeshare-stopover.html"))
    return pairs


def inject_after_body(html: str, insert: str) -> str:
    import re

    m = re.search(r"(<body[^>]*>)", html, re.I)
    if not m:
        return insert + html
    return html[: m.end()] + insert + html[m.end() :]


def inject_prev_next(html: str, idx: int, titles):
    prev_html = ""
    next_html = ""
    if idx > 0:
        p = SERIES[idx - 1][0]
        prev_html = (
            f'<a href="/th/faq/{p}" style="color:#003d82;font-weight:600;text-decoration:none">'
            f"← ก่อนหน้า: {titles[idx - 1]}</a>"
        )
    if idx < len(SERIES) - 1:
        n = SERIES[idx + 1][0]
        next_html = (
            f'<a href="/th/faq/{n}" style="color:#003d82;font-weight:600;text-decoration:none">'
            f"ถัดไป: {titles[idx + 1]} →</a>"
        )
    nav = (
        '\n<nav class="series-prevnext" aria-label="หัวข้อก่อน-ถัดไป" '
        'style="max-width:1100px;margin:2rem auto 0;padding:16px 24px;display:flex;'
        "justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid #e2e8f0;"
        'font-family:IBM Plex Sans Thai,system-ui,sans-serif;font-size:15px">'
        f"<span>{prev_html}</span><span style='text-align:right'>{next_html}</span></nav>\n"
    )
    if '<footer class="footer"' in html:
        return html.replace('<footer class="footer"', nav + '<footer class="footer"', 1)
    if "<footer " in html:
        return html.replace("<footer ", nav + "<footer ", 1)
    if '<button class="cw-btn"' in html:
        return html.replace('<button class="cw-btn"', nav + '<button class="cw-btn"', 1)
    return html + nav


STUB_TEMPLATE = """<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | FlyReisen24</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://www.flyreisen24.com/th/faq/{slug}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;600;700&display=swap" rel="stylesheet">
<style>
body{{font-family:'IBM Plex Sans Thai',sans-serif;background:#FAF9F6;color:#1a2332;line-height:1.85;margin:0;padding:0 0 48px}}
.wrap{{max-width:720px;margin:0 auto;padding:24px}}
h1{{font-size:1.55rem;margin:1.2rem 0 .8rem}}
p{{margin:0 0 1rem}}
.box{{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-top:12px}}
</style>
</head>
<body>
{back}
<div class="wrap">
  <p style="font-size:14px;margin:0 0 8px"><span style="color:#64748b">หัวข้อ {num}/15</span></p>
  <h1>{title}</h1>
  <p>{intro}</p>
  <div class="box">
    <p><strong>หมายเหตุ:</strong> เนื้อหาฉบับเต็มกำลังจัดทำ — ดูภาพรวม 15 หัวข้อและหัวข้ออื่น ๆ ได้ที่สารบัญ</p>
    <p><a href="/th/faq/landing.html" style="color:#003d82;font-weight:700">ไปหน้า 15 คำถามสำคัญ</a></p>
  </div>
</div>
{prevnext}
<script src="/common.js" defer></script>
</body>
</html>
"""

STUB_META = {
    "11-airport-security.html": (
        "Airport Security 2026: CT Scanner & ขั้นตอนใหม่",
        "สรุปแนวโน้มรปภ.สนามบิน 2026 — เครื่องสแกน CT ของเหลว และสิ่งที่ควรเตรียมก่อนถึงด่าน",
        "เครื่องสแกน CT กำลังขยายในสนามบินหลายแห่ง กฎของเหลวและขั้นตอนรปภ.เปลี่ยนได้ตามสนามบินและสายการบิน — ตรวจสอบกับสายการบินก่อนทุกเที่ยวบิน",
    ),
    "12-travel-insurance.html": (
        "ประกันการเดินทาง: เลือกแบบไหนให้ครอบคลุม",
        "วงเงิน การเวนคืน โรคเดิม และการอพยพทางการแพทย์ — สิ่งที่ควรอ่านในกรมธรรม์ก่อนซื้อ",
        "ประกันการเดินทางช่วยลดความเสี่ยงค่ารักษาและการยกเลิกทริป ควรเปรียบเทียบความคุ้มครอง ข้อยกเว้น และเบอร์ฉุกเฉินในประเทศปลายทาง",
    ),
    "13-airport-lounge.html": (
        "Airport Lounge: เข้าได้อย่างไร",
        "Priority Pass บัตรเครดิต สถานะสายการบิน และกฎการพาแขก — เบื้องต้นที่ควรรู้",
        "ห้องรับรองสนามบินเข้าได้หลายช่องทาง ตั้งแต่ตั๋วชั้นธุรกิจไปจนถึงพาสแยก ควรตรวจสอบสนามบินต้นทางและข้อจำกัดของแต่ละบัตร",
    ),
    "14-special-needs.html": (
        "ผู้โดยสารพิเศษ & เด็กเดินทางคนเดียว",
        "UMNR ผู้พิการ อุปกรณ์ช่วยเดิน และสัตว์เลี้ยงในเที่ยวบิน — ขั้นตอนการแจ้งล่วงหน้า",
        "สายการบินส่วนใหญ่ต้องการการแจ้งความต้องการพิเศษล่วงหน้า (อาจมีค่าบริการหรือเอกสารเพิ่ม) ควรจองและแจ้งทันทีหลังซื้อตั๋ว",
    ),
}


def build_prevnext_block(idx: int, titles):
    prev_html = ""
    next_html = ""
    if idx > 0:
        p = SERIES[idx - 1][0]
        prev_html = (
            f'<a href="/th/faq/{p}" style="color:#003d82;font-weight:600;text-decoration:none">'
            f"← ก่อนหน้า: {titles[idx - 1]}</a>"
        )
    if idx < len(SERIES) - 1:
        n = SERIES[idx + 1][0]
        next_html = (
            f'<a href="/th/faq/{n}" style="color:#003d82;font-weight:600;text-decoration:none">'
            f"ถัดไป: {titles[idx + 1]} →</a>"
        )
    return (
        '<nav class="series-prevnext" aria-label="หัวข้อก่อน-ถัดไป" '
        'style="max-width:1100px;margin:2rem auto 0;padding:16px 24px;display:flex;'
        "justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid #e2e8f0;"
        'font-family:IBM Plex Sans Thai,system-ui,sans-serif;font-size:15px">'
        f"<span>{prev_html}</span><span style='text-align:right'>{next_html}</span></nav>\n"
    )


def main():
    titles = [row[2] for row in SERIES]
    for idx, (dest, src_name, _) in enumerate(SERIES):
        dest_path = FAQ / dest
        if src_name is None:
            title, desc, intro = STUB_META[dest]
            num = dest[:2]
            html = STUB_TEMPLATE.format(
                title=title,
                desc=desc,
                slug=dest,
                num=num,
                intro=intro,
                back=BACK_SNIPPET.strip(),
                prevnext=build_prevnext_block(idx, titles),
            )
            dest_path.write_text(html, encoding="utf-8")
            print("stub", dest)
            continue

        html = (FAQ / src_name).read_text(encoding="utf-8")
        html = replace_pairs(html, link_pairs_for(dest))
        html = inject_after_body(html, BACK_SNIPPET)
        html = inject_prev_next(html, idx, titles)

        if dest == "15-booking-tips.html":
            html = html.replace("05 · Booking Types", "15 · เคล็ดลับจองตั๋ว")
            html = html.replace(">05 /", ">15 /")
            html = html.replace("หัวข้อที่ 05", "หัวข้อที่ 15")
            html = html.replace("หัวข้อ 05", "หัวข้อ 15")
            html = html.replace("05 / 15", "15 / 15")
            html = html.replace(
                "Codeshare, Stopover และ Open-jaw คืออะไร",
                "เคล็ดลับจองตั๋วเครื่องบินราคาดี",
            )

        if dest in ("05-codeshare-stopover.html", "15-booking-tips.html"):
            html = html.replace(
                "https://flyreisen24.com/th/booking-types.html",
                f"https://www.flyreisen24.com/th/faq/{dest}",
            )
            html = html.replace(
                "https://www.flyreisen24.com/th/booking-types.html",
                f"https://www.flyreisen24.com/th/faq/{dest}",
            )

        dest_path.write_text(html, encoding="utf-8")
        print("wrote", dest)


if __name__ == "__main__":
    main()
