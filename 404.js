(function () {
  let currentLang = 'en';

  let userLang = navigator.language || navigator.userLanguage;
  userLang = userLang.toLowerCase();
  if (userLang.startsWith('zh')) {
    currentLang = 'zh';
  }

  const supportedLangs = ['en', 'zh'];
  if (!supportedLangs.includes(currentLang)) {
    currentLang = 'en';
  }

  loadLanguage(currentLang);

  async function loadLanguage(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      const data = await response.json();
      updateTexts(data);

      if (lang === 'zh') {
        document.body.classList.add("lang-zh");
      } else {
        document.body.classList.remove("lang-zh");
      }

    } catch (error) {
      console.error('404 language load error:', error);
    }
  }

  function updateTexts(data) {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = data;
      keys.forEach(k => {
        value = value?.[k];
      });
      if (value) elem.textContent = value;
    });
  }
})();