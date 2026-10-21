const form = document.getElementById('wish-form');
const nameInput = document.getElementById('name');
const messageEl = document.getElementById('message');
const charCount = document.getElementById('char-count');
const sendBtn = document.getElementById('send-btn');
const formError = document.getElementById('form-error');
const success = document.getElementById('success');
const card = document.getElementById('card');

const avatarBtn = document.getElementById('avatar-btn');
const avatarInput = document.getElementById('avatar-input');
const avatarPreview = document.getElementById('avatar-preview');
const avatarPlaceholder = document.getElementById('avatar-placeholder');
const avatarClear = document.getElementById('avatar-clear');

let avatarDataUrl = null;

async function loadConfig() {
  const res = await fetch('/api/config');
  const cfg = await res.json();
  document.getElementById('bday-name').textContent = cfg.birthdayPerson;
  document.getElementById('success-bday').textContent = cfg.birthdayPerson;
}

messageEl.addEventListener('input', () => {
  charCount.textContent = String(messageEl.value.length);
});

avatarBtn.addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', async () => {
  const file = avatarInput.files && avatarInput.files[0];
  if (!file) return;
  try {
    avatarDataUrl = await fileToAvatar(file);
    avatarPreview.src = avatarDataUrl;
    avatarPreview.hidden = false;
    avatarPlaceholder.hidden = true;
    avatarClear.hidden = false;
  } catch {
    formError.textContent = '画像を読み込めませんでした。別の画像を選んでください。';
    formError.hidden = false;
  } finally {
    avatarInput.value = '';
  }
});

avatarClear.addEventListener('click', () => {
  avatarDataUrl = null;
  avatarPreview.hidden = true;
  avatarPlaceholder.hidden = false;
  avatarClear.hidden = true;
});

function fileToAvatar(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const SIZE = 176;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      const side = Math.min(img.width, img.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        img,
        (img.width - side) / 2, (img.height - side) / 2, side, side,
        0, 0, SIZE, SIZE
      );
      ctx.restore();
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('bad image'));
    };
    img.src = url;
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.hidden = true;
  sendBtn.disabled = true;
  sendBtn.textContent = '送信中…';

  try {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value,
        message: messageEl.value,
        avatar: avatarDataUrl,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'メッセージを送信できませんでした。もう一度お試しください。');
    }
    document.getElementById('success-name').textContent = nameInput.value;
    form.hidden = true;
    success.hidden = false;
    burstConfetti(card);
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = '送信する';
  }
});

function burstConfetti(anchor) {
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#FFB7C5', '#FFD6A5', '#CDB4DB', '#B8F2E6', '#FFF3B0', '#A0D2EB', '#FF6B6B'];
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece confetti-piece--burst';
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 160;
    piece.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    piece.style.setProperty('--ty', `${Math.sin(angle) * dist - 60}px`);
    piece.style.setProperty('--rot', `${(Math.random() * 540 - 270).toFixed(0)}deg`);
    piece.style.left = `${cx}px`;
    piece.style.top = `${cy}px`;
    piece.style.width = `${7 + Math.random() * 6}px`;
    piece.style.height = `${10 + Math.random() * 8}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${(Math.random() * 0.12).toFixed(2)}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1250);
  }
}

loadConfig();