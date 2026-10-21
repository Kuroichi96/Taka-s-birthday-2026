const express = require('express');
const fs = require('fs');
const path = require('path');

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const DATA_DIR = path.join(__dirname, 'data');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(WISHES_FILE)) fs.writeFileSync(WISHES_FILE, '[]');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readWishes() {
  try {
    return JSON.parse(fs.readFileSync(WISHES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeWishes(wishes) {
  const tmp = WISHES_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(wishes, null, 2));
  fs.renameSync(tmp, WISHES_FILE);
}

app.get('/api/config', (req, res) => {
  res.json({ birthdayPerson: CONFIG.birthdayPerson, extraWish: CONFIG.extraWish || '' });
});

app.get('/api/wishes', (req, res) => {
  res.json(readWishes());
});

app.post('/api/wishes', (req, res) => {
  const { name, message, avatar } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  const cleanAvatar = typeof avatar === 'string' ? avatar.trim() : '';

  if (!cleanName) {
    return res.status(400).json({ error: 'お名前を入力してください。' });
  }
  if (cleanName.length > 50) {
    return res.status(400).json({ error: 'お名前が長すぎます（最大50文字）。' });
  }
  if (!cleanMessage) {
    return res.status(400).json({ error: 'お祝いメッセージを入力してください。' });
  }
  if (cleanMessage.length > 500) {
    return res.status(400).json({ error: 'メッセージが長すぎます（最大500文字）。' });
  }
  if (cleanAvatar) {
    const AVATAR_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
    if (!AVATAR_RE.test(cleanAvatar)) {
      return res.status(400).json({ error: 'プロフィール画像が無効です。' });
    }
    const bytes = Buffer.from(cleanAvatar.split(',')[1], 'base64').length;
    if (bytes > 460 * 1024) {
      return res.status(400).json({ error: 'プロフィール画像が大きすぎます（最大450KB）。' });
    }
  }

  const wishes = readWishes();
  const wish = {
    name: cleanName,
    message: cleanMessage,
    avatar: cleanAvatar || null,
    updatedAt: new Date().toISOString(),
  };
  wishes.push(wish);
  writeWishes(wishes);

  res.json({ ok: true, wish });
});

app.get('/party/:secret', (req, res) => {
  if (req.params.secret !== CONFIG.partySecret) {
    return res.status(404).send('ページが見つかりません。');
  }
  res.sendFile(path.join(__dirname, 'public', 'party.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Birthday app running on http://localhost:${PORT}`);
});