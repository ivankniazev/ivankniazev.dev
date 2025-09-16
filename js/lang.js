// Language switcher with JSON translations
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.bindEvents();
        this.updateLanguage(this.currentLanguage);
        this.updateActiveButton();
    }

    async loadTranslations() {
        try {
            // Load both language files
            const [enResponse, ruResponse] = await Promise.all([
                fetch('i18n/en.json'),
                fetch('i18n/ru.json')
            ]);

            this.translations.en = await enResponse.json();
            this.translations.ru = await ruResponse.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback to empty translations
            this.translations = { en: {}, ru: {} };
        }
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
        // Handle old data-en/data-ru attributes for backward compatibility
        const oldElements = document.querySelectorAll('[data-en][data-ru]');
        oldElements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const ruText = element.getAttribute('data-ru');

            if (language === 'ru' && ruText) {
                if (ruText.includes('<h2>')) {
                    element.innerHTML = ruText;
                } else {
                    element.textContent = ruText;
                }
            } else if (enText) {
                if (enText.includes('<h2>')) {
                    element.innerHTML = enText;
                } else {
                    element.textContent = enText;
                }
            }
        });

        // Handle new data-lang attributes with JSON translations
        const newElements = document.querySelectorAll('[data-lang]');
        newElements.forEach(element => {
            const key = element.getAttribute('data-lang');
            const translation = this.getTranslation(language, key);

            if (translation) {
                element.textContent = translation;
            }
        });

        // Update document language attribute
        document.documentElement.lang = language;
    }

    getTranslation(language, key) {
        if (!this.translations[language]) {
            return null;
        }

        // Split key by dots to navigate nested objects
        // e.g., 'terms.section1.title' becomes ['terms', 'section1', 'title']
        const keys = key.split('.');
        let translation = this.translations[language];

        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                return null;
            }
        }

        return typeof translation === 'string' ? translation : null;
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
document.addEventListener('DOMContentLoaded', async () => {
    const switcher = new LanguageSwitcher();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        new LanguageSwitcher();
    });
} else {
    new LanguageSwitcher();
}