# 安维科技 - 现代化科技风格网站

一个具有现代化科技风格的完整网站项目，集成了AI聊天、产品展示、订单管理、后台管理等功能。

## ✨ 主要功能

### 🏠 前端功能
- **现代化首页**: 科技感十足的英雄区域和功能展示
- **AI智能助手**: 基于阿里云通义千问的智能对话系统
- **产品展示**: 动态产品列表，支持搜索和筛选
- **作品集**: 项目展示，支持分类筛选
- **联系我们**: 完整的联系表单和服务信息

### 🤖 AI功能
- 集成阿里云通义千问API
- 智能对话和历史记录
- 实时输入指示器
- 建议问题快速发送

### 🛍️ 电商功能
- 产品管理和展示
- 订单处理系统
- 支付凭证上传
- 订单状态管理

### 🔧 后台管理
- 仪表盘数据统计
- 留言管理
- 商品管理（增删改查）
- 订单管理
- 实时数据更新

## 🎨 设计特色

### 科技风格设计
- **渐变背景**: 多层次的渐变背景效果
- **玻璃态效果**: 毛玻璃背景和边框
- **动画效果**: 悬停动画、加载动画、页面过渡
- **响应式设计**: 完美适配各种设备
- **现代化UI**: 卡片式布局、圆角设计、阴影效果

### 交互体验
- 平滑的滚动效果
- 智能的输入提示
- 实时状态反馈
- 优雅的加载动画

## 🛠️ 技术栈

### 后端
- **Node.js**: 服务器运行环境
- **Express**: Web应用框架
- **MongoDB**: 数据库
- **Mongoose**: ODM工具
- **Multer**: 文件上传处理
- **Nodemailer**: 邮件服务

### 前端
- **HTML5**: 语义化标记
- **CSS3**: 现代化样式
- **JavaScript**: 交互逻辑
- **Google Fonts**: 字体服务

### 第三方服务
- **阿里云通义千问**: AI对话服务
- **MongoDB Atlas**: 云数据库

## 📦 安装和运行

### 环境要求
- Node.js 14.0+
- MongoDB 4.0+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd anwei-site
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env` 文件并配置以下环境变量：
```env
MONGODB_URI=mongodb://localhost:27017/anwei-site
QWEN_API_KEY=your_qwen_api_key
PORT=3000
```

4. **启动服务器**
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

5. **访问网站**
- 前端: http://localhost:3000
- 后台管理: http://localhost:3000/admin/dashboard.html

## 📁 项目结构

```
anwei-site/
├── server.js              # 主服务器文件
├── package.json           # 项目配置
├── README.md             # 项目说明
├── .env                  # 环境变量（需要创建）
├── public/               # 静态文件
│   ├── index.html        # 首页
│   ├── chat.html         # AI聊天页面
│   ├── products.html     # 产品展示页面
│   ├── works.html        # 作品集页面
│   ├── contact.html      # 联系页面
│   ├── style.css         # 主样式文件
│   ├── admin/            # 后台管理
│   │   ├── dashboard.html # 管理面板
│   │   ├── admin.css     # 后台样式
│   │   └── dashboard.js  # 后台脚本
│   └── product/          # 产品相关页面
├── uploads/              # 文件上传目录
└── node_modules/         # 依赖包
```

## 🔧 API接口

### 聊天相关
- `POST /api/chat` - 发送聊天消息
- `GET /api/history` - 获取聊天历史

### 产品相关
- `GET /api/products` - 获取产品列表
- `GET /admin/products` - 获取所有产品（管理）
- `POST /admin/products` - 添加产品
- `PUT /admin/products/:id` - 更新产品
- `DELETE /admin/products/:id` - 删除产品

### 订单相关
- `POST /api/order` - 创建订单
- `GET /admin/orders` - 获取订单列表
- `PUT /admin/orders/:id` - 更新订单状态

### 留言相关
- `POST /api/messages` - 发送留言
- `GET /admin/messages` - 获取留言列表
- `DELETE /admin/messages/:id` - 删除留言

## 🎯 功能亮点

### 1. 现代化设计
- 科技感十足的渐变色彩
- 流畅的动画效果
- 响应式布局设计

### 2. AI智能助手
- 实时对话体验
- 智能建议问题
- 历史记录保存

### 3. 完整的管理系统
- 数据统计仪表盘
- 便捷的CRUD操作
- 实时数据更新

### 4. 用户体验优化
- 加载状态提示
- 错误处理机制
- 操作反馈通知

## 🚀 部署建议

### 开发环境
- 使用 `npm run dev` 启动开发服务器
- 支持热重载，修改代码后自动重启

### 生产环境
1. 设置环境变量
2. 使用 PM2 或类似工具管理进程
3. 配置 Nginx 反向代理
4. 设置 SSL 证书

### 数据库
- 推荐使用 MongoDB Atlas 云数据库
- 配置数据库连接池
- 定期备份数据

## 🔒 安全考虑

- 输入验证和过滤
- API 访问控制
- 文件上传安全
- 环境变量保护

## 📝 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 完整的网站功能
- 现代化UI设计
- AI聊天集成

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

## 📄 许可证

本项目采用 ISC 许可证。

## 📞 联系方式

- 微信/手机：13779447487@163.com
- 邮箱：contact@anwei.shop

---

**安维科技** - 用科技创造美好未来 🚀 