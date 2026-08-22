import re
import ssl
import urllib.error
import urllib.request

ctx = ssl.create_default_context()
urls = [
    "https://www.flyreisen24.com/en/index.html",
    "https://www.flyreisen24.com/de/index.html",
    "https://www.flyreisen24.com/deals",
    "https://www.flyreisen24.com/deals",
    "https://www.flyreisen24.com/deals",
    "https://www.flyreisen24.com/deals",
    "https://www.flyreisen24.com/deals",
    "https://www.flyreisen24.com/landing_en.html",
    "https://www.flyreisen24.com/landing_de.html",
    "https://www.flyreisen24.com/th/faq_th.html",
    "https://www.flyreisen24.com/en/faq_en.html",
    "https://www.flyreisen24.com/de/faq_de.html",
    "https://www.flyreisen24.com/th/faq/passport-visa.html",
    "https://www.flyreisen24.com/th/faq/booking-types.html",
    "https://flyreisen24.com/",
    "https://flyreisen24.com/index.html",
    "https://www.flyreisen24.com/index.html",
]

for u in urls:
    req = urllib.request.Request(u, method="GET", headers={"User-Agent": "Googlebot"})
    try:
        r = urllib.request.urlopen(req, context=ctx, timeout=15)
        code = r.status
        final = r.geturl()
        body = r.read(800).decode("utf-8", "replace")
        m = re.search(r'rel="canonical" href="([^"]+)"', body)
        canon = m.group(1) if m else "-"
        redir = f" -> {final}" if final != u else ""
        print(f"{code} {u}{redir} | canon={canon}")
    except urllib.error.HTTPError as e:
        print(f"{e.code} {u} | loc={e.headers.get('Location', '')}")
    except Exception as e:
        print(f"ERR {u} | {e}")
