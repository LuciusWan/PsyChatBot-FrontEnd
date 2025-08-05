# 本地预览生产环境构建结果
# 使用Node.js的http-server或Python的简单服务器

Write-Host "=== 生产环境构建预览 ===" -ForegroundColor Green
Write-Host ""

# 检查dist目录是否存在
if (!(Test-Path "dist")) {
    Write-Host "❌ dist目录不存在，请先运行构建命令: npm run build:prod" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 发现dist目录" -ForegroundColor Green

# 显示构建文件信息
$files = Get-ChildItem -Path "dist" -Recurse
$totalSize = ($files | Measure-Object -Property Length -Sum).Sum
$fileCount = $files.Count

Write-Host "📊 构建统计:" -ForegroundColor Cyan
Write-Host "   文件数量: $fileCount"
Write-Host "   总大小: $([math]::Round($totalSize/1MB,2)) MB"
Write-Host ""

# 尝试启动预览服务器
Write-Host "🚀 启动预览服务器..." -ForegroundColor Yellow

# 检查是否安装了http-server
try {
    $httpServer = Get-Command "http-server" -ErrorAction Stop
    Write-Host "使用 http-server 启动预览..." -ForegroundColor Green
    Set-Location "dist"
    Start-Process "http-server" -ArgumentList "-p 8080 -o" -NoNewWindow
    Write-Host "预览地址: http://localhost:8080" -ForegroundColor Green
} catch {
    # 尝试使用Python
    try {
        $python = Get-Command "python" -ErrorAction Stop
        Write-Host "使用 Python 启动预览..." -ForegroundColor Green
        Set-Location "dist"
        Write-Host "预览地址: http://localhost:8000" -ForegroundColor Green
        python -m http.server 8000
    } catch {
        Write-Host "❌ 未找到 http-server 或 python" -ForegroundColor Red
        Write-Host "请安装其中一个:" -ForegroundColor Yellow
        Write-Host "   npm install -g http-server" -ForegroundColor Gray
        Write-Host "   或安装 Python" -ForegroundColor Gray
        Write-Host ""
        Write-Host "或者直接将 dist 目录部署到Web服务器" -ForegroundColor Yellow
    }
}