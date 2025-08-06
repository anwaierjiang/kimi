require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// 初始化 Express 应用
const app = express();

// ==================== 中间件配置 ====================
app.use(cors());

// API 请求限速（防止暴力破解）
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100次请求
  message: { error: '请求过于频繁，请稍后再试' }
});
app.use('/api/', apiLimiter);
app.use('/admin/', apiLimiter);

// 路由优先级配置
app.use('/api', express.json());  // API路由优先处理
app.use('/admin', express.json()); // 管理路由
app.use(express.static('public')); // 静态文件最后处理

// ==================== 数据库连接 ====================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 连接成功'))
  .catch(err => console.error('MongoDB 连接失败:', err));

// ==================== 数据模型 ====================
const Chat = mongoose.model('Chat', new mongoose.Schema({
  role: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
}));

const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({
  username: { 
    type: String, 
    unique: true,
    required: [true, '用户名不能为空'] 
  },
  password: { 
    type: String,
    required: [true, '密码不能为空'],
    set: (plainText) => bcrypt.hashSync(plainText, 10) // 自动加密
  }
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, min: 0, required: true },
  desc: String,
  cover: String,
  taobaoUrl: String,
  status: { type: String, enum: ['on', 'off'], default: 'on' }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  product: { type: String, required: true },
  email: { type: String, required: true },
  payImg: String,
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}));

// ==================== 邮件服务 ====================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.163.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // 强制SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: { rejectUnauthorized: false } // 兼容Zeabur证书
});

async function sendEmail(to, subject, text) {
  if (!process.env.SMTP_USER) {
    console.log(`[模拟邮件] 发给 ${to}: ${subject}`);
    return true;
  }
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
    return true;
  } catch (err) {
    console.error('邮件发送失败:', err);
    return false;
  }
}

// ==================== 文件上传 ====================
const upload = multer({
  storage: multer.memoryStorage(), // 禁用本地存储
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('仅支持图片文件'));
  }
});

// ==================== 路由定义 ====================

// ---------- 公共API ----------
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '1.0.0'
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const answer = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        model: 'qwen-turbo', 
        input: { messages: [{ role: 'user', content: message }] }
      })
    }).then(r => r.json());
    
    const reply = answer.output?.text || '暂无回复';
    await Chat.create([
      { role: 'user', content: message },
      { role: 'assistant', content: reply }
    ]);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'AI服务异常' });
  }
});

app.post('/api/order', upload.single('payImg'), async (req, res) => {
  try {
    // 此处应替换为云存储上传逻辑
    const cloudUrl = `https://storage.example.com/${Date.now()}_${req.file.originalname}`;
    
    await Order.create({
      product: req.body.product,
      email: req.body.email,
      payImg: cloudUrl,
      status: 'pending'
    });
    res.json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ error: '订单创建失败' });
  }
});

// ---------- 管理后台 ----------
app.get('/admin/login', (req, res) => {
  res.status(405).json({ error: '请使用POST方法登录' });
});

app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AdminUser.findOne({ username });
    if (!user) return res.status(401).json({ ok: false, error: '用户不存在' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ ok: false, error: '密码错误' });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: '登录失败' });
  }
});

// ==================== 服务启动 ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务已启动，端口: ${PORT}`);
  console.log(`前端地址: http://localhost:${PORT}`);
  console.log(`API文档: http://localhost:${PORT}/api-docs`);
});

// 初始化管理员账号（首次运行后删除）
async function initAdmin() {
  const exists = await AdminUser.exists({ username: 'admin' });
  if (!exists) {
    await AdminUser.create({ username: 'admin', password: '默认密码' });
    console.log('管理员账号已创建: admin/默认密码');
  }
}
initAdmin();