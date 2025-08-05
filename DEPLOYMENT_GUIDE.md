# 心理医生管理系统 - 部署指南

## 📋 部署概述

本指南将帮助您将心理医生管理系统部署到云服务器，并配置为调用 `http://47.122.131.103:8087` 的后端API。

## 🛠️ 构建步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 生产环境构建
```bash
# 使用生产环境配置构建
npm run build:prod

# 或者使用默认构建命令
npm run build
```

### 3. 预览构建结果（可选）
```bash
# 本地预览构建后的文件
npm run preview:dist
```

## 🌐 环境配置

### 生产环境配置 (.env.production)
```env
NODE_ENV=production
VITE_APP_TITLE=心理医生管理系统
VITE_API_BASE_URL=http://47.122.131.103:8087
VITE_USE_MOCK=false
```

### 开发环境配置 (.env.development)
```env
NODE_ENV=development
VITE_APP_TITLE=心理医生管理系统
VITE_API_BASE_URL=http://localhost:8087
VITE_USE_MOCK=false
```

## 📁 构建输出

构建完成后，所有静态文件将生成在 `dist/` 目录中：

```
dist/
├── index.html          # 主页面
├── assets/            # 静态资源
│   ├── js/           # JavaScript文件
│   ├── css/          # CSS样式文件
│   └── svg/          # SVG图标文件
└── favicon.svg       # 网站图标
```

## 🚀 部署方式

### 方式一：Nginx 部署

1. **上传文件到服务器**
   ```bash
   # 将dist目录上传到服务器
   scp -r dist/ user@your-server:/var/www/html/psychatbot/
   ```

2. **配置Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html/psychatbot;
       index index.html;

       # 处理Vue Router的history模式
       location / {
           try_files $uri $uri/ /index.html;
       }

       # 静态资源缓存
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # API代理（如果需要）
       location /api/ {
           proxy_pass http://47.122.131.103:8087/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **重启Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 方式二：Apache 部署

1. **上传文件**
   ```bash
   scp -r dist/ user@your-server:/var/www/html/psychatbot/
   ```

2. **配置.htaccess**
   在dist目录中创建.htaccess文件：
   ```apache
   RewriteEngine On
   RewriteBase /psychatbot/
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /psychatbot/index.html [L]
   ```

### 方式三：Docker 部署

1. **创建Dockerfile**
   ```dockerfile
   FROM nginx:alpine
   COPY dist/ /usr/share/nginx/html/
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **构建和运行**
   ```bash
   docker build -t psychatbot-frontend .
   docker run -d -p 80:80 psychatbot-frontend
   ```

## 🔧 API配置说明

### 后端API地址
- **生产环境**: `http://47.122.131.103:8087`
- **开发环境**: `http://localhost:8087`

### API接口列表
- 登录认证: `/doctor/login`
- 医生信息: `/doctor/get/info`
- 患者管理: `/doctor/get/patient/info`
- 试卷管理: `/doctor/get/paper`
- 文件管理: `/doctor/doc/list`

## 🛡️ 安全注意事项

1. **HTTPS配置**: 生产环境建议使用HTTPS
2. **CORS配置**: 确保后端API允许前端域名的跨域请求
3. **环境变量**: 敏感信息不要提交到代码仓库
4. **访问控制**: 配置适当的防火墙规则

## 🔍 故障排除

### 常见问题

1. **API请求失败**
   - 检查网络连接
   - 确认API服务器状态
   - 检查CORS配置

2. **路由404错误**
   - 确保服务器配置了SPA路由重写
   - 检查base路径配置

3. **静态资源加载失败**
   - 检查文件路径
   - 确认服务器权限设置

### 调试命令

```bash
# 检查构建结果
npm run preview:dist

# 检查API连接
curl http://47.122.131.103:8087/doctor/get/info

# 检查服务器日志
tail -f /var/log/nginx/error.log
```

## 📞 技术支持

如遇到部署问题，请检查：
1. 服务器环境配置
2. 网络连接状态
3. API服务状态
4. 浏览器控制台错误信息

---

**构建时间**: $(date)
**版本**: v1.0.0
**环境**: Production