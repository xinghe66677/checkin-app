const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3456;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());

// 禁止缓存，确保微信浏览器获取最新数据
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

function initData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      persons: ['小明', '小红'],
      checkins: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { persons: ['小明', '小红'], checkins: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

initData();

// 获取全部状态
app.get('/api/state', (_req, res) => {
  res.json(readData());
});

// 打卡
app.post('/api/checkin', (req, res) => {
  const { person } = req.body;
  const data = readData();

  if (!data.persons.includes(person)) {
    return res.status(400).json({ error: '未知用户' });
  }

  const checkin = {
    person,
    time: new Date().toISOString()
  };
  data.checkins.push(checkin);
  writeData(data);
  res.json(checkin);
});

// 更新用户名
app.post('/api/config', (req, res) => {
  const { persons } = req.body;
  if (!Array.isArray(persons) || persons.length !== 2) {
    return res.status(400).json({ error: '需要两个人的名字' });
  }
  const data = readData();
  data.persons = persons;
  writeData(data);
  res.json({ persons });
});

app.listen(PORT, () => {
  console.log(`打卡服务已启动: http://localhost:${PORT}`);
});
