require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');

// 连接到 MongoDB 数据库
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// 定义模型
const chatSchema = new mongoose.Schema({ role: String, content: String });
const Chat = mongoose.model('Chat', chatSchema);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 邮件配置
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// 发送邮件函数
async function sendEmail(to, subject, text) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`模拟发送邮件到 ${to}: ${subject}`);
      return true;
    }
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: text
    });
    
    console.log('邮件发送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
}

// AI 对话
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const answer = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.QWEN_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'qwen-turbo', input: { messages: [{ role: 'user', content: message }] } })
  }).then(r => r.json());
  const reply = answer.output?.text || '暂无回复';
  await Chat.insertMany([{ role: 'user', content: message }, { role: 'assistant', content: reply }]);
  res.json({ reply });
});

// 历史记录
app.get('/api/history', async (_req, res) => res.json(await Chat.find()));

// 联系表单
app.post('/api/contact', (req, res) => {
  console.log(req.body);
  res.json({ ok: 1 });
});

// 后台登录
const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({
  username: String,
  password: String
}));

app.post('/admin/login', async (req, res) => {
  const {u, p} = req.body;
  const user = await AdminUser.findOne({username: u, password: p});
  res.json({ok: !!user});
});

// 留言
app.get('/admin/messages', async (_req, res) => res.json(await Chat.find()));
app.delete('/admin/messages/:id', async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ok: 1});
});

// 商品
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  price: Number,
  desc: String,
  cover: String,
  taobaoUrl: String,
  status: {type: String, default: 'on'} // on / off
}));

// 公共产品API
app.get('/api/products', async (_req, res) => {
  try {
    const products = await Product.find({ status: 'on' }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: '获取产品失败' });
  }
});

app.get('/admin/products', async (_req, res) => res.json(await Product.find()));
app.get('/admin/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: '产品不存在' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: '获取产品失败' });
  }
});
app.post('/admin/products', async (req, res) => {
  await Product.create(req.body);
  res.json({ok: 1});
});
app.put('/admin/products/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ok: 1});
});
app.delete('/admin/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ok: 1});
});

// 订单
const Order = mongoose.model('Order', new mongoose.Schema({
  product: String,
  email: String,
  payImg: String,
  status: {type: String, default: 'pending'}, // pending / done
  createdAt: {type: Date, default: Date.now}
}));

app.get('/admin/orders', async (_req, res) => res.json(await Order.find()));
app.put('/admin/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, {status:'done'}, {new:true});
  
  // 发送订单完成邮件
  const subject = '订单处理完成 - 安维科技';
  const text = `
    尊敬的用户，

    您的订单已处理完成！

    订单信息：
    - 产品：${order.product}
    - 邮箱：${order.email}
    - 处理时间：${new Date().toLocaleString()}

    感谢您的支持！

    安维科技团队
  `;
  
  await sendEmail(order.email, subject, text);
  console.log(`已给 ${order.email} 发送订单完成邮件`);
  res.json({ok: 1});
});

// 订单创建
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
app.post('/api/order', upload.single('payImg'), async (req, res) => {
  await Order.create({
    product: req.body.product,
    email: req.body.email,
    payImg: req.file.filename,
    status: 'pending'
  });
  res.json({ok: 1});
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// 联系表单消息
app.post('/api/messages', async (req, res) => {
  try {
    const newChat = new Chat({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      createdAt: new Date()
    });
    await newChat.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});