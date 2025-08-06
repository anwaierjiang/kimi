@echo off
echo 正在启动安维科技网站...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 正在安装依赖包...
    npm install
    if errorlevel 1 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查环境变量文件
if not exist ".env" (
    echo 警告: 未找到.env文件，正在创建示例文件...
    echo MONGODB_URI=mongodb://localhost:27017/anwei-site > .env
    echo QWEN_API_KEY=your_qwen_api_key_here >> .env
    echo PORT=3000 >> .env
    echo.
    echo 请编辑.env文件，配置正确的数据库连接和API密钥
    echo.
)

echo 启动开发服务器...
echo 网站地址: http://localhost:3000
echo 后台管理: http://localhost:3000/admin/dashboard.html
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm run dev 