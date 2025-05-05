// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode', themeToggle.checked);
});

// 預設語言（抓取使用者預設系統！）
let currentLang  = 'en';  // 預設是英文

let userLang = navigator.language || navigator.userLanguage;

userLang = userLang.toLowerCase();
if (userLang.startsWith('zh')) {
  currentLang = 'zh';
}

const supportedLangs = ['en', 'zh'];
if (!supportedLangs.includes(currentLang)) {
  currentLang = 'en';
}

loadLanguage(currentLang);  // 初始載入語言

// Language Toggle
const langToggle = document.getElementById('lang-toggle');

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  langToggle.textContent = currentLang === 'en' ? '中文' : 'EN';
  loadLanguage(currentLang);
});

langToggle.textContent = currentLang === 'en' ? '中文' : 'EN';  // 初始調整toggle文字

async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);

    if (!response.ok) {
      throw new Error(`Could not load language file: ${lang}.json`);
    }

    const data = await response.json();
    updateTexts(data);
    
  } catch(error) {
    console.error('Language loadinf error', error);
  }
}

function updateTexts(data) {
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
  });
}