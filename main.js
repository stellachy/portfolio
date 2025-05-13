// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode', themeToggle.checked);
});

// 預設語言（抓取使用者預設系統！）
let currentLang = 'en';  // 預設是英文

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
    i18nData = data;  // 載入後儲存至此，方便後續其他函式使用
    updateTexts(data);

  } catch (error) {
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

// Skills輪播
let track = document.getElementById('carouselTrack');
let isPaused = false;

// 桌機版：hover 暫停、離開繼續
document.getElementById('carouselWrapper').addEventListener('mouseenter', () => {
  if (!isMobile()) {
    track.style.animationPlayState = 'paused';
  }
});
document.getElementById('carouselWrapper').addEventListener('mouseleave', () => {
  if (!isMobile() && !isPaused) {
    track.style.animationPlayState = 'running';
  }
});

// 手機版：點擊切換播放狀態
track.addEventListener('click', () => {
  if (isMobile()) {
    isPaused = !isPaused;
    track.style.animationPlayState = isPaused ? 'paused' : 'running';
  }
});

// 工具函式：判斷是否是手機寬度
function isMobile() {
  return window.innerWidth <= 768;
}

// 用js clone 第一組 tech-card
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const cards = track.querySelectorAll(".tech-card");

  // 記住第一組的卡片數
  const initialCount = cards.length;

  // 將第一組複製一遍，並加進去 track 內
  for (let i = 0; i < initialCount; i++) {
    const clone = cards[i].cloneNode(true);
    track.appendChild(clone);
  }
});

// Show (cuter) Toast
let i18nData = {};  // 儲存目前語言資料
const wrapper = document.getElementById("toastWrapper");
function showToast(messageKey, isSuccess = true) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  const toastTitle = document.getElementById("toastTitle");

  // 顯示toast
  wrapper.classList.remove("hidden");

  // 清除動畫 class (重新觸發用）
  toast.classList.remove("pop", "shake");
  void toast.offsetWidth; // 強制觸發 DOM 重繪(reflow)

  toast.style.borderColor = isSuccess ? "var(--accent-dark)" : "salmon";
  toast.classList.add(isSuccess ? "pop" : "shake");

  // 從i18nData資料中，拿取對應的值
  const titleKey = isSuccess ? "toast.successTitle" : "toast.errorTitle";
  toastMsg.textContent = getI18nText(messageKey);
  toastTitle.textContent = getI18nText(titleKey);

  // 自動關閉
  setTimeout(() => wrapper.classList.add("hidden"), 8000);
}
const toastClose = document.getElementById("toastClose");
toastClose.addEventListener("click", () => wrapper.classList.add("hidden"));

// 傳入key後，取得該key之值
function getI18nText(key) {
  const keys = key.split('.');
  let value = i18nData;
  keys.forEach(k => {
    value = value?.[k];
  });
  return value || key;  // 找不到就回傳 key
}

// Contact me (work w/ Email JS)
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // UI：顯示diasabled 按鈕
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;

  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span class="spinner"></span>${getI18nText('contact.submitting')}`;

  // collect data：
  const form = e.target;
  const formData = {
    name: form.user_name.value,
    email: form.user_mail.value,
    message: form.message.value
  };
  // console.log(formData);

  // 寄信
  // 1) 寄給客戶
  const sendToUser = emailjs.send("service_5vnn007", "template_o7pgx9o", formData);
  // 2) 寄給自己
  const sendToMe = emailjs.send("service_5vnn007", "template_3d5dmbr", formData);

  Promise.all([sendToUser, sendToMe])
    .then(() => {
      showToast("toast.successMsg", true);
      form.reset();
    })
    .catch((err) => {
      console.error("❌ Email 寄送失敗：", err);
      showToast("toast.errorMsg", false);
    })
    .finally(() => {  // 不管結果如何都會做以下（按鈕恢復、可再傳送表單）
      // UI：恢復按鈕狀態
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    });
});

// 🌀 Loader 消失效果
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  // 模擬進度條跑完後消失
  setTimeout(() => {
    loader.classList.add("fade-out");
  }, 2200); // 與動畫時長一致，稍微多一點更順
});


// ⬆️ Back to Top 功能
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.remove('hidden');
  } else {
    backToTopBtn.classList.add('hidden');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});