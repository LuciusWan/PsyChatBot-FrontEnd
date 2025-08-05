<template>
  <div class="login-container">
    <div class="login-background">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>
    
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <el-icon size="48" color="var(--primary-color)">
            <User />
          </el-icon>
        </div>
        <h1 class="title">心理医生管理系统</h1>
        <p class="subtitle">专业 · 温暖 · 值得信赖</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            <el-icon v-if="!loading" class="mr-2">
              <Right />
            </el-icon>
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <p class="tips">
          <el-icon><InfoFilled /></el-icon>
          请使用医生账号登录系统
        </p>
        <div class="register-link">
          <span>还没有账号？</span>
          <el-button type="text" @click="goToRegister">立即注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { User, Lock, Right, InfoFilled } from '@element-plus/icons-vue'
import { login } from '@/api/auth'
import { HaveStringPropertiesEmpty } from '@/utils'

const router = useRouter()
const store = useStore()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  userType: 1 // 1是医生
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const loginFormRef = ref()
const loading = ref(false)

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    // 检查空值
    if (HaveStringPropertiesEmpty(loginForm)) {
      ElMessage.warning('请填写完整的登录信息')
      return
    }
    
    loading.value = true
    console.log('开始登录，发送数据:', loginForm)
    
    // 调用登录API
    const response = await login(loginForm)
    console.log('登录API响应:', response)
    
    // 检查响应格式
    if (response && response.code === 0) {
      // 登录成功，处理用户数据
      const userData = response.data || {}
      console.log('登录成功，用户数据:', userData)
      
      // 存储用户信息到store
      await store.dispatch('setUser', userData)
      
      ElMessage.success('登录成功')
      
      // 跳转到工作台
      router.push('/dashboard')
    } else {
      // 登录失败
      const errorMsg = response?.message || '登录失败'
      console.error('登录失败:', errorMsg)
      ElMessage.error(errorMsg)
    }
    
  } catch (error) {
    console.error('登录异常:', error)
    ElMessage.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 50%, #A5D6A7 100%);
  
  .background-shapes {
    position: relative;
    width: 100%;
    height: 100%;
    
    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: float 6s ease-in-out infinite;
      
      &.shape-1 {
        width: 300px;
        height: 300px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }
      
      &.shape-2 {
        width: 200px;
        height: 200px;
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }
      
      &.shape-3 {
        width: 150px;
        height: 150px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }
      
      &.shape-4 {
        width: 120px;
        height: 120px;
        top: 30%;
        right: 30%;
        background: rgba(129, 199, 132, 0.2);
        animation-delay: 1s;
      }
      
      &.shape-5 {
        width: 80px;
        height: 80px;
        bottom: 40%;
        right: 10%;
        background: rgba(165, 214, 167, 0.25);
        animation-delay: 3s;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  border-radius: var(--border-radius-large);
  box-shadow: 0 20px 60px rgba(76, 175, 80, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(129, 199, 132, 0.3);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  .logo {
    margin-bottom: var(--spacing-md);
  }
  
  .title {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    letter-spacing: 1px;
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 300;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: var(--spacing-lg);
    
    :deep(.el-input__wrapper) {
      padding: 12px 16px;
      border-radius: var(--border-radius-medium);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      
      &.is-focus {
        box-shadow: 0 0 0 2px rgba(127, 179, 211, 0.3);
      }
    }
    
    :deep(.el-input__inner) {
      font-size: 16px;
    }
  }
  
  .login-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: var(--border-radius-medium);
    background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
      background: linear-gradient(135deg, #45A049 0%, #5CB85C 100%);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    .mr-2 {
      margin-right: 8px;
    }
  }
}

.login-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  
  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: var(--spacing-md);
  }
  
  .register-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
    font-size: 14px;
    
    .el-button--text {
      padding: 0;
      color: var(--primary-color);
      font-weight: 500;
      
      &:hover {
        color: var(--primary-color-dark);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-card {
    margin: var(--spacing-md);
    padding: var(--spacing-lg);
  }
  
  .login-header .title {
    font-size: 24px;
  }
}
</style>