// ==========================================
// FlyReisen24 - Centralized Navigation & Language System
// ==========================================

(function() {
    'use strict';

    const BASE_URL = 'https://www.flyreisen24.com/';
    const GLOBAL_NAV_STYLE_ID = 'flyreisen24-global-nav-styles';
    const GLOBAL_NAV_MARKUP = `
        <div class="top-nav-container">
            <a href="/" class="top-nav-logo">
                <img src="https://www.flyreisen24.com/fly_reisen24_logo_white.png" alt="FlyReisen24" width="auto" height="48" loading="eager">
            </a>
            <ul class="top-nav-menu" id="topNavMenu">
                <li>
                    <a href="#" class="dropdown-toggle" aria-expanded="false">
                        <i class="fas fa-briefcase"></i>
                        <span id="navServices">บริการ</span>
                        <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <a href="https://flights.flyreisen24.com">
                                <i class="fas fa-plane-departure"></i>
                                <span id="navFlight">เที่ยวบิน</span>
                            </a>
                        </li>
                        <li>
                            <a href="/smart-search.html">
                                <i class="fas fa-magic"></i>
                                Smart Search
                            </a>
                        </li>
                        <li>
                            <a href="/booking.html?url=https%3A%2F%2Ftrip.tpo.mx%2FbVJLx4bn">
                                <i class="fas fa-hotel"></i>
                                <span id="navHotel">โรงแรม</span>
                            </a>
                        </li>
                        <li>
                            <a href="/booking.html?url=https%3A%2F%2Fklook.tpo.mx%2FoOSUgcwd">
                                <i class="fas fa-car"></i>
                                <span id="navCarRental">รถเช่า</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="/smart-search.html" id="navDealsLink" class="top-nav-prominent-link">
                        <i class="fas fa-magic"></i>
                        <span id="navDeals">AI Search</span>
                        <span class="new-badge">NEW</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="dropdown-toggle" aria-expanded="false">
                        <i class="fas fa-book-open"></i>
                        <span id="navResources">คลังข้อมูล</span>
                        <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <a href="/th/faq/landing.html" id="navKnowledgeLink">
                                <i class="fas fa-book-open"></i>
                                <span id="navKnowledge">15 คำถามก่อนบิน</span>
                            </a>
                        </li>
                        <li>
                            <a href="/tools.html" id="navToolsLink">
                                <i class="fas fa-wrench"></i>
                                <span id="navTools">เครื่องมือ</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="nav-right">
                <a href="/contact.html" class="nav-help">
                    <i class="fas fa-headset"></i>
                    Help
                </a>
                <div class="language-dropdown" id="languageDropdown">
                    <button class="lang-current" onclick="toggleLangDropdown()">
                        <i class="fas fa-globe"></i>
                        <span id="currentLang">TH</span>
                        <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
                    </button>
                    <div class="lang-dropdown-menu">
                        <a href="/" class="active" onclick="switchLanguage('th', 'TH'); return false;">🇹🇭 ไทย (TH)</a>
                        <a href="/en/faq/landing.html" onclick="switchLanguage('en', 'EN'); return false;">🇬🇧 English (EN)</a>
                        <a href="/de/faq/landing.html" onclick="switchLanguage('de', 'DE'); return false;">🇩🇪 Deutsch (DE)</a>
                    </div>
                </div>
            </div>
            <button class="menu-toggle" onclick="toggleMenu()">☰</button>
        </div>
    `;
    
    // ✅ PAGE_MAPPINGS — ครบทุกหน้าที่มีอยู่จริง
    const PAGE_MAPPINGS = {
        'index': {
            'th': '/',
            'en': '/',
            'de': '/'
        },
        'faq': {
            'th': '/th/faq/landing.html',
            'en': '/en/faq/landing.html',
            'de': '/de/faq/landing.html'
        },
        'deals': {
            'th': '/deals.html',
            'en': '/deals.html',
            'de': '/deals.html'
        },
        'tools': {
            'th': '/tools.html',
            'en': '/tools.html',
            'de': '/tools.html'
        },
        'about': {
            'th': '/th/about_th.html',
            'en': '/en/about_en.html',
            'de': '/de/about_de.html'
        },
        'terms': {
            'th': '/th/terms_th.html',
            'en': '/en/terms_en.html',
            'de': '/de/terms_de.html'
        },
        'privacy': {
            'th': '/th/privacy_th.html',
            'en': '/en/privacy_en.html',
            'de': '/de/privacy_de.html'
        },
        'contact': {
            'th': '/contact.html',
            'en': '/contact.html',
            'de': '/contact.html'
        }
    };

    // ==========================================
    // LANGUAGE URL — map current page to equivalent in target lang
    // ==========================================
    function getLanguageUrl(langCode) {
        const path = window.location.pathname.replace(/\/$/, '') || '/';
        const search = window.location.search || '';
        const hash = window.location.hash || '';

        if (path === '/' || path === '/index.html') {
            if (langCode === 'th') return '/';
            if (langCode === 'en') return '/';
            if (langCode === 'de') return '/';
        }

        const faqArticle = path.match(/^\/(?:th|en|de)\/faq\/(\d{2}-[^/]+\.html)$/);
        if (faqArticle) {
            return '/' + langCode + '/faq/' + faqArticle[1] + search + hash;
        }

        if (/^\/(?:th|en|de)\/faq\/landing\.html$/.test(path)) {
            return '/' + langCode + '/faq/landing.html' + search + hash;
        }

        const pageType = getCurrentPageType();
        if (PAGE_MAPPINGS[pageType] && PAGE_MAPPINGS[pageType][langCode]) {
            return PAGE_MAPPINGS[pageType][langCode] + search + hash;
        }

        if (langCode === 'th') return '/';
        if (langCode === 'en') return '/en/faq/landing.html';
        return '/de/faq/landing.html';
    }

    function updateLanguageDropdownHrefs() {
        document.querySelectorAll('.lang-dropdown-menu a').forEach(function (link) {
            const onclick = link.getAttribute('onclick') || '';
            const match = onclick.match(/switchLanguage\('(\w+)'/);
            if (match) {
                link.href = getLanguageUrl(match[1]);
            }
        });
    }

    // ==========================================
    // DETECT CURRENT PAGE
    // ==========================================
    function getCurrentPageType() {
        const path = window.location.pathname;
        
        if (path === '/' || path === '/index.html') return 'index';
        if (path.includes('faq')) return 'faq';
        if (path.includes('deals')) return 'deals';
        if (path.includes('tools')) return 'tools';
        if (path.includes('about')) return 'about';
        if (path.includes('terms')) return 'terms';
        if (path.includes('privacy')) return 'privacy';
        if (path.includes('contact')) return 'contact';
        
        return 'index';
    }

    function ensureGlobalNavStyles() {
        if (document.getElementById(GLOBAL_NAV_STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = GLOBAL_NAV_STYLE_ID;
        style.textContent = [
            '.top-nav-menu > li{position:relative;}',
            '.dropdown-toggle{cursor:pointer;}',
            '.dropdown-toggle .fa-chevron-down{font-size:11px;margin-left:4px;transition:transform .2s ease;}',
            '.dropdown-active > .dropdown-toggle .fa-chevron-down{transform:rotate(180deg);}',
            '.dropdown-menu{display:none;position:absolute;top:100%;left:0;margin-top:10px;min-width:230px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:10px 0;list-style:none;z-index:9999;}',
            '.dropdown-menu.show{display:block;}',
            '.dropdown-menu li{padding:0;border:none;}',
            '.dropdown-menu a{padding:10px 16px;font-size:14px;width:100%;}',
            '.top-nav-prominent-link{color:#0056B3!important;font-weight:700!important;}',
            '.top-nav-prominent-link i{color:#0056B3!important;}',
            '.top-nav-prominent-link:hover{color:#003d82!important;}',
            '.top-nav-prominent-link:hover i{color:#003d82!important;}',
            '.dropdown-menu .new-badge{margin-left:auto;top:0;}',
            '@media (max-width:768px){.dropdown-menu{position:static;border:none;box-shadow:none;min-width:100%;padding:8px 0 0 14px;margin-top:0;}.dropdown-menu li{border-bottom:none;padding:.3rem 0;}.dropdown-menu a{padding:6px 0;}}'
        ].join('');
        document.head.appendChild(style);
    }

    function ensureGlobalNavbarMarkup() {
        if (window.location.pathname.includes('smart-search')) return;

        let nav = document.querySelector('nav.top-nav');
        if (!nav) {
            nav = document.createElement('nav');
            nav.className = 'top-nav';
            const mount = document.getElementById('site-nav-root');
            if (mount && mount.parentNode) {
                mount.replaceWith(nav);
            } else if (document.body) {
                document.body.insertBefore(nav, document.body.firstChild);
            } else {
                return;
            }
        }
        const menu = nav.querySelector('#topNavMenu');
        const hasCanonicalStructure = menu && menu.querySelector('.dropdown-toggle') && menu.querySelector('#navResources');
        if (!hasCanonicalStructure) {
            nav.innerHTML = GLOBAL_NAV_MARKUP;
        }
    }

    // ==========================================
    // TRANSLATIONS
    // ==========================================
    const translations = {
        'th': {
            navServices: 'บริการ',
            navResources: 'คลังข้อมูล',
            navFlight: 'เที่ยวบิน',
            navHotel: 'โรงแรม',
            navCarRental: 'รถเช่า',
            navDeals: 'ดีล',
            navKnowledge: '15 คำถามก่อนบิน',
            navFaq: 'คำถามที่พบบ่อย',
            navTools: 'เครื่องมือ',
            loadingText: 'กำลังโหลดแบบฟอร์มค้นหา...',
            sectionTitle: 'วางแผนการเดินทางของคุณ',
            sectionSubtitle: 'บริการครบวงจร สำหรับทริปในฝันของคุณ',
            cardFlightTitle: 'ตั๋วเครื่องบิน',
            cardFlightDesc: 'เปรียบเทียบราคาจากสายการบินทั่วโลก รับดีลที่ดีที่สุดสำหรับทริปถัดไปของคุณ',
            btnFlight: 'จองเที่ยวบิน',
            cardHotelTitle: 'โรงแรม & ที่พัก',
            cardHotelDesc: 'โรงแรม รีสอร์ท และที่พักคุณภาพกว่า 1.4 ล้านแห่ง ในราคาพิเศษเฉพาะคุณ',
            btnHotel: 'ดูที่พัก',
            cardDealsTitle: 'ดีลการเดินทาง',
            cardDealsDesc: 'เที่ยวบิน · โรงแรม · กิจกรรม · รถรับส่งสนามบิน · รถเช่า — ครบทุกบริการ เปรียบเทียบง่าย จองได้เลย',
            btnDeals: 'ดูดีลทั้งหมด',
            featuresTitle: 'ทำไมต้องเลือกเรา',
            feature1Title: 'เปรียบเทียบราคา',
            feature1Desc: 'ค้นหาและเปรียบเทียบราคาตั๋วเครื่องบินจากสายการบินชั้นนำทั่วโลก',
            feature2Title: 'ไม่มีค่าธรรมเนียมซ่อนเร้น',
            feature2Desc: 'โปร่งใสทุกขั้นตอน ราคาที่แสดงคือราคาจริงที่คุณต้องจ่าย',
            feature3Title: 'ความน่าเชื่อถือสูง',
            feature3Desc: 'ร่วมงานกับพันธมิตรที่เชื่อถือได้ การันตีความปลอดภัย',
            contactTitle: 'ติดต่อเรา',
            labelName: 'ชื่อ-นามสกุล *',
            labelEmail: 'อีเมล *',
            labelSubject: 'หัวข้อ',
            labelMessage: 'ข้อความ *',
            btnSubmit: 'ส่งข้อความ',
            footerDesc: 'แพลตฟอร์มค้นหาการเดินทางที่คุ้มค่าที่สุด รวบรวมดีลจากพาร์ทเนอร์ชั้นนำทั่วโลกมาไว้ในที่เดียว',
            footerServices: 'บริการของเรา',
            footerFlights: 'ค้นหาตั๋วเครื่องบิน',
            footerHotels: 'จองโรงแรมที่พัก',
            footerDeals: 'ดีลการเดินทาง',
            footerTools: 'เครื่องมือเดินทาง',
            footerHelp: 'ช่วยเหลือ',
            footerContact: 'ติดต่อฝ่ายบริการ',
            footerLegal: 'ข้อมูลทางกฎหมาย',
            footerAbout: 'เกี่ยวกับเรา',
            footerTerms: 'ข้อกำหนดและเงื่อนไข',
            footerPrivacy: 'นโยบายความเป็นส่วนตัว',
            heroBadge: '✈️ มุมมองจากฝั่งตรงข้าม counter เช็คอิน',
            heroTitle: 'จองเที่ยวบิน + โรงแรม + ดีล<br><span class="hero-highlight">ในที่เดียว</span>',
            heroSubtitle: 'เปรียบเทียบราคาจากสายการบิน โรงแรม และบริการรถเช่าชั้นนำทั่วโลก — ได้ดีลที่ดีที่สุด ไม่มีค่าธรรมเนียมซ่อน'
        },
        'en': {
            navServices: 'Services',
            navResources: 'Resources',
            navFlight: 'Flights',
            navHotel: 'Hotels',
            navCarRental: 'Car Rentals',
            navDeals: 'Deals',
            navKnowledge: '15 Pre-Flight Questions',
            navFaq: 'FAQ',
            navTools: 'Tools',
            loadingText: 'Loading search form...',
            sectionTitle: 'Plan Your Journey',
            sectionSubtitle: 'Complete services for your dream trip',
            cardFlightTitle: 'Flight Tickets',
            cardFlightDesc: 'Compare prices from airlines worldwide and get the best deals for your next trip',
            btnFlight: 'Book Flights',
            cardHotelTitle: 'Hotels & Accommodations',
            cardHotelDesc: 'Over 1.4 million quality hotels, resorts, and accommodations at special prices',
            btnHotel: 'View Hotels',
            cardDealsTitle: 'Travel Deals',
            cardDealsDesc: 'Flights · Hotels · Activities · Airport Transfers · Car Rentals — all in one place',
            btnDeals: 'View All Deals',
            featuresTitle: 'Why Choose Us',
            feature1Title: 'Compare Prices',
            feature1Desc: 'Search and compare flight prices from top airlines worldwide',
            feature2Title: 'No Hidden Fees',
            feature2Desc: 'Transparent every step — the price shown is the real price you pay',
            feature3Title: 'High Reliability',
            feature3Desc: 'Working with trusted partners guaranteeing your safety',
            contactTitle: 'Contact Us',
            labelName: 'Name *',
            labelEmail: 'Email *',
            labelSubject: 'Subject',
            labelMessage: 'Message *',
            btnSubmit: 'Send Message',
            footerDesc: 'The most valuable travel search platform, bringing together deals from world-class partners in one place',
            footerServices: 'Our Services',
            footerFlights: 'Search Flights',
            footerHotels: 'Book Hotels',
            footerDeals: 'Travel Deals',
            footerTools: 'Travel Tools',
            footerHelp: 'Help',
            footerContact: 'Contact Support',
            footerLegal: 'Legal',
            footerAbout: 'About Us',
            footerTerms: 'Terms & Conditions',
            footerPrivacy: 'Privacy Policy',
            heroBadge: '✈️ Ground staff perspective — from behind the check-in counter',
            heroTitle: 'Book Flights + Hotels + Deals<br><span class="hero-highlight">in One Place</span>',
            heroSubtitle: 'Compare prices from top airlines, hotels, and car rental services worldwide — best deals, no hidden fees'
        },
        'de': {
            navServices: 'Services',
            navResources: 'Ressourcen',
            navFlight: 'Flüge',
            navHotel: 'Hotels',
            navCarRental: 'Mietwagen',
            navDeals: 'Angebote',
            navKnowledge: '15 Fragen vor dem Flug',
            navFaq: 'FAQ',
            navTools: 'Tools',
            loadingText: 'Suchformular wird geladen...',
            sectionTitle: 'Planen Sie Ihre Reise',
            sectionSubtitle: 'Komplettservice für Ihre Traumreise',
            cardFlightTitle: 'Flugtickets',
            cardFlightDesc: 'Vergleichen Sie Preise von Airlines weltweit und erhalten Sie die besten Angebote',
            btnFlight: 'Flüge buchen',
            cardHotelTitle: 'Hotels & Unterkünfte',
            cardHotelDesc: 'Über 1,4 Millionen Hotels, Resorts und Unterkünfte zu Sonderpreisen',
            btnHotel: 'Hotels ansehen',
            cardDealsTitle: 'Reiseangebote',
            cardDealsDesc: 'Flüge · Hotels · Aktivitäten · Flughafentransfer · Mietwagen — alles an einem Ort',
            btnDeals: 'Alle Angebote',
            featuresTitle: 'Warum uns wählen',
            feature1Title: 'Preise vergleichen',
            feature1Desc: 'Suchen und vergleichen Sie Flugpreise von Top-Airlines weltweit',
            feature2Title: 'Keine versteckten Gebühren',
            feature2Desc: 'Transparent bei jedem Schritt — der angezeigte Preis ist der echte Preis',
            feature3Title: 'Hohe Zuverlässigkeit',
            feature3Desc: 'Mit vertrauenswürdigen Partnern, die Ihre Sicherheit garantieren',
            contactTitle: 'Kontakt',
            labelName: 'Name *',
            labelEmail: 'E-Mail *',
            labelSubject: 'Betreff',
            labelMessage: 'Nachricht *',
            btnSubmit: 'Nachricht senden',
            footerDesc: 'Die wertvollste Reisesuchplattform, die Angebote von Weltklasse-Partnern zusammenbringt',
            footerServices: 'Unsere Dienste',
            footerFlights: 'Flüge suchen',
            footerHotels: 'Hotels buchen',
            footerDeals: 'Reiseangebote',
            footerTools: 'Reise-Tools',
            footerHelp: 'Hilfe',
            footerContact: 'Support',
            footerLegal: 'Rechtliches',
            footerAbout: 'Über uns',
            footerTerms: 'AGB',
            footerPrivacy: 'Datenschutz',
            heroBadge: '✈️ Perspektive vom Check-in-Schalter — 10+ Jahre Bodenabfertigung',
            heroTitle: 'Flüge + Hotels + Angebote<br><span class="hero-highlight">an einem Ort</span>',
            heroSubtitle: 'Preise von Top-Airlines, Hotels und Mietwagen weltweit vergleichen — beste Deals, keine versteckten Gebühren'
        }
    };

    // ==========================================
    // UPDATE CONTENT
    // ==========================================
    function updateContent(lang) {
        const t = translations[lang];
        if (!t) return;
        
        const htmlKeys = ['heroTitle', 'heroSubtitle'];
        Object.keys(t).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = t[key];
                } else if (htmlKeys.includes(key)) {
                    element.innerHTML = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        updateNavigationLinks(lang);
    }

    // ==========================================
    // UPDATE NAVIGATION LINKS
    // ==========================================
    function updateNavigationLinks(lang) {
        const navKnowledgeLink = document.getElementById('navKnowledgeLink');
        if (navKnowledgeLink) navKnowledgeLink.href = PAGE_MAPPINGS['faq'][lang];

        const navDealsLink = document.getElementById('navDealsLink');
        if (navDealsLink) navDealsLink.href = '/smart-search.html';

        const navToolsLink = document.getElementById('navToolsLink');
        if (navToolsLink) navToolsLink.href = PAGE_MAPPINGS['tools'][lang];

        const footerLinks = {
            'footerFaqLink':       'faq',
            'footerKnowledgeLink': 'faq',
            'footerAboutLink':     'about',
            'footerTermsLink':     'terms',
            'footerPrivacyLink':   'privacy',
            'footerDeals':         'deals',
            'footerTools':         'tools'
        };

        Object.keys(footerLinks).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const pageType = footerLinks[id];
                if (PAGE_MAPPINGS[pageType] && PAGE_MAPPINGS[pageType][lang]) {
                    el.href = PAGE_MAPPINGS[pageType][lang];
                }
            }
        });

        console.log('✅ Links updated for: ' + lang);
    }

    // ==========================================
    // LANGUAGE SWITCHER
    // ==========================================
    function switchLanguage(langCode, label) {
        const isHomepage = window.location.pathname === '/'
            || window.location.pathname === '/index.html';

        if (isHomepage) {
            // Change language in place, don't navigate
            document.documentElement.lang = langCode;
            const currentLangEl = document.getElementById('currentLang');
            if (currentLangEl) currentLangEl.textContent = label;
            document.querySelectorAll('.lang-dropdown-menu a').forEach(a => {
                a.classList.remove('active');
            });
            document.querySelectorAll('.lang-dropdown-menu a').forEach(link => {
                if (link.getAttribute('onclick') && link.getAttribute('onclick').includes("'" + langCode + "'")) {
                    link.classList.add('active');
                }
            });
            localStorage.setItem('flyreisen24_lang', langCode);
            updateContent(langCode);
            updateFeedbackLang(langCode);
            toggleLangDropdown();
            return; // Stop here, don't navigate
        }

        // For other pages, continue with normal navigation below...
        const currentLangEl = document.getElementById('currentLang');
        if (currentLangEl) currentLangEl.textContent = label;

        document.querySelectorAll('.lang-dropdown-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes("'" + langCode + "'")) {
                link.classList.add('active');
            }
        });

        localStorage.setItem('flyreisen24_lang', langCode);

        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.classList.remove('active');

        const currentPage = getCurrentPageType();
        const targetUrl = getLanguageUrl(langCode);

        if (targetUrl) {
            window.location.href = targetUrl;
        } else if (PAGE_MAPPINGS[currentPage] && PAGE_MAPPINGS[currentPage][langCode]) {
            window.location.href = PAGE_MAPPINGS[currentPage][langCode];
        } else {
            window.location.href = langCode === 'th' ? '/' : (langCode === 'en' ? '/en/faq/landing.html' : '/de/faq/landing.html');
        }
    }

    // ==========================================
    // TOGGLE FUNCTIONS — Navigation
    // ==========================================
    function toggleLangDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.classList.toggle('active');
    }

    function toggleMenu() {
        const menu = document.getElementById('topNavMenu');
        if (menu) menu.classList.toggle('active');
    }

    function closeAllNavDropdowns() {
        document.querySelectorAll('nav.top-nav li.dropdown-active').forEach(item => {
            item.classList.remove('dropdown-active');
            const toggle = item.querySelector('.dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            let menu = null;
            for (let i = 0; i < item.children.length; i++) {
                const ch = item.children[i];
                if (ch.classList && ch.classList.contains('dropdown-menu')) {
                    menu = ch;
                    break;
                }
            }
            if (menu) menu.classList.remove('show');
        });
    }

    function toggleNavDropdown(event, trigger) {
        if (!trigger) return;
        if (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        const parentLi = trigger.closest('li');
        if (!parentLi) return;
        let submenu = null;
        for (let i = 0; i < parentLi.children.length; i++) {
            const ch = parentLi.children[i];
            if (ch.classList && ch.classList.contains('dropdown-menu')) {
                submenu = ch;
                break;
            }
        }
        if (!submenu) return;
        const isOpen = parentLi.classList.contains('dropdown-active');
        closeAllNavDropdowns();
        if (!isOpen) {
            const topNavMenu = document.getElementById('topNavMenu');
            if (topNavMenu && window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
                topNavMenu.classList.add('active');
            }
            parentLi.classList.add('dropdown-active');
            trigger.setAttribute('aria-expanded', 'true');
            submenu.classList.add('show');
        }
    }

    function bindGlobalNavUiOnce() {
        if (window.__flyreisen24NavUiBound) return;
        window.__flyreisen24NavUiBound = true;

        document.addEventListener('click', function(event) {
            const trigger = event.target.closest('.dropdown-toggle');
            if (!trigger) return;
            const nav = trigger.closest('nav.top-nav');
            const topMenu = document.getElementById('topNavMenu');
            if (!nav || !topMenu || !topMenu.contains(trigger)) return;
            toggleNavDropdown(event, trigger);
        }, true);

        document.addEventListener('click', function(event) {
            const nav = document.querySelector('nav.top-nav');
            const topMenu = document.getElementById('topNavMenu');
            const langDropdown = document.getElementById('languageDropdown');

            if (nav && topMenu && !nav.contains(event.target) && topMenu.classList.contains('active')) {
                topMenu.classList.remove('active');
            }
            if (langDropdown && !langDropdown.contains(event.target)) {
                langDropdown.classList.remove('active');
            }

            const insideOpenDropdown = event.target.closest('nav.top-nav li.dropdown-active');
            const onAnyDropdownToggle = event.target.closest('nav.top-nav .dropdown-toggle');
            if (!insideOpenDropdown && !onAnyDropdownToggle) {
                closeAllNavDropdowns();
            }
        }, false);
    }

    function toggleContact() {
        const popup = document.getElementById('contactPopup');
        if (popup) {
            popup.classList.toggle('active');
            if (popup.classList.contains('active')) {
                const nameField = document.getElementById('name');
                if (nameField) nameField.focus();
            }
        }
    }

    // ==========================================
    // TOGGLE FUNCTIONS — FAQ Page
    // ==========================================
    function toggleCategory(header) {
        const section = header.parentElement;
        section.classList.toggle('active');
    }

    function toggleFaq(button) {
        const item = button.parentElement;
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) { item.classList.add('active'); }
    }

    function toggleReadMore(btn) {
        const faqAnswerContent = btn.closest('.faq-answer-content');
        const fullContent = faqAnswerContent.querySelector('.article-full');
        const expandBtn = faqAnswerContent.querySelector('.expand-btn-wrap');
        const collapseBtn = faqAnswerContent.querySelector('.collapse-btn-wrap');
        const isHidden = fullContent.style.display === 'none' || fullContent.style.display === '';

        if (isHidden) {
            fullContent.style.display = 'block';
            if (expandBtn) expandBtn.style.display = 'none';
            if (collapseBtn) collapseBtn.style.display = 'block';
            setTimeout(() => fullContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        } else {
            fullContent.style.display = 'none';
            if (expandBtn) expandBtn.style.display = 'block';
            if (collapseBtn) collapseBtn.style.display = 'none';
        }
    }

    function injectFullFaqContentFromLegacy() {
        const legacyRoot = document.querySelector('.legacy-faq');
        if (!legacyRoot) return;

        const visibleItems = document.querySelectorAll('.faq-container > .category-section .faq-item');
        const legacyItems = legacyRoot.querySelectorAll('.faq-item');
        if (!visibleItems.length || !legacyItems.length) return;

        const lang = (document.documentElement.getAttribute('lang') || 'th').toLowerCase();
        const labels = {
            th: { more: 'อ่านต่อ', less: 'ย่อเนื้อหา' },
            en: { more: 'Read more', less: 'Show less' },
            de: { more: 'Mehr lesen', less: 'Weniger anzeigen' }
        };
        const ui = labels[lang] || labels.th;

        const maxCount = Math.min(visibleItems.length, legacyItems.length);
        for (let i = 0; i < maxCount; i++) {
            const visibleAnswer = visibleItems[i].querySelector('.faq-answer-content');
            const legacyAnswer = legacyItems[i].querySelector('.faq-answer-content');
            if (!visibleAnswer || !legacyAnswer) continue;
            if (visibleAnswer.querySelector('.article-full')) continue;

            const summaryHtml = visibleAnswer.innerHTML.trim();
            const fullHtml = legacyAnswer.innerHTML.trim();
            if (!fullHtml) continue;

            visibleAnswer.innerHTML =
                summaryHtml +
                '<div class="expand-btn-wrap" style="margin-top:14px;">' +
                '<button class="read-more-btn" type="button" onclick="toggleReadMore(this)">' + ui.more + '</button>' +
                '</div>' +
                '<div class="article-full" style="display:none;margin-top:14px;">' +
                fullHtml +
                '<div class="collapse-btn-wrap" style="display:none;margin-top:14px;">' +
                '<button class="read-more-btn" type="button" onclick="toggleReadMore(this)">' + ui.less + '</button>' +
                '</div>' +
                '</div>';
        }
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    function initialize() {
        if (window.__flyreisen24CommonInit) return;
        window.__flyreisen24CommonInit = true;

        if (window.location.pathname.includes('smart-search')) return;

        ensureGlobalNavbarMarkup();
        ensureGlobalNavStyles();
        bindGlobalNavUiOnce();

        const currentLang = localStorage.getItem('flyreisen24_lang') || 'th';
        const langLabels = { 'th': 'TH', 'en': 'EN', 'de': 'DE' };

        const currentLangEl = document.getElementById('currentLang');
        if (currentLangEl) currentLangEl.textContent = langLabels[currentLang];

        updateContent(currentLang);
        updateFeedbackLang(currentLang);
        updateLanguageDropdownHrefs();

        document.querySelectorAll('.lang-dropdown-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes("'" + currentLang + "'")) {
                link.classList.add('active');
            }
        });

        // Navbar scroll shrink
        const navbar = document.querySelector('.top-nav');
        const logo = document.querySelector('.top-nav-logo img');
        if (navbar) {
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > 50) {
                    navbar.style.padding = '8px 0';
                    if (logo) logo.style.height = '42px';
                } else {
                    navbar.style.padding = '10px 0';
                    if (logo) logo.style.height = '48px';
                }
            });
        }

        // Contact form — attach only once
        const form = document.getElementById('contactForm');
        if (form && !form.dataset.listenerAttached) {
            form.dataset.listenerAttached = 'true';
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const submitBtn = document.getElementById('submitBtn');
                const successMsg = document.getElementById('successMessage');
                const errorMsg = document.getElementById('errorMessage');

                if (submitBtn) submitBtn.disabled = true;
                if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...';
                if (successMsg) successMsg.classList.remove('show');
                if (errorMsg) errorMsg.classList.remove('show');

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: new FormData(form),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        if (successMsg) successMsg.classList.add('show');
                        form.reset();
                        setTimeout(() => {
                            toggleContact();
                            if (successMsg) successMsg.classList.remove('show');
                        }, 3000);
                    } else {
                        if (errorMsg) errorMsg.classList.add('show');
                    }
                } catch (error) {
                    if (errorMsg) errorMsg.classList.add('show');
                }

                if (submitBtn) submitBtn.disabled = false;
                const t = translations[currentLang];
                if (submitBtn && t) submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' + t.btnSubmit;
            });
        }

        console.log('✅ FlyReisen24 common.js initialized | page: ' + getCurrentPageType() + ' | lang: ' + currentLang);
    }

    // ==========================================
    // FEEDBACK WIDGET (Formspree)
    // ==========================================
    const FB_TRANSLATIONS = {
        th: {
            title: 'แจ้งปัญหา',
            type_label: 'ประเภทปัญหา',
            detail_label: 'รายละเอียด',
            detail_placeholder: 'อธิบายปัญหาที่พบ...',
            submit: 'ส่งรายงาน',
            success: '✅ ขอบคุณค่ะ! รับทราบแล้วจะรีบแก้ไข',
            select_default: '-- เลือก --',
            options: [
                { value: 'page_error', label: 'หน้าแสดงผลผิด' },
                { value: 'broken_link', label: 'ลิงก์เสีย' },
                { value: 'chatbot', label: 'แชทบอทไม่ตอบ' },
                { value: 'language', label: 'ภาษาไม่เปลี่ยน' },
                { value: 'other', label: 'อื่นๆ' }
            ],
            alert_error: 'เกิดข้อผิดพลาด กรุณาลองใหม่ค่ะ'
        },
        en: {
            title: 'Report Issue',
            type_label: 'Issue Type',
            detail_label: 'Details',
            detail_placeholder: 'Describe the problem you found...',
            submit: 'Send Report',
            success: '✅ Thank you! We will fix this soon.',
            select_default: '-- Select --',
            options: [
                { value: 'page_error', label: 'Page display error' },
                { value: 'broken_link', label: 'Broken link' },
                { value: 'chatbot', label: 'Chatbot not responding' },
                { value: 'language', label: 'Language not switching' },
                { value: 'other', label: 'Other' }
            ],
            alert_error: 'An error occurred. Please try again.'
        },
        de: {
            title: 'Problem melden',
            type_label: 'Problemtyp',
            detail_label: 'Details',
            detail_placeholder: 'Beschreiben Sie das Problem...',
            submit: 'Senden',
            success: '✅ Danke! Wir kümmern uns darum.',
            select_default: '-- Auswählen --',
            options: [
                { value: 'page_error', label: 'Seite falsch' },
                { value: 'broken_link', label: 'Link defekt' },
                { value: 'chatbot', label: 'Chatbot antwortet nicht' },
                { value: 'language', label: 'Sprache wechselt nicht' },
                { value: 'other', label: 'Sonstiges' }
            ],
            alert_error: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.'
        }
    };

    function ensureFeedbackStyles() {
        if (document.getElementById('flyreisen-feedback-styles')) return;
        const fbStyle = document.createElement('style');
        fbStyle.id = 'flyreisen-feedback-styles';
        fbStyle.textContent = `
#feedbackWidget {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9998;
}
#feedbackTab {
  background: #0056B3;
  color: white;
  border: none;
  padding: 12px 10px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-size: 18px;
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  box-shadow: -2px 0 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 6px;
}
#feedbackPanel {
  position: absolute;
  right: 44px;
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
#feedbackHeader {
  background: #0056B3;
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
}
#feedbackHeader button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}
#feedbackForm {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fb-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fb-field label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}
.fb-field select,
.fb-field textarea {
  padding: 8px 10px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
}
.fb-field select:focus,
.fb-field textarea:focus {
  outline: none;
  border-color: #0056B3;
}
#fb-submit {
  background: #0056B3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}
#feedbackSuccess {
  padding: 24px 16px;
  text-align: center;
  font-size: 14px;
  color: #16a34a;
}`;
        document.head.appendChild(fbStyle);
    }

    function updateFeedbackLang(langCode) {
        const fbt = FB_TRANSLATIONS[langCode] || FB_TRANSLATIONS.th;
        const fbTitle = document.getElementById('fb-title');
        if (fbTitle) fbTitle.textContent = fbt.title;
        const fbTypeLabel = document.getElementById('fb-type-label');
        if (fbTypeLabel) fbTypeLabel.textContent = fbt.type_label;
        const fbDetailLabel = document.getElementById('fb-detail-label');
        if (fbDetailLabel) fbDetailLabel.textContent = fbt.detail_label;
        const fbSubmit = document.getElementById('fb-submit');
        if (fbSubmit) fbSubmit.textContent = fbt.submit;
        const fbSuccess = document.querySelector('#feedbackSuccess p');
        if (fbSuccess) fbSuccess.textContent = fbt.success;
        const fbTextarea = document.querySelector('#feedbackForm textarea[name="message"]');
        if (fbTextarea) fbTextarea.placeholder = fbt.detail_placeholder;
        const fbSelect = document.querySelector('#feedbackForm select[name="problem_type"]');
        if (fbSelect) {
            const current = fbSelect.value;
            fbSelect.innerHTML = '';
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = fbt.select_default;
            fbSelect.appendChild(defaultOpt);
            fbt.options.forEach(function(opt) {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                fbSelect.appendChild(option);
            });
            if (current) fbSelect.value = current;
        }
        const langInput = document.querySelector('#feedbackForm input[name="user_lang"]');
        if (langInput) langInput.value = langCode;
    }

    function initFeedbackWidget() {
        if (document.getElementById('feedbackWidget')) return;
        ensureFeedbackStyles();

        const widget = document.createElement('div');
        widget.id = 'feedbackWidget';
        widget.innerHTML = `
    <button id="feedbackTab" type="button" onclick="toggleFeedback()">
      💬
    </button>
    <div id="feedbackPanel" style="display:none">
      <div id="feedbackHeader">
        <span id="fb-title">แจ้งปัญหา</span>
        <button type="button" onclick="toggleFeedback()">✕</button>
      </div>
      <form id="feedbackForm"
            action="https://formspree.io/f/xreggjzv"
            method="POST">
        <div class="fb-field">
          <label id="fb-type-label">ประเภทปัญหา</label>
          <select name="problem_type" required>
            <option value="">-- เลือก --</option>
            <option value="page_error">หน้าแสดงผลผิด</option>
            <option value="broken_link">ลิงก์เสีย</option>
            <option value="chatbot">แชทบอทไม่ตอบ</option>
            <option value="language">ภาษาไม่เปลี่ยน</option>
            <option value="other">อื่นๆ</option>
          </select>
        </div>
        <div class="fb-field">
          <label id="fb-detail-label">รายละเอียด</label>
          <textarea name="message" rows="3"
                    placeholder="อธิบายปัญหาที่พบ..."
                    required></textarea>
        </div>
        <input type="hidden" name="page_url"
               value="${window.location.href}">
        <input type="hidden" name="user_lang"
               value="${document.documentElement.lang || 'th'}">
        <button type="submit" id="fb-submit">ส่งรายงาน</button>
      </form>
      <div id="feedbackSuccess" style="display:none">
        <p>✅ ขอบคุณค่ะ! รับทราบแล้วจะรีบแก้ไข</p>
      </div>
    </div>`;
        document.body.appendChild(widget);

        const currentLang = localStorage.getItem('flyreisen24_lang') || document.documentElement.lang || 'th';
        updateFeedbackLang(currentLang);

        document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = this;
            const data = new FormData(form);
            const langCode = localStorage.getItem('flyreisen24_lang') || document.documentElement.lang || 'th';
            const fbt = FB_TRANSLATIONS[langCode] || FB_TRANSLATIONS.th;
            try {
                const response = await fetch('https://formspree.io/f/xreggjzv', {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('submit failed');
                form.style.display = 'none';
                document.getElementById('feedbackSuccess').style.display = 'block';
                setTimeout(function() {
                    toggleFeedback();
                    form.style.display = 'flex';
                    form.reset();
                    document.getElementById('feedbackSuccess').style.display = 'none';
                    const urlInput = form.querySelector('input[name="page_url"]');
                    if (urlInput) urlInput.value = window.location.href;
                }, 2000);
            } catch (err) {
                alert(fbt.alert_error);
            }
        });
    }

    function toggleFeedback() {
        const panel = document.getElementById('feedbackPanel');
        if (!panel) return;
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    // ==========================================
    // EXPOSE GLOBALS
    // ==========================================
    window.toggleLangDropdown = toggleLangDropdown;
    window.switchLanguage = switchLanguage;
    window.toggleMenu = toggleMenu;
    window.toggleNavDropdown = toggleNavDropdown;
    window.toggleContact = toggleContact;
    window.toggleCategory = toggleCategory;
    window.toggleFaq = toggleFaq;
    window.toggleReadMore = toggleReadMore;
    window.toggleFeedback = toggleFeedback;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFeedbackWidget);
    } else {
        initFeedbackWidget();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
