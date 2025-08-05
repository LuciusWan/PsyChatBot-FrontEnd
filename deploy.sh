#!/bin/bash

# 心理医生管理系统 - 自动部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署心理医生管理系统..."

# 1. 安装依赖
echo "📦 安装依赖..."
npm install

# 2. 构建生产版本
echo "🔨 构建生产版本..."
npm run build:prod

# 3. 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于: ./dist/"
    
    # 显示构建文件大小
    echo "📊 构建文件统计:"
    du -sh dist/
    
    # 显示主要文件
    echo "📋 主要文件:"
    ls -la dist/
    
    echo ""
    echo "🌐 部署说明:"
    echo "1. 将 dist/ 目录上传到您的Web服务器"
    echo "2. 配置服务器指向 dist/index.html"
    echo "3. 确保API服务器 http://47.122.131.103:8087 可访问"
    echo ""
    echo "🔧 Nginx配置示例:"
    echo "server {"
    echo "    listen 80;"
    echo "    server_name your-domain.com;"
    echo "    root /path/to/dist;"
    echo "    index index.html;"
    echo "    location / {"
    echo "        try_files \$uri \$uri/ /index.html;"
    echo "    }"
    echo "}"
    echo ""
    echo "✨ 部署完成！"
else
    echo "❌ 构建失败！请检查错误信息。"
    exit 1
fi