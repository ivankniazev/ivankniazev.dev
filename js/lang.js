// Language switcher functionality
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateLanguage(this.currentLanguage);
        this.updateActiveButton();
    }

    bindEvents() {
        const enBtn = document.getElementById('lang-en');
        const ruBtn = document.getElementById('lang-ru');

        if (enBtn) {
            enBtn.addEventListener('click', () => this.switchLanguage('en'));
        }
        if (ruBtn) {
            ruBtn.addEventListener('click', () => this.switchLanguage('ru'));
        }
    }

    switchLanguage(language) {
        this.currentLanguage = language;
        this.updateLanguage(language);
        this.updateActiveButton();
        this.storeLanguage(language);
    }

    updateLanguage(language) {
        const elements = document.querySelectorAll('[data-en][data-ru]');

        elements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const ruText = element.getAttribute('data-ru');

            if (language === 'ru' && ruText) {
                // Handle HTML content for legal pages
                if (ruText.includes('<h2>')) {
                    element.innerHTML = ruText;
                } else {
                    element.textContent = ruText;
                }
            } else if (enText) {
                // Handle HTML content for legal pages
                if (enText.includes('<h2>')) {
                    element.innerHTML = enText;
                } else {
                    element.textContent = enText;
                }
            }
        });

        // Update document language attribute
        document.documentElement.lang = language;
    }

    updateActiveButton() {
        const enBtn = document.getElementById('lang-en');
        const ruBtn = document.getElementById('lang-ru');

        if (enBtn && ruBtn) {
            enBtn.classList.toggle('active', this.currentLanguage === 'en');
            ruBtn.classList.toggle('active', this.currentLanguage === 'ru');
        }
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('language');
        } catch (e) {
            return null;
        }
    }

    storeLanguage(language) {
        try {
            localStorage.setItem('language', language);
        } catch (e) {
            // LocalStorage not available, continue without storing
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LanguageSwitcher();
    });
} else {
    new LanguageSwitcher();
}