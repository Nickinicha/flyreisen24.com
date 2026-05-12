# -*- coding: utf-8 -*-
"""
Rebuild /th/faq/01-15 from faq-detail-template.html + metadata from cursor-rebuild-prompt.md.
If faq_content_all15.md is absent, article body is taken from the existing HTML file (article/main).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "faq-detail-template.html"
FAQ = ROOT / "th" / "faq"
MD = ROOT / "faq_content_all15.md"

# Metadata: keys match %%PLACEHOLDER%% (without %%); C01–C15 set at build time
PAGES = [
    {
        "SLUG": "01-passport-visa",
        "PAGE_TITLE": "Passport & Visa Bible: สิ่งที่ด่านตรวจฯ ไม่บอกคุณ",
        "META_DESC": "กฎ 6 เดือนพาสปอร์ต หน้าว่าง Transit Visa และเหตุผลที่สายการบินตรวจเข้ม — คู่มือครบก่อนเดินทางระหว่างประเทศ 2026",
        "BREADCRUMB_TITLE": "Passport & Visa Bible",
        "BADGE_LABEL": "Must Know · หัวข้อที่ 01",
        "H1_TITLE": "Passport & Visa Bible<br><em>สิ่งที่ด่านตรวจฯ ไม่บอกคุณ</em>",
        "HERO_SUBTITLE": "พาสปอร์ต วีซ่า และรายละเอียดเล็กๆ ที่ทำให้ผู้โดยสารถูกปฏิเสธขึ้นเครื่องทุกวัน",
        "READ_TIME": "5",
        "CATEGORY": "Must Know",
        "PREV_LINK": "<span></span>",
        "NEXT_LINK": '<a href="/th/faq/02-connection-time.html">02 — Time Traps <i class="fas fa-arrow-right"></i></a>',
        "FILE": "01-passport-visa.html",
        "current": 1,
    },
    {
        "SLUG": "02-connection-time",
        "PAGE_TITLE": "Time Traps: กับดักเวลาต่อเครื่องที่คนมักพลาด",
        "META_DESC": "MCT คืออะไร กับดักเที่ยงคืน การเปลี่ยนเทอร์มินัล และวิธีลดความเสี่ยงตกเครื่องต่อ — อัปเดต 2026",
        "BREADCRUMB_TITLE": "Time Traps: ต่อเครื่อง",
        "BADGE_LABEL": "Must Know · หัวข้อที่ 02",
        "H1_TITLE": "Time Traps<br><em>กับดักเวลาต่อเครื่องที่คนมักพลาด</em>",
        "HERO_SUBTITLE": "MCT, การเปลี่ยนเทอร์มินัล และเที่ยวบินกลางคืน — ทุกสิ่งที่ทำให้คุณตกเครื่องโดยไม่คาดคิด",
        "READ_TIME": "4",
        "CATEGORY": "Must Know",
        "PREV_LINK": '<a href="/th/faq/01-passport-visa.html"><i class="fas fa-arrow-left"></i> 01 — Passport & Visa</a>',
        "NEXT_LINK": '<a href="/th/faq/03-baggage-rules.html">03 — Baggage Rules <i class="fas fa-arrow-right"></i></a>',
        "FILE": "02-connection-time.html",
        "current": 2,
    },
    {
        "SLUG": "03-baggage-rules",
        "PAGE_TITLE": "Baggage Rules 2026: ขนาด น้ำหนัก Power Bank ครบทุกกฎ",
        "META_DESC": "ตารางขนาดกระเป๋ารายสายการบิน กฎของเหลว 3-1-1 Power Bank Wh และค่าธรรมเนียมส่วนเกินจริง — ไม่ต้องจ่ายแพงกว่าที่ควร",
        "BREADCRUMB_TITLE": "Baggage Rules 2026",
        "BADGE_LABEL": "Must Know · หัวข้อที่ 03",
        "H1_TITLE": "Baggage Rules 2026<br><em>ทุกกฎที่ต้องรู้ก่อนแพ็กกระเป๋า</em>",
        "HERO_SUBTITLE": "ตารางขนาดกระเป๋าจริงรายสายการบิน กฎของเหลว 3-1-1 และวิธีคำนวณ Power Bank ให้ผ่านทุกสนามบิน",
        "READ_TIME": "6",
        "CATEGORY": "Must Know",
        "PREV_LINK": '<a href="/th/faq/02-connection-time.html"><i class="fas fa-arrow-left"></i> 02 — Time Traps</a>',
        "NEXT_LINK": '<a href="/th/faq/04-flight-changes.html">04 — Flight Changes <i class="fas fa-arrow-right"></i></a>',
        "FILE": "03-baggage-rules.html",
        "current": 3,
    },
    {
        "SLUG": "04-flight-changes",
        "PAGE_TITLE": "เปลี่ยนตั๋ว-ยกเลิกเที่ยวบิน: สิทธิ EU261 และค่าชดเชยจริง",
        "META_DESC": "ตารางเงื่อนไขตั๋ว 4 ประเภท EU261 ชดเชย 250-600 ยูโร และ Step-by-step ยื่นเรื่องให้สำเร็จ",
        "BREADCRUMB_TITLE": "Flight Changes & Cancellations",
        "BADGE_LABEL": "Tips · หัวข้อที่ 04",
        "H1_TITLE": "Flight Changes & Cancellations<br><em>รู้สิทธิก่อนโทรหาสายการบิน</em>",
        "HERO_SUBTITLE": "เงื่อนไขตั๋ว 4 แบบ EU261 ชดเชยสูงสุด 600 ยูโร และวิธียื่นเรื่องให้ได้เงินคืนจริง",
        "READ_TIME": "5",
        "CATEGORY": "Tips",
        "PREV_LINK": '<a href="/th/faq/03-baggage-rules.html"><i class="fas fa-arrow-left"></i> 03 — Baggage Rules</a>',
        "NEXT_LINK": '<a href="/th/faq/05-codeshare-stopover.html">05 — Codeshare <i class="fas fa-arrow-right"></i></a>',
        "FILE": "04-flight-changes.html",
        "current": 4,
    },
    {
        "SLUG": "05-codeshare-stopover",
        "PAGE_TITLE": "Codeshare, Stopover และ Open-Jaw: ตั๋วพิเศษที่ช่วยประหยัด",
        "META_DESC": "Codeshare คืออะไร Stopover ใช้อย่างไร Open-Jaw ประหยัดอย่างไร — คู่มือตั๋วแบบพิเศษสำหรับนักเดินทางฉลาด",
        "BREADCRUMB_TITLE": "Codeshare & Open-Jaw",
        "BADGE_LABEL": "Tips · หัวข้อที่ 05",
        "H1_TITLE": "Codeshare, Stopover & Open-Jaw<br><em>ตั๋วพิเศษที่ช่วยให้เดินทางคุ้มขึ้น</em>",
        "HERO_SUBTITLE": "เข้าใจโครงสร้างตั๋ว 3 แบบที่ช่วยประหยัดเงินและเที่ยวได้หลายเมืองในทริปเดียว",
        "READ_TIME": "4",
        "CATEGORY": "Tips",
        "PREV_LINK": '<a href="/th/faq/04-flight-changes.html"><i class="fas fa-arrow-left"></i> 04 — Flight Changes</a>',
        "NEXT_LINK": '<a href="/th/faq/06-frequent-flyer.html">06 — Frequent Flyer <i class="fas fa-arrow-right"></i></a>',
        "FILE": "05-codeshare-stopover.html",
        "current": 5,
    },
    {
        "SLUG": "06-frequent-flyer",
        "PAGE_TITLE": "Frequent Flyer 2026: เลือก Alliance และสะสมไมล์ให้คุ้ม",
        "META_DESC": "เปรียบเทียบ Star Alliance oneworld SkyTeam — ระดับ Silver/Gold/Platinum สิทธิพิเศษจริง และ Devaluation Risk ที่ต้องรู้",
        "BREADCRUMB_TITLE": "Frequent Flyer Programs",
        "BADGE_LABEL": "Tips · หัวข้อที่ 06",
        "H1_TITLE": "Frequent Flyer Programs<br><em>สะสมไมล์อย่างไรให้คุ้มจริง</em>",
        "HERO_SUBTITLE": "เปรียบเทียบ 3 Alliance หลัก สิทธิระดับ Gold/Platinum และเหตุผลที่ไมล์ที่ดีที่สุดคือไมล์ที่ใช้แล้ว",
        "READ_TIME": "5",
        "CATEGORY": "Tips",
        "PREV_LINK": '<a href="/th/faq/05-codeshare-stopover.html"><i class="fas fa-arrow-left"></i> 05 — Codeshare</a>',
        "NEXT_LINK": '<a href="/th/faq/07-charter-overbooking.html">07 — Overbooking <i class="fas fa-arrow-right"></i></a>',
        "FILE": "06-frequent-flyer.html",
        "current": 6,
    },
    {
        "SLUG": "07-charter-overbooking",
        "PAGE_TITLE": "Charter Flights และ Overbooking: สิทธิที่ต้องรู้",
        "META_DESC": "Charter flight ต่างจากเที่ยวบินปกติอย่างไร Overbooking คืออะไร และขอเอกสารอะไรทันทีเมื่อถูกปฏิเสธขึ้นเครื่อง",
        "BREADCRUMB_TITLE": "Charter & Overbooking",
        "BADGE_LABEL": "Rights · หัวข้อที่ 07",
        "H1_TITLE": "Charter Flights & Overbooking<br><em>เที่ยวบินและสิทธิที่ต้องรู้</em>",
        "HERO_SUBTITLE": "เที่ยวบินเช่าเหมาลำ การจองเกินที่นั่ง และสิทธิชดเชยเมื่อถูกปฏิเสธขึ้นเครื่อง",
        "READ_TIME": "4",
        "CATEGORY": "Rights",
        "PREV_LINK": '<a href="/th/faq/06-frequent-flyer.html"><i class="fas fa-arrow-left"></i> 06 — Frequent Flyer</a>',
        "NEXT_LINK": '<a href="/th/faq/08-online-checkin.html">08 — Check-in Tips <i class="fas fa-arrow-right"></i></a>',
        "FILE": "07-charter-overbooking.html",
        "current": 7,
    },
    {
        "SLUG": "08-online-checkin",
        "PAGE_TITLE": "Online Check-in Tips: เช็คอินออนไลน์ให้ได้ประโยชน์สูงสุด",
        "META_DESC": "เปิดเช็คอินเมื่อไหร่ IATA Code สำคัญที่ต้องจำ และข้อควรระวังก่อนเดินทางต่างประเทศ",
        "BREADCRUMB_TITLE": "Online Check-in Tips",
        "BADGE_LABEL": "Tips · หัวข้อที่ 08",
        "H1_TITLE": "Online Check-in Tips<br><em>ช่วยมากกว่าที่คิด</em>",
        "HERO_SUBTITLE": "เช็คอินออนไลน์ถูกเวลา เลือกที่นั่งดี และตรวจสอบข้อผิดพลาดก่อนถึงสนามบิน",
        "READ_TIME": "4",
        "CATEGORY": "Tips",
        "PREV_LINK": '<a href="/th/faq/07-charter-overbooking.html"><i class="fas fa-arrow-left"></i> 07 — Overbooking</a>',
        "NEXT_LINK": '<a href="/th/faq/09-montreal-eu261.html">09 — EU261 <i class="fas fa-arrow-right"></i></a>',
        "FILE": "08-online-checkin.html",
        "current": 8,
    },
    {
        "SLUG": "09-montreal-eu261",
        "PAGE_TITLE": "สิทธิผู้โดยสาร: Montreal Convention และ EU261 ฉบับสมบูรณ์",
        "META_DESC": "กระเป๋าหาย 58,000 บาท เที่ยวบินยกเลิก 600 ยูโร — ตัวเลขชดเชยจริงและ Step-by-step ยื่นเรื่องกระเป๋าสูญหาย",
        "BREADCRUMB_TITLE": "Montreal Convention & EU261",
        "BADGE_LABEL": "Rights · หัวข้อที่ 09",
        "H1_TITLE": "Montreal Convention & EU261<br><em>สิทธิผู้โดยสารที่ควรรู้</em>",
        "HERO_SUBTITLE": "ตัวเลขชดเชยกระเป๋าสูญหาย เที่ยวบินล่าช้า และ Overbooking — พร้อมขั้นตอนยื่นเรื่องจริง",
        "READ_TIME": "5",
        "CATEGORY": "Rights",
        "PREV_LINK": '<a href="/th/faq/08-online-checkin.html"><i class="fas fa-arrow-left"></i> 08 — Check-in</a>',
        "NEXT_LINK": '<a href="/th/faq/10-saf-future.html">10 — SAF <i class="fas fa-arrow-right"></i></a>',
        "FILE": "09-montreal-eu261.html",
        "current": 9,
    },
    {
        "SLUG": "10-saf-future",
        "PAGE_TITLE": "SAF และอนาคตการบินยั่งยืน 2026–2035",
        "META_DESC": "Sustainable Aviation Fuel คืออะไร ลด CO2 ได้จริงไหม และเทคโนโลยีการบินใหม่ที่จะเปลี่ยนอุตสาหกรรมภายใน 2035",
        "BREADCRUMB_TITLE": "SAF & การบินยั่งยืน",
        "BADGE_LABEL": "Tech · หัวข้อที่ 10",
        "H1_TITLE": "SAF & อนาคตการบินยั่งยืน<br><em>2026–2035</em>",
        "HERO_SUBTITLE": "Sustainable Aviation Fuel, เครื่องบินไฟฟ้า และ CORSIA — สิ่งที่กำลังเปลี่ยนอุตสาหกรรมการบินโลก",
        "READ_TIME": "4",
        "CATEGORY": "Tech",
        "PREV_LINK": '<a href="/th/faq/09-montreal-eu261.html"><i class="fas fa-arrow-left"></i> 09 — EU261</a>',
        "NEXT_LINK": '<a href="/th/faq/11-airport-security.html">11 — Security <i class="fas fa-arrow-right"></i></a>',
        "FILE": "10-saf-future.html",
        "current": 10,
    },
    {
        "SLUG": "11-airport-security",
        "PAGE_TITLE": "Airport Security 2026: CT Scanner และขั้นตอนใหม่ที่ต้องรู้",
        "META_DESC": "CT Scanner 3D คืออะไร ต่างจาก X-ray อย่างไร และของที่โดน Flag บ่อยที่สุดในปี 2026 — เตรียมตัวให้ถูกผ่านด่านเร็วขึ้น",
        "BREADCRUMB_TITLE": "Airport Security 2026",
        "BADGE_LABEL": "Must Know · หัวข้อที่ 11",
        "H1_TITLE": "Airport Security 2026<br><em>CT Scanner และขั้นตอนที่เปลี่ยนไป</em>",
        "HERO_SUBTITLE": "เทคโนโลยี Security ใหม่ สิ่งที่โดน Flag บ่อย และเคล็ดลับผ่านด่านเร็วขึ้น 10-15 นาที",
        "READ_TIME": "5",
        "CATEGORY": "Must Know",
        "PREV_LINK": '<a href="/th/faq/10-saf-future.html"><i class="fas fa-arrow-left"></i> 10 — SAF</a>',
        "NEXT_LINK": '<a href="/th/faq/12-travel-insurance.html">12 — ประกัน <i class="fas fa-arrow-right"></i></a>',
        "FILE": "11-airport-security.html",
        "current": 11,
    },
    {
        "SLUG": "12-travel-insurance",
        "PAGE_TITLE": "ประกันการเดินทาง 2026: ครอบคลุมอะไร และที่ไม่ครอบคลุม",
        "META_DESC": "ตารางความคุ้มครองจริง สิ่งที่ประกันไม่จ่าย Pre-existing Condition และ 5 สิ่งต้องเช็กก่อนซื้อ",
        "BREADCRUMB_TITLE": "ประกันการเดินทาง",
        "BADGE_LABEL": "Rights · หัวข้อที่ 12",
        "H1_TITLE": "ประกันการเดินทาง<br><em>จ่ายแล้วได้อะไรจริงๆ</em>",
        "HERO_SUBTITLE": "สิ่งที่ประกันคุ้มครองและไม่คุ้มครอง — รู้ก่อนซื้อ ไม่ต้องเสียใจทีหลัง",
        "READ_TIME": "5",
        "CATEGORY": "Rights",
        "PREV_LINK": '<a href="/th/faq/11-airport-security.html"><i class="fas fa-arrow-left"></i> 11 — Security</a>',
        "NEXT_LINK": '<a href="/th/faq/13-airport-lounge.html">13 — Lounge <i class="fas fa-arrow-right"></i></a>',
        "FILE": "12-travel-insurance.html",
        "current": 12,
    },
    {
        "SLUG": "13-airport-lounge",
        "PAGE_TITLE": "Airport Lounge Access 2026: เข้าได้โดยไม่ต้องบิน Business",
        "META_DESC": "5 วิธีเข้า Lounge, Priority Pass ราคาจริง, บัตรเครดิตที่รวมสิทธิ และ Lounge ที่ดีที่สุดในสุวรรณภูมิ",
        "BREADCRUMB_TITLE": "Airport Lounge Access",
        "BADGE_LABEL": "Tips · หัวข้อที่ 13",
        "H1_TITLE": "Airport Lounge Access<br><em>ไม่ต้องบิน Business ก็เข้าได้</em>",
        "HERO_SUBTITLE": "5 วิธีเข้า Lounge, Priority Pass, บัตรเครดิตที่รวมสิทธิ และข้อควรระวังที่ทำให้หลายคนพลาดเที่ยวบิน",
        "READ_TIME": "5",
        "CATEGORY": "Tips",
        "PREV_LINK": '<a href="/th/faq/12-travel-insurance.html"><i class="fas fa-arrow-left"></i> 12 — ประกัน</a>',
        "NEXT_LINK": '<a href="/th/faq/14-special-needs.html">14 — ผู้โดยสารพิเศษ <i class="fas fa-arrow-right"></i></a>',
        "FILE": "13-airport-lounge.html",
        "current": 13,
    },
    {
        "SLUG": "14-special-needs",
        "PAGE_TITLE": "ผู้โดยสารพิเศษและเด็ก: กฎสายการบิน 2026 ครบทุกกรณี",
        "META_DESC": "Unaccompanied Minor ค่าบริการจริง WCHR/WCHC รหัส IATA สัตว์เลี้ยงบนเครื่อง และเงื่อนไขการตั้งครรภ์",
        "BREADCRUMB_TITLE": "ผู้โดยสารพิเศษ & เด็ก",
        "BADGE_LABEL": "Rights · หัวข้อที่ 14",
        "H1_TITLE": "ผู้โดยสารพิเศษ & เด็ก<br><em>กฎและขั้นตอนจริงก่อนเดินทาง</em>",
        "HERO_SUBTITLE": "เด็กเดินทางคนเดียว Wheelchair สัตว์เลี้ยง และผู้ป่วย — แจ้งล่วงหน้าถูกต้อง เดินทางราบรื่น",
        "READ_TIME": "5",
        "CATEGORY": "Rights",
        "PREV_LINK": '<a href="/th/faq/13-airport-lounge.html"><i class="fas fa-arrow-left"></i> 13 — Lounge</a>',
        "NEXT_LINK": '<a href="/th/faq/15-booking-tips.html">15 — จองตั๋วถูก <i class="fas fa-arrow-right"></i></a>',
        "FILE": "14-special-needs.html",
        "current": 14,
    },
    {
        "SLUG": "15-booking-tips",
        "PAGE_TITLE": "จองตั๋วเครื่องบินราคาถูก 2026: วัน เวลา และเครื่องมือจริง",
        "META_DESC": "วันและช่วงเวลาที่ตั๋วถูกที่สุด 5 Myth ที่ต้องหยุดเชื่อ Fare Alert ที่ใช้งานได้ และ Checklist ก่อนกดจอง",
        "BREADCRUMB_TITLE": "เคล็ดลับจองตั๋วราคาถูก",
        "BADGE_LABEL": "Tips · หัวข้อที่ 15",
        "H1_TITLE": "เคล็ดลับจองตั๋วราคาถูก<br><em>สิ่งที่ได้ผลจริงในปี 2026</em>",
        "HERO_SUBTITLE": "ตารางวันราคาถูก 5 Myth ที่ต้องหยุดเชื่อ และเครื่องมือที่นักเดินทางบ่อยใช้จริง",
        "READ_TIME": "5",
        "CATEGORY": "Tips",
        "PREV_LINK": '<a href="/th/faq/14-special-needs.html"><i class="fas fa-arrow-left"></i> 14 — ผู้โดยสารพิเศษ</a>',
        "NEXT_LINK": "<span></span>",
        "FILE": "15-booking-tips.html",
        "current": 15,
    },
]

BTN_CTA_CSS = """
    .btn-cta{display:inline-flex;align-items:center;gap:8px;background:#0056B3;color:#fff;padding:12px 28px;border-radius:50px;font-weight:700;text-decoration:none;font-size:14px;margin-top:16px;transition:all .2s}
    .btn-cta:hover{background:#003d82;transform:translateY(-2px)}
"""


def extract_article_from_html(html: str) -> str:
    for pat in (
        r'<article class="article-body">([\s\S]*)</article>',
        r'<main class="container article-body">([\s\S]*)</main>',
    ):
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1).strip()
    return ""


def load_template() -> str:
    t = TEMPLATE.read_text(encoding="utf-8")
    if "</style>" not in t:
        return t
    return t.replace("  </style>", BTN_CTA_CSS + "\n  </style>", 1)


def substitute(template: str, mapping: dict) -> str:
    out = template
    cur = mapping.get("current", 0)
    for i in range(1, 16):
        key = f"C{i:02d}"
        ph = f"%%{key}%%"
        val = "current" if i == cur else ""
        out = out.replace(ph, val)
    for k, v in mapping.items():
        if k in ("FILE", "current"):
            continue
        out = out.replace(f"%%{k}%%", str(v))
    return out


def main():
    if not TEMPLATE.is_file():
        raise SystemExit(f"Missing template: {TEMPLATE}")
    base_tpl = load_template()

    raw_by_file = {}
    for p in PAGES:
        fp = FAQ / p["FILE"]
        if fp.is_file():
            raw_by_file[p["FILE"]] = fp.read_text(encoding="utf-8")

    md_note = ""
    if MD.is_file():
        md_note = MD.read_text(encoding="utf-8")
        # Future: parse md_note per slug; for now still use HTML extract if present

    for p in PAGES:
        fn = p["FILE"]
        raw = raw_by_file.get(fn, "")
        article = extract_article_from_html(raw)
        if not article:
            article = (
                '<div class="callout warn"><p>เนื้อหาฉบับเต็มสำหรับหน้านี้ยังไม่พร้อม — '
                "โปรดเพิ่ม `faq_content_all15.md` ตามคำแนะใน cursor-rebuild-prompt.md แล้วรันสคริปต์ใหม่</p></div>"
            )

        mapping = {k: v for k, v in p.items() if k != "FILE"}
        mapping["ARTICLE_CONTENT"] = article
        html = substitute(base_tpl, mapping)
        out_path = FAQ / fn
        out_path.write_text(html, encoding="utf-8")
        print("wrote", out_path.relative_to(ROOT))

    if not MD.is_file():
        print(
            "NOTE: faq_content_all15.md not found; article bodies copied from existing HTML where possible."
        )


if __name__ == "__main__":
    main()
