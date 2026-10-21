const BUBBLE_COLORS = ['#FFB7C5', '#FFD6A5', '#CDB4DB', '#B8F2E6', '#FFF3B0', '#A0D2EB'];

const wall = document.getElementById('bubble-wall');
const countEl = document.getElementById('wish-count');
const confettiLayer = document.getElementById('confetti');

function colorFor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return BUBBLE_COLORS[hash % BUBBLE_COLORS.length];
}

function renderWishes(wishes) {
  wall.innerHTML = '';
  if (!wishes.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML =
      'まだメッセージがありません。<br>リンクを共有して、友達からお祝いをもらいましょう！';
    wall.appendChild(empty);
    return;
  }

  wishes.forEach((wish, i) => {
    const bubble = document.createElement('article');
    bubble.className = 'bubble';
    bubble.style.setProperty('--bubble-color', colorFor(wish.name));
    bubble.style.setProperty('--delay', `${(i * 0.14).toFixed(2)}s`);

    const tilt = (Math.random() * 14 - 7).toFixed(1);
    const scale = (0.92 + Math.random() * 0.18).toFixed(2);
    const offset = Math.floor(Math.random() * 56);
    const r = () => (40 + Math.random() * 26).toFixed(0);
    bubble.style.transform = `rotate(${tilt}deg) scale(${scale})`;
    bubble.style.marginTop = `${offset}px`;
    bubble.style.borderRadius = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

    const inner = document.createElement('div');
    inner.className = 'bubble-inner';

    const sender = document.createElement('div');
    sender.className = 'bubble-sender';

    const avatar = document.createElement('span');
    avatar.className = 'bubble-avatar';
    if (wish.avatar) {
      const img = document.createElement('img');
      img.className = 'bubble-avatar-img';
      img.src = wish.avatar;
      img.alt = '';
      avatar.appendChild(img);
    } else {
      avatar.textContent = wish.name.charAt(0).toUpperCase();
    }

    const name = document.createElement('span');
    name.className = 'bubble-name';
    name.textContent = wish.name;

    const msg = document.createElement('p');
    msg.className = 'bubble-message';
    msg.textContent = wish.message;

    sender.append(avatar, name);
    inner.append(sender, msg);
    bubble.appendChild(inner);
    wall.appendChild(bubble);
  });
}

function spawnConfetti() {
  const colors = [...BUBBLE_COLORS, '#FF6B6B', '#FFFFFF'];
  const count = 46;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.width = `${6 + Math.random() * 7}px`;
    piece.style.height = `${9 + Math.random() * 9}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = `${5 + Math.random() * 7}s`;
    piece.style.animationDelay = `${(Math.random() * 8).toFixed(2)}s`;
    confettiLayer.appendChild(piece);
  }
}

async function init() {
  spawnConfetti();

  try {
    const [cfgRes, wishesRes] = await Promise.all([
      fetch('/api/config'),
      fetch('/api/wishes'),
    ]);
    const cfg = await cfgRes.json();
    const wishes = await wishesRes.json();
    document.getElementById('bday-name').textContent = cfg.birthdayPerson;
    const extra = document.getElementById('party-extra');
    if (cfg.extraWish) {
      extra.textContent = cfg.extraWish;
      extra.hidden = false;
    }
    const total = wishes.length;
    countEl.textContent =
      total === 0
        ? 'まだメッセージはありません'
        : `${total}件のお祝いメッセージ`;
    renderWishes(wishes);
  } catch {
    countEl.textContent = 'メッセージを読み込めませんでした。後でもう一度お試しください。';
  }
}

init();