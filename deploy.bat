@echo off
chcp 65001 >nul
echo 🚀 开始部署心理医生管理系统...
echo.

REM 1. 安装依赖
echo 📦 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败！
    pause
    exit /b 1
)

REM 2. 构建生产版本
echo 🔨 构建生产版本...
call npm run build:prod
if %errorlevel% neq 0 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

REM 3. 检查构建结果
if exist "dist" (
    echo ✅ 构建成功！
    echo 📁 构建文件位于: .\dist\
    echo.
    
    echo 📋 构建文件列表:
    dir dist /b
    echo.
    
    echo 🌐 部署说明:
    echo 1. 将 dist\ 目录上传到您的Web服务器
    echo 2. 配置服务器指向 dist\index.html
    echo 3. 确保API服务器 http://47.122.131.103:8087 可访问
    echo.
    echo 🔧 IIS配置说明:
    echo - 将dist目录设置为网站根目录
    echo - 配置URL重写规则支持Vue Router
    echo.
    echo ✨ 部署完成！
    echo.
    echo 💡 提示: 您可以运行 'npm run preview:dist' 来本地预览构建结果
) else (
    echo ❌ 构建失败！请检查错误信息。
    pause
    exit /b 1
)

pause