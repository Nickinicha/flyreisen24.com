// ==========================================
// FlyReisen24 - Centralized Navigation & Language System
// ใช้ไฟล์นี้ในทุกหน้า HTML เพื่อแก้ปัญหา 404
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const BASE_URL = 'https://www.flyreisen24.com/';
    
    // Page mappings - กำหนดว่าแต่ละหน้ามีชื่ออะไรในแต่ละภาษา
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
        
        if (path === '/' || path.includes('index.html')) return 'index';
        if (path.includes('faq')) return 'faq';
        if (path.includes('about')) return 'about';
        if (path.includes('terms')) return 'terms';
        if (path.includes('privacy')) return 'privacy';
        if (path.includes('contact')) return 'contact';
        
        return 'index';
    }

    // ==========================================
    // TRANSLATIONS
    // ==========================================
    const translations = {
        'th': {
            heroTitle: 'แพลตฟอร์มเดินทางสำหรับทุกไลฟ์สไตล์',
            heroSubtitle: 'ค้นหาเที่ยวบินราคาถูกจากสายการบินชั้นนำทั่วโลก',
            navFlight: 'เที่ยวบิน',
            navHotel: 'โรงแรม',
            navCar: 'รถเช่า',
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
            cardCarTitle: 'รถเช่า & กิจกรรม',
            cardCarDesc: 'บริการรถเช่า ตั๋วรถไฟในยุโรป และกิจกรรมท่องเที่ยวทั่วโลก ครบในที่เดียว',
            btnCar: 'สำรวจกิจกรรม',
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
            footerCars: 'รถเช่าและกิจกรรม',
            footerKnowledge: 'คลังความรู้การเดินทาง',
            footerHelp: 'ช่วยเหลือ',
            footerContact: 'ติดต่อฝ่ายบริการ',
            footerFaq: 'คำถามที่พบบ่อย',
            footerLegal: 'ข้อมูลทางกฎหมาย',
            footerAbout: 'เกี่ยวกับเรา',
            footerTerms: 'ข้อกำหนดและเงื่อนไข',
            footerPrivacy: 'นโยบายความเป็นส่วนตัว'
        },
        'en': {
            heroTitle: 'Travel Platform for Every Lifestyle',
            heroSubtitle: 'Find cheap flights from top airlines worldwide',
            navFlight: 'Flight',
            navHotel: 'Hotel',
            navCar: 'Car',
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
            cardCarTitle: 'Car Rentals & Activities',
            cardCarDesc: 'Car rentals, European rail tickets, and tourist activities worldwide in one place',
            btnCar: 'Explore Activities',
            featuresTitle: 'Why Choose Us',
            feature1Title: 'Compare Prices',
            feature1Desc: 'Search and compare flight ticket prices from top airlines worldwide',
            feature2Title: 'No Hidden Fees',
            feature2Desc: 'Transparent every step - the price shown is the real price you pay',
            feature3Title: 'High Reliability',
            feature3Desc: 'Work with trusted partners guaranteeing your safety',
            contactTitle: 'Contact Us',
            labelName: 'Name *',
            labelEmail: 'Email *',
            labelSubject: 'Subject',
            labelMessage: 'Message *',
            btnSubmit: 'Send Message',
            footerDesc: 'The most valuable travel search platform bringing together deals from world-class partners in one place',
            footerServices: 'Our Services',
            footerFlights: 'Search Flight Tickets',
            footerHotels: 'Book Hotels',
            footerCars: 'Car Rentals & Activities',
            footerKnowledge: 'Travel Knowledge Hub',
            footerHelp: 'Help',
            footerContact: 'Contact Support',
            footerFaq: 'FAQ',
            footerLegal: 'Legal Information',
            footerAbout: 'About Us',
            footerTerms: 'Terms & Conditions',
            footerPrivacy: 'Privacy Policy'
        },
        'de': {
            heroTitle: 'Reiseplattform für jeden Lebensstil',
            heroSubtitle: 'Finden Sie günstige Flüge von Top-Airlines weltweit',
            navFlight: 'Flug',
            navHotel: 'Hotel',
            navCar: 'Auto',
            navKnowledge: 'Wissenszentrum',
            loadingText: 'Suchformular wird geladen...',
            sectionTitle: 'Planen Sie Ihre Reise',
            sectionSubtitle: 'Komplettservice für Ihre Traumreise',
            cardFlightTitle: 'Flugtickets',
            cardFlightDesc: 'Vergleichen Sie Preise von Airlines weltweit und erhalten Sie die besten Angebote für Ihre nächste Reise',
            btnFlight: 'Flüge buchen',
            cardHotelTitle: 'Hotels & Unterkünfte',
            cardHotelDesc: 'Über 1,4 Millionen hochwertige Hotels, Resorts und Unterkünfte zu Sonderpreisen',
            btnHotel: 'Hotels ansehen',
            cardCarTitle: 'Mietwagen & Aktivitäten',
            cardCarDesc: 'Mietwagen, Europäische Bahntickets und Touristenaktivitäten weltweit an einem Ort',
            btnCar: 'Aktivitäten erkunden',
            featuresTitle: 'Warum uns wählen',
            feature1Title: 'Preise vergleichen',
            feature1Desc: 'Suchen und vergleichen Sie Flugticketpreise von Top-Airlines weltweit',
            feature2Title: 'Keine versteckten Gebühren',
            feature2Desc: 'Transparent bei jedem Schritt - der angezeigte Preis ist der echte Preis, den Sie zahlen',
            feature3Title: 'Hohe Zuverlässigkeit',
            feature3Desc: 'Arbeiten Sie mit vertrauenswürdigen Partnern, die Ihre Sicherheit garantieren',
            contactTitle: 'Kontaktieren Sie uns',
            labelName: 'Name *',
            labelEmail: 'E-Mail *',
            labelSubject: 'Betreff',
            labelMessage: 'Nachricht *',
            btnSubmit: 'Nachricht senden',
            footerDesc: 'Die wertvollste Reisesuchplattform, die Angebote von Weltklasse-Partnern an einem Ort zusammenbringt',
            footerServices: 'Unsere Dienstleistungen',
            footerFlights: 'Flugtickets suchen',
            footerHotels: 'Hotels buchen',
            footerCars: 'Mietwagen & Aktivitäten',
            footerKnowledge: 'Reise-Wissensdatenbank',
            footerHelp: 'Hilfe',
            footerContact: 'Support kontaktieren',
            footerFaq: 'Häufig gestellte Fragen',
            footerLegal: 'Rechtliche Informationen',
            footerAbout: 'Über uns',
            footerTerms: 'Allgemeine Geschäftsbedingungen',
            footerPrivacy: 'Datenschutzrichtlinie'
        }
    };

    // ==========================================
    // UPDATE CONTENT (TEXT + LINKS)
    // ==========================================
    function updateContent(lang) {
        const t = translations[lang];
        if (!t) return;
        
        // Update text content
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
        
        // Update ALL navigation links with absolute paths
        updateNavigationLinks(lang);
    }

    // ==========================================
    // UPDATE NAVIGATION LINKS
    // ==========================================
    function updateNavigationLinks(lang) {
        // Navigation Menu Links
        const navKnowledgeLink = document.getElementById('navKnowledgeLink');
        if (navKnowledgeLink) {
            navKnowledgeLink.href = PAGE_MAPPINGS['faq'][lang];
        }

        // Footer Links
        const footerLinks = {
            'footerKnowledgeLink': 'faq',
            'footerFaqLink': 'faq',
            'footerAboutLink': 'about',
            'footerTermsLink': 'terms',
            'footerPrivacyLink': 'privacy',
            'footerContact': 'contact'
        };

        Object.keys(footerLinks).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const pageType = footerLinks[id];
                if (PAGE_MAPPINGS[pageType] && PAGE_MAPPINGS[pageType][lang]) {
                    element.href = PAGE_MAPPINGS[pageType][lang];
                }
            }
        });

        console.log(`✅ All links updated for language: ${lang}`);
    }

    // ==========================================
    // LANGUAGE SWITCHER
    // ==========================================
    function switchLanguage(langCode, label) {
        // Update display
        const currentLangEl = document.getElementById('currentLang');
        if (currentLangEl) {
            currentLangEl.textContent = label;
        }

        // Update active state
        document.querySelectorAll('.lang-dropdown-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${langCode}'`)) {
                link.classList.add('active');
            }
        });

        // Save to localStorage
        localStorage.setItem('flyreisen24_lang', langCode);

        // Close dropdown
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }

        // Get current page type
        const currentPage = getCurrentPageType();

        // Navigate to same page in new language
        if (PAGE_MAPPINGS[currentPage] && PAGE_MAPPINGS[currentPage][langCode]) {
            window.location.href = PAGE_MAPPINGS[currentPage][langCode];
        } else {
            // Fallback to homepage
            window.location.href = '/';
        }

        console.log(`✅ Language switched to: ${label} (${langCode})`);
    }

    // ==========================================
    // TOGGLE FUNCTIONS
    // ==========================================
    function toggleLangDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    function toggleMenu() {
        const menu = document.getElementById('topNavMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
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
    // INITIALIZE ON PAGE LOAD
    // ==========================================
    function initialize() {
        // Get saved language or default to Thai
        const currentLang = localStorage.getItem('flyreisen24_lang') || 'th';
        const langLabels = { 'th': 'TH', 'en': 'EN', 'de': 'DE' };

        // Update language display
        const currentLangEl = document.getElementById('currentLang');
        if (currentLangEl) {
            currentLangEl.textContent = langLabels[currentLang];
        }

        // Update content
        updateContent(currentLang);

        // Set active language in dropdown
        document.querySelectorAll('.lang-dropdown-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${currentLang}'`)) {
                link.classList.add('active');
            }
        });

        // Navbar scroll effect
        let lastScrollTop = 0;
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
                lastScrollTop = scrollTop;
            });
        }

        // Contact form handling
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
                const btnText = translations[currentLang].btnSubmit;
                if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${btnText}`;
            });
        }

        // Close dropdowns when clicking outside
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

        console.log('✅ FlyReisen24 - Common.js initialized');
        console.log(`Current page: ${getCurrentPageType()}, Language: ${currentLang}`);
    }

    // ==========================================
    // EXPOSE FUNCTIONS GLOBALLY
    // ==========================================
    window.toggleLangDropdown = toggleLangDropdown;
    window.switchLanguage = switchLanguage;
    window.toggleMenu = toggleMenu;
    window.toggleContact = toggleContact;

    // ==========================================
    // AUTO-INITIALIZE
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();