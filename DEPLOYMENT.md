# 生产环境部署说明

## 构建信息
- 构建时间: 2024年
- 构建环境: Node.js + Vite
- 构建模式: 生产环境 (production)

## 构建结果
✅ 构建成功完成！

### 文件大小统计
- 总构建时间: 9.36秒
- 主要文件大小:
  - `index-CxBBQRhL.js`: 1,131.38 kB (gzip: 362.99 kB) - 主应用文件
  - `xlsx-D_0l8YDs.js`: 429.03 kB (gzip: 143.08 kB) - Excel处理库
  - `index-BuJRQyI6.css`: 338.99 kB (gzip: 46.89 kB) - 主样式文件

### 生成的文件结构
```
dist/
├── index.html                 # 主页面文件
├── assets/
│   ├── css/                   # 样式文件
│   │   ├── index-BuJRQyI6.css # 主样式文件
│   │   └── [其他组件样式文件]
│   ├── js/                    # JavaScript文件
│   │   ├── index-CxBBQRhL.js  # 主应用文件
│   │   └── [其他组件JS文件]
│   └── svg/
│       └── favicon-D4e6idHm.svg # 网站图标
```

## 部署方式

### 1. 静态文件服务器部署
将 `dist` 目录下的所有文件上传到Web服务器的根目录或指定目录。

**支持的服务器:**
- Nginx
- Apache
- IIS
- 任何静态文件服务器

### 2. CDN部署
可以将 `dist` 目录上传到CDN服务，如：
- 阿里云OSS
- 腾讯云COS
- AWS S3
- 七牛云

### 3. 容器化部署
可以使用Docker进行容器化部署，参考Dockerfile配置。

## 环境配置

### 生产环境配置 (.env.production)
```
NODE_ENV=production
VITE_APP_TITLE=心理医生管理系统
VITE_API_BASE_URL=http://47.122.131.103:8087
VITE_USE_MOCK=false
```

### 重要配置说明
- **API地址**: `http://47.122.131.103:8087`
- **Mock数据**: 已禁用 (使用真实API)
- **基础路径**: 相对路径 (`./`) - 便于部署到子目录

## 性能优化

### 已实现的优化
1. **代码分割**: 按页面组件自动分割代码
2. **资源压缩**: 使用esbuild进行代码压缩
3. **文件哈希**: 所有资源文件包含哈希值，便于缓存管理
4. **Gzip压缩**: 建议服务器启用Gzip压缩
5. **Tree Shaking**: 自动移除未使用的代码

### 建议的服务器配置
```nginx
# Nginx配置示例
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 启用Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 注意事项

1. **路由模式**: 使用History模式，需要服务器配置支持SPA路由
2. **API跨域**: 确保后端API支持跨域请求
3. **HTTPS**: 生产环境建议使用HTTPS
4. **监控**: 建议配置错误监控和性能监控

## 验证部署

部署完成后，请验证以下功能：
- [ ] 登录页面正常显示
- [ ] 用户登录功能正常
- [ ] 各个页面路由正常跳转
- [ ] API接口调用正常
- [ ] 文件上传下载功能正常
- [ ] 响应式布局在移动端正常显示

## 故障排查

如果遇到问题，请检查：
1. 服务器是否正确配置了SPA路由支持
2. API地址是否正确且可访问
3. 浏览器控制台是否有错误信息
4. 网络请求是否被CORS策略阻止

---

**构建完成时间**: $(Get-Date)
**构建状态**: ✅ 成功