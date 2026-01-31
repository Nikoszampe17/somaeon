// Κουμπί στο host page Translation functionality
document.addEventListener('DOMContentLoaded', () => {
  const langOptions = document.querySelectorAll(".lang-option");
  const currentPath = window.location.pathname;
  
  // Only run on host.html page (or pages that need translation)
  if (!currentPath.includes('host.html')) return;

  // Load translation based on selected language
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`../assets/lang/${lang}.json`);
      const translations = await response.json();
      applyTranslations(translations);
      localStorage.setItem("somaeon-lang", lang);
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  // Apply translations to the page
  function applyTranslations(translations) {
    // Translate elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        element.placeholder = translations[key];
      }
    });
  }

  // Set up language switch functionality
  langOptions.forEach(option => {
    option.addEventListener("click", () => {
      const lang = option.textContent.trim().toLowerCase();
      
      langOptions.forEach(o => o.classList.remove("active"));
      option.classList.add("active");
      
      loadTranslations(lang);
    });
  });

  // Check for saved language preference or default
  const savedLang = localStorage.getItem("somaeon-lang");
  const initialLang = savedLang || 'en';
  
  // Update active class on language buttons
  document.querySelectorAll(".lang-option").forEach(el => {
    if (el.textContent.trim().toLowerCase() === initialLang) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  // Load initial translations
  loadTranslations(initialLang);
});

