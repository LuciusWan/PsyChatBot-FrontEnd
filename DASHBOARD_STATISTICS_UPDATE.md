# 工作台统计数据更新说明

## 修改内容

### 1. 统计卡片更新
将原来的统计卡片从：
- 今日患者 (12)
- 待处理预约 (8) 
- 已完成咨询 (25)
- 满意度评分 (4.8)

更改为：
- **患者数量** - 调用 `/doctor/get/patient` 接口
- **文件数量** - 调用 `/doctor/get/file` 接口  
- **试卷数量** - 调用 `/doctor/get/paper/num` 接口
- **题目数量** - 调用 `/doctor/get/question` 接口

### 2. API 接口新增
在 `src/api/doctor.js` 中新增了以下接口：

```javascript
// 获取试卷数量
export function getPaperCount()

// 获取题目数量  
export function getQuestionCount()

// 获取文件数量
export function getFileCount()

// 获取患者数量
export function getPatientCount()
```

### 3. 功能特性

#### 🔄 异步加载
- 页面加载时并行调用所有统计接口
- 每个卡片独立显示加载状态
- 加载失败时显示默认值 "0"

#### 📊 数据处理
- 智能识别不同接口的返回格式：
  - 直接返回数字：`response.data`
  - 返回对象包含count：`response.data.count`  
  - 返回对象包含total：`response.data.total`
  - 返回数组：`response.data.length`

#### 🎨 UI优化
- 加载时显示 "--" 占位符
- 添加加载动画效果
- 保持原有的图标和颜色设计

### 4. 错误处理
- 网络请求失败时在控制台输出错误信息
- 用户界面显示默认值，不影响页面正常使用
- 每个统计项独立处理，单个失败不影响其他项

### 5. 性能优化
- 使用 `Promise.all()` 并行加载所有统计数据
- 避免串行请求造成的页面加载延迟
- 合理的错误边界处理

## 使用说明

1. 确保后端接口 `/doctor/get/patient`、`/doctor/get/file`、`/doctor/get/paper/num`、`/doctor/get/question` 已实现
2. 接口应返回标准格式：`{ code: 0, data: number | { count: number } | { total: number } | array }`
3. 页面会在加载时自动获取最新的统计数据
4. 如需刷新数据，重新进入工作台页面即可

## 技术实现

- **框架**: Vue 3 Composition API
- **HTTP库**: Axios (通过封装的request实例)
- **UI组件**: Element Plus
- **状态管理**: 响应式数据 + 加载状态控制