// ==========================================
// FlyReisen24 - Centralized Navigation & Language System
// ==========================================

(function() {
    'use strict';

    const BASE_URL = 'https://www.flyreisen24.com/';
    
    // ✅ PAGE_MAPPINGS — ครบทุกหน้าที่มีอยู่จริง
    const PAGE_MAPPINGS = {
        'index': {
            'th': '/',
            'en': '/',
            'de': '/'
        },
        'faq': {
            'th': '/th/faq_th.html',
            'en': '/en/faq_en.html',
            'de': '/de/faq_de.html'
        },
        'deals': {
            'th': '/th/deals_th.html',
            'en': '/en/deals_en.html',
            'de': '/de/deals_de.html'
        },
        'tools': {
            'th': '/th/tools_th.html',
            'en': '/en/tools_en.html',
            'de': '/de/tools_de.html'
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
    // DETECT CURRENT PAGE
    // ==========================================
    function getCurrentPageType() {
        const path = window.location.pathname;
        
        if (path === '/' || path === '/en/' || path === '/de/' || path.includes('index.html')) return 'index';
        if (path.includes('faq')) return 'faq';
        if (path.includes('deals')) return 'deals';
        if (path.includes('tools')) return 'tools';
        if (path.includes('about')) return 'about';
        if (path.includes('terms')) return 'terms';
        if (path.includes('privacy')) return 'privacy';
        if (path.includes('contact')) return 'contact';
        
        return 'index';
    }

    // ==========================================
    // TRANSLATIONS — ✅ อัปเดตให้ตรง HTML ปัจจุบัน
    // ==========================================
    const translations = {
        'th': {
            navFlight: 'เที่ยวบิน',
            navHotel: 'โรงแรม',
            navDeals: 'ดีล',
            navKnowledge: 'คลังความรู้',
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
            footerPrivacy: 'นโยบายความเป็นส่วนตัว'
        },
        'en': {
            navFlight: 'Flights',
            navHotel: 'Hotels',
            navDeals: 'Deals',
            navKnowledge: 'Knowledge Hub',
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
            footerPrivacy: 'Privacy Policy'
        },
        'de': {
            navFlight: 'Flüge',
            navHotel: 'Hotels',
            navDeals: 'Angebote',
            navKnowledge: 'Wissensdatenbank',
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
            footerPrivacy: 'Datenschutz'
        }
    };

    // ==========================================
    // UPDATE CONTENT
    // ==========================================
    function updateContent(lang) {
        const t = translations[lang];
        if (!t) return;
        
        Object.keys(t).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = t[key];
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
        if (navDealsLink) navDealsLink.href = PAGE_MAPPINGS['deals'][lang];

        const footerLinks = {
            'footerFaqLink':     'faq',
            'footerKnowledgeLink': 'faq',
            'footerAboutLink':   'about',
            'footerTermsLink':   'terms',
            'footerPrivacyLink': 'privacy',
            'footerDeals':       'deals',
            'footerTools':       'tools'
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

        // ✅ ถ้า mapping มีอยู่ → ไปหน้านั้น, ถ้าไม่มี → ไป homepage ของภาษานั้น
        if (PAGE_MAPPINGS[currentPage] && PAGE_MAPPINGS[currentPage][langCode]) {
            window.location.href = PAGE_MAPPINGS[currentPage][langCode];
        } else {
            const homepages = { 'th': '/', 'en': '/en/', 'de': '/de/' };
            window.location.href = homepages[langCode] || '/';
        }
    }

    // ==========================================
    // TOGGLE FUNCTIONS
    // ==========================================
    function toggleLangDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.classList.toggle('active');
    }

    function toggleMenu() {
        const menu = document.getElementById('topNavMenu');
        if (menu) menu.classList.toggle('active');
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
    // INITIALIZE
    // ==========================================
    function initialize() {
        const currentLang = localStorage.getItem('flyreisen24_lang') || 'th';
        const langLabels = { 'th': 'TH', 'en': 'EN', 'de': 'DE' };

        const currentLangEl = document.getElementById('currentLang');
        if (currentLangEl) currentLangEl.textContent = langLabels[currentLang];

        updateContent(currentLang);

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

        // Contact form
        const form = document.getElementById('contactForm');
        if (form) {
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

        // Close dropdowns on outside click
        document.addEventListener('click', function(event) {
            const nav = document.querySelector('.top-nav');
            const menu = document.getElementById('topNavMenu');
            const langDropdown = document.getElementById('languageDropdown');

            if (nav && menu && !nav.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
            if (langDropdown && !langDropdown.contains(event.target)) {
                langDropdown.classList.remove('active');
            }
        });

        console.log('✅ FlyReisen24 common.js initialized | page: ' + getCurrentPageType() + ' | lang: ' + currentLang);
    }

    // ==========================================
    // EXPOSE GLOBALS
    // ==========================================
    window.toggleLangDropdown = toggleLangDropdown;
    window.switchLanguage = switchLanguage;
    window.toggleMenu = toggleMenu;
    window.toggleContact = toggleContact;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
