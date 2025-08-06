# Zeabur 部署指南

## 🚀 部署到 Zeabur

### 1. 准备工作

确保您的项目已经推送到 GitHub 仓库。

### 2. 创建 Zeabur 项目

1. 访问 [Zeabur](https://zeabur.com/)
2. 使用 GitHub 账号登录
3. 点击 "New Project" 创建新项目
4. 选择您的 GitHub 仓库

### 3. 配置环境变量

在 Zeabur 项目设置中添加以下环境变量：

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anwei-site
QWEN_API_KEY=your_qwen_api_key_here
PORT=3000
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 4. 数据库配置

推荐使用 MongoDB Atlas：

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群
3. 创建数据库用户
4. 获取连接字符串
5. 将连接字符串设置为 `MONGODB_URI` 环境变量

### 5. AI API 配置

1. 注册阿里云账号
2. 开通通义千问服务
3. 获取 API Key
4. 将 API Key 设置为 `QWEN_API_KEY` 环境变量

### 6. 邮件服务配置（可选）

如果需要邮件功能：

1. 使用 Gmail SMTP 或其他邮件服务
2. 设置相关环境变量：
   - `SMTP_HOST`: SMTP 服务器地址
   - `SMTP_PORT`: SMTP 端口
   - `SMTP_USER`: 邮箱用户名
   - `SMTP_PASS`: 邮箱密码或应用专用密码

### 7. 自定义域名

1. 在 Zeabur 项目设置中找到 "Domains"
2. 点击 "Add Domain"
3. 输入您的域名
4. 按照提示配置 DNS 记录

#### DNS 配置示例：

```
类型: CNAME
名称: www (或 @)
值: your-project.zeabur.app
```

### 8. 部署完成

部署完成后，您可以通过以下地址访问：

- **主站**: https://your-domain.com
- **后台管理**: https://your-domain.com/admin/

### 9. 后台管理员账号

需要在数据库中手动创建管理员账号：

```javascript
// 在 MongoDB 中执行
db.adminusers.insertOne({
  username: "admin",
  password: "your_password"
});
```

## 🔧 部署后配置

### 1. 测试功能

- [ ] 网站首页正常访问
- [ ] AI 聊天功能正常
- [ ] 产品展示正常
- [ ] 联系表单功能
- [ ] 后台管理登录
- [ ] 邮件发送功能

### 2. 性能优化

- 启用 CDN 加速
- 配置缓存策略
- 监控应用性能

### 3. 安全配置

- 设置强密码
- 定期更新依赖
- 监控异常访问

## 🐛 常见问题

### 1. 部署失败
- 检查 package.json 中的 scripts
- 确认 Node.js 版本兼容性
- 查看部署日志

### 2. 数据库连接失败
- 检查 MongoDB Atlas 网络访问列表
- 确认连接字符串格式正确
- 验证数据库用户权限

### 3. AI 功能无响应
- 检查 API Key 是否正确
- 确认 API 服务可用
- 查看服务器错误日志

### 4. 邮件发送失败
- 检查 SMTP 配置
- 确认邮箱密码正确
- 可能需要开启邮箱的"不太安全的应用访问权限"

## 📞 技术支持

如果遇到部署问题，请联系：
- 微信/手机：13779447487@163.com
- 邮箱：contact@anwei.shop

---

**安维科技** - 用科技创造美好未来 🚀