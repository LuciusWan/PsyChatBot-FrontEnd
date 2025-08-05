# 通用前端开发 Cursor Rules

## 项目概述
- 专注于现代化前端开发，使用 Vue 3 生态系统
- 采用组件化架构，注重用户体验和代码可维护性
- 支持多角色权限系统和响应式设计

## 技术栈偏好

### 核心框架
- **Vue 3** - 使用 Composition API 作为主要开发模式
- **Vite** - 作为构建工具和开发服务器
- **Vue Router** - 用于单页应用路由管理
- **Vuex** - 状态管理（简单状态结构）

### UI 框架与样式
- **Element Plus** - 主要 UI 组件库
- **Tailwind CSS** - 原子化 CSS 框架，用于快速样式开发
- **Font Awesome** - 图标库
- 支持响应式设计（mobile-first 方法）

### 开发工具
- **Axios** - HTTP 请求库
- **Mock.js** - 开发阶段数据模拟
- **ESLint** - 代码质量检查

## 代码风格规范

### Vue 组件结构
```vue
<template>
  <!-- 使用语义化的 HTML 结构 -->
  <!-- 优先使用 Tailwind CSS 类名 -->
  <!-- Element Plus 组件采用 el- 前缀 -->
</template>

<script setup>
// 优先使用 Composition API
// 导入顺序：Vue -> 第三方库 -> 本地模块
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

// 响应式数据定义
const loading = ref(false)
const formData = reactive({})

// 方法定义
const handleSubmit = async () => {
  // 异步操作使用 async/await
}

// 生命周期
onMounted(() => {
  // 组件挂载后的逻辑
})
</script>

<style scoped>
/* 优先使用 Tailwind，必要时添加自定义样式 */
</style>
```

### 命名规范
- **文件名**: kebab-case (如: `course-selection.vue`)
- **组件名**: PascalCase (如: `CourseSelection`)
- **变量/函数**: camelCase (如: `loadStudentData`)
- **常量**: UPPER_SNAKE_CASE (如: `API_BASE_URL`)
- **CSS类名**: kebab-case 或 Tailwind 原子类

### 函数与方法
- 优先使用箭头函数
- 异步操作使用 `async/await` 而非 Promise.then()
- 函数名使用动词开头，描述性强 (如: `loadData`, `handleSubmit`, `formatDate`)
- 工具函数使用 PascalCase (如: `HaveStringPropertiesEmpty`)

### 状态管理
- 简单状态使用 `ref()` 和 `reactive()`
- 复杂状态使用 Vuex store
- Store 结构保持简洁，避免过度嵌套

### HTTP 请求
- 统一使用封装的 request 实例
- 请求拦截器处理 token 和通用配置
- 响应拦截器统一处理错误和消息提示

### 错误处理
- 使用 `try-catch` 包装异步操作
- 用户友好的错误提示使用 `ElMessage.error()`
- 控制台输出详细错误信息用于调试

### 路由组织
- 按功能模块分组路由
- 使用嵌套路由配合 Layout 组件
- 路由名称采用 `模块-页面` 格式 (如: `student-course-selection`)
- 懒加载所有页面组件

## 开发规范

### 组件开发
- 单一职责原则，组件功能明确
- 合理使用 props 和 emit 进行父子组件通信
- 使用 `<script setup>` 语法糖
- 样式优先使用 Tailwind CSS 原子类

### 数据处理
- 表单数据使用 `reactive()` 包装
- 列表数据使用 `ref([])` 
- 加载状态使用 `loading` 变量控制
- 数据格式化函数独立定义

### UI/UX 设计
- 响应式设计，支持移动端
- 使用渐变背景和毛玻璃效果
- 卡片式布局，圆角和阴影
- 图标 + 文字的按钮设计
- 状态标签使用不同颜色区分

### 环境配置
- 使用 `.env` 文件管理环境变量
- 开发、测试、生产环境分离
- 环境变量以 `VITE_` 前缀命名

### 性能优化
- 路由懒加载
- 图片懒加载
- 合理使用 `v-if` 和 `v-show`
- 避免不必要的响应式数据

## 代码质量

### 注释规范
- 复杂逻辑添加注释说明
- 函数功能注释
- TODO 标记待完成功能

### 代码复用
- 通用工具函数提取到 `utils/`
- 通用组件提取到 `components/`
- 通用样式使用 Tailwind 配置

### 测试考虑
- 关键业务逻辑编写单元测试
- 用户交互流程编写 E2E 测试

## 最佳实践

1. **渐进式开发**: 先实现核心功能，再优化体验
2. **移动优先**: 响应式设计从移动端开始
3. **用户体验**: 加载状态、错误提示、成功反馈
4. **代码可读性**: 清晰的命名和结构
5. **性能意识**: 避免不必要的重渲染和请求
6. **安全考虑**: 输入验证、XSS 防护、权限控制

## 常用代码片段

### 页面加载模式
```javascript
const loading = ref(false)
const data = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/data')
    data.value = res
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
```

### 表单提交模式
```javascript
const formData = reactive({
  name: '',
  email: ''
})

const handleSubmit = async () => {
  if (HaveStringPropertiesEmpty(formData)) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  try {
    await request.post('/api/submit', formData)
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  }
}
```
