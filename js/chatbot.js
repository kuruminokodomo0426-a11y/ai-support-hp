// ========== Chatbot Modal ==========
const chatbotToggle   = document.getElementById('chatbotToggle');
const chatbotOverlay  = document.getElementById('chatbotOverlay');
const chatbotClose    = document.getElementById('chatbotClose');
const fullscreenBtn   = document.getElementById('chatbotFullscreen');

let isOpen       = false;
let isFullscreen = false;

function openModal() {
  isOpen = true;
  chatbotToggle.classList.add('open');
  chatbotOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  isOpen = false;
  chatbotToggle.classList.remove('open');
  chatbotOverlay.classList.remove('open');
  document.body.style.overflow = '';

  // 全画面も解除
  if (isFullscreen) {
    isFullscreen = false;
    chatbotOverlay.classList.remove('fullscreen');
    fullscreenBtn.querySelector('i').className = 'fas fa-expand';
    fullscreenBtn.setAttribute('aria-label', '全画面表示');
  }
}

function toggleModal() {
  isOpen ? closeModal() : openModal();
}

// ボタンクリックで開閉
chatbotToggle.addEventListener('click', toggleModal);
chatbotClose.addEventListener('click', closeModal);

// オーバーレイ（背景）クリックで閉じる
chatbotOverlay.addEventListener('click', (e) => {
  if (e.target === chatbotOverlay) closeModal();
});

// Escキーで閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) closeModal();
});

// ========== 全画面切り替え ==========
fullscreenBtn.addEventListener('click', () => {
  isFullscreen = !isFullscreen;
  chatbotOverlay.classList.toggle('fullscreen', isFullscreen);
  fullscreenBtn.querySelector('i').className = isFullscreen
    ? 'fas fa-compress'
    : 'fas fa-expand';
  fullscreenBtn.setAttribute('aria-label', isFullscreen ? '元のサイズに戻す' : '全画面表示');
});

// ========== 動画モーダル ==========
const videoBtn        = document.getElementById('chatbotVideoBtn');
const videoModal      = document.getElementById('videoModal');
const videoModalClose = document.getElementById('videoModalClose');

function openVideo() {
  videoModal.classList.add('open');
}

function closeVideo() {
  videoModal.classList.remove('open');
  const video = videoModal.querySelector('video');
  if (video) { video.pause(); video.currentTime = 0; }
}

videoBtn.addEventListener('click', openVideo);
videoModalClose.addEventListener('click', closeVideo);

// ========== 動画の全画面切り替え ==========
const videoFullscreenBtn = document.getElementById('videoFullscreenBtn');
let isVideoFullscreen = false;

videoFullscreenBtn.addEventListener('click', () => {
  isVideoFullscreen = !isVideoFullscreen;
  videoModal.classList.toggle('fullscreen', isVideoFullscreen);

  // アイコンとテキストを切り替え
  const icon = videoFullscreenBtn.querySelector('i');
  const label = videoFullscreenBtn.querySelector('span');
  icon.className  = isVideoFullscreen ? 'fas fa-compress' : 'fas fa-expand';
  label.textContent = isVideoFullscreen ? '元に戻す' : '全画面で見る';
});

