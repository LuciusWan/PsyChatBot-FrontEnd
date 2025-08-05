<template>
  <div class="register-container">
    <div class="register-background">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>
    
    <div class="register-card">
      <div class="register-header">
        <div class="logo">
          <el-icon size="48" color="var(--primary-color)">
            <UserFilled />
          </el-icon>
        </div>
        <h1 class="title">医生注册</h1>
        <p class="subtitle">加入心理医生管理系统</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名"
                size="large"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name">
              <el-input
                v-model="registerForm.name"
                placeholder="真实姓名"
                size="large"
                :prefix-icon="UserFilled"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="department">
              <el-input
                v-model="registerForm.department"
                placeholder="科室"
                size="large"
                :prefix-icon="OfficeBuilding"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="手机号"
                size="large"
                :prefix-icon="Phone"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            size="large"
            :prefix-icon="Message"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="register-button"
            @click="handleRegister"
          >
            <el-icon v-if="!loading" class="mr-2">
              <Check />
            </el-icon>
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-footer">
        <p class="tips">
          <el-icon><InfoFilled /></el-icon>
          请填写真实信息完成医生注册
        </p>
        <div class="login-link">
          <span>已有账号？</span>
          <el-button type="text" @click="goToLogin">立即登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  UserFilled, 
  Lock, 
  OfficeBuilding, 
  Phone, 
  Message, 
  Check, 
  InfoFilled 
} from '@element-plus/icons-vue'
import { register } from '@/api/auth'
import { HaveStringPropertiesEmpty } from '@/utils'

const router = useRouter()

// 表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  department: '',
  phone: '',
  email: ''
})

// 确认密码验证
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 手机号验证
const validatePhone = (rule, value, callback) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

// 邮箱验证
const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value === '') {
    callback(new Error('请输入邮箱'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请输入科室', trigger: 'blur' },
    { min: 2, max: 20, message: '科室名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ]
}

const registerFormRef = ref()
const loading = ref(false)

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    // 表单验证
    await registerFormRef.value.validate()
    
    // 检查空值
    const formData = { ...registerForm }
    delete formData.confirmPassword // 移除确认密码字段
    
    if (HaveStringPropertiesEmpty(formData)) {
      ElMessage.warning('请填写完整的注册信息')
      return
    }
    
    loading.value = true
    console.log('开始注册，发送数据:', formData)
    
    // 调用注册API
    const response = await register(formData)
    console.log('注册API响应:', response)
    
    // 检查响应格式
    if (response && response.code === 0) {
      ElMessage.success('注册成功！请使用新账号登录')
      
      // 跳转到登录页面
      router.push('/login')
    } else {
      // 注册失败
      const errorMsg = response?.message || '注册失败'
      console.error('注册失败:', errorMsg)
      ElMessage.error(errorMsg)
    }
    
  } catch (error) {
    console.error('注册异常:', error)
    ElMessage.error('注册失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.register-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2196F3 0%, #64B5F6 50%, #90CAF9 100%);
  
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
        background: rgba(100, 181, 246, 0.2);
        animation-delay: 1s;
      }
      
      &.shape-5 {
        width: 80px;
        height: 80px;
        bottom: 40%;
        right: 10%;
        background: rgba(144, 202, 249, 0.25);
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

.register-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 520px;
  padding: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  border-radius: var(--border-radius-large);
  box-shadow: 0 20px 60px rgba(33, 150, 243, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(100, 181, 246, 0.3);
  animation: slideUp 0.6s ease-out;
  max-height: 90vh;
  overflow-y: auto;
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

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  
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

.register-form {
  .el-form-item {
    margin-bottom: var(--spacing-md);
    
    :deep(.el-input__wrapper) {
      padding: 12px 16px;
      border-radius: var(--border-radius-medium);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      
      &.is-focus {
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
      }
    }
    
    :deep(.el-input__inner) {
      font-size: 16px;
    }
  }
  
  .register-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: var(--border-radius-medium);
    background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
      background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    .mr-2 {
      margin-right: 8px;
    }
  }
}

.register-footer {
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
  
  .login-link {
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
  .register-card {
    margin: var(--spacing-md);
    padding: var(--spacing-lg);
    max-width: none;
  }
  
  .register-header .title {
    font-size: 24px;
  }
  
  .register-form {
    .el-row .el-col {
      margin-bottom: var(--spacing-sm);
    }
  }
}
</style>