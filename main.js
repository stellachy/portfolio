// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode', themeToggle.checked);
});

// Language Toggle
const langToggle = document.getElementById('lang-toggle');
let currentLang  = 'en';  // 預設是英文

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  langToggle.textContent = currentLang === 'en' ? '中文' : 'EN';
  loadLanguage(currentLang);
});

async function loadLanguage(lang) {
  const response = await fetch(`lang/${lang}.json`);
  const data = await response.json();

  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    const keys = key.split('.'); // 比如 "nav.about" => ["nav", "about"]

    let value = data;
    keys.forEach(k => {
      value = value?.[k];
    })
    
    if (value) {
      elem.textContent = value;
    }
  })
}

