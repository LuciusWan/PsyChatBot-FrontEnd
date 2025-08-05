<template>
  <div class="profile-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="profile-header">
        <div class="header-left">
          <el-button 
            type="text" 
            class="back-btn"
            @click="goBack"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回工作台
          </el-button>
          <div class="breadcrumb">
            <span class="breadcrumb-item">工作台</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item current">个人信息</span>
          </div>
        </div>
        <div class="header-right">
          <el-button 
            type="primary" 
            :loading="loading"
            @click="handleSave"
          >
            <el-icon><Check /></el-icon>
            保存修改
          </el-button>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="profile-main">
        <div class="profile-content">
          <!-- 页面标题 -->
          <div class="page-title">
            <div class="title-content">
              <div class="title-icon">
                <el-icon size="32" color="white">
                  <User />
                </el-icon>
              </div>
              <div class="title-text">
                <h1>个人信息</h1>
                <p>管理您的个人资料和账户信息</p>
              </div>
            </div>
          </div>

          <!-- 个人信息表单 -->
          <el-card class="profile-card" v-loading="pageLoading">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
                <el-tag v-if="doctorInfo.status === 0" type="success">正常</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
              </div>
            </template>

            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-width="100px"
              class="profile-form"
            >
              <el-row :gutter="24">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="用户名" prop="username">
                    <el-input
                      v-model="formData.username"
                      placeholder="请输入用户名"
                      :disabled="true"
                    >
                      <template #prefix>
                        <el-icon><User /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="姓名" prop="name">
                    <el-input
                      v-model="formData.name"
                      placeholder="请输入姓名"
                    >
                      <template #prefix>
                        <el-icon><UserFilled /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="职称" prop="title">
                    <el-select
                      v-model="formData.title"
                      placeholder="请选择职称"
                      style="width: 100%"
                    >
                      <el-option label="医师" value="医师" />
                      <el-option label="主治医师" value="主治医师" />
                      <el-option label="副主任医师" value="副主任医师" />
                      <el-option label="主任医师" value="主任医师" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="科室" prop="department">
                    <el-select
                      v-model="formData.department"
                      placeholder="请选择科室"
                      style="width: 100%"
                    >
                      <el-option label="心理科" value="心理科" />
                      <el-option label="精神科" value="精神科" />
                      <el-option label="儿童心理科" value="儿童心理科" />
                      <el-option label="青少年心理科" value="青少年心理科" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="电话" prop="phone">
                    <el-input
                      v-model="formData.phone"
                      placeholder="请输入电话号码"
                    >
                      <template #prefix>
                        <el-icon><Phone /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="formData.email"
                      placeholder="请输入邮箱地址"
                    >
                      <template #prefix>
                        <el-icon><Message /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :xs="24">
                  <el-form-item label="自我介绍" prop="introduction">
                    <el-input
                      v-model="formData.introduction"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入您的自我介绍，让患者更好地了解您..."
                      maxlength="500"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :xs="24">
                  <el-form-item label="专业优点" prop="advantage">
                    <el-input
                      v-model="formData.advantage"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入您的专业优点和特长，如擅长领域、治疗方法等..."
                      maxlength="300"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button size="large" @click="handleReset">
              <el-icon><RefreshLeft /></el-icon>
              重置
            </el-button>
            <el-button 
              type="primary" 
              size="large"
              :loading="loading"
              @click="handleSave"
            >
              <el-icon><Check /></el-icon>
              保存修改
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  User,
  UserFilled,
  Phone,
  Message,
  Check,
  RefreshLeft
} from '@element-plus/icons-vue'
import { getDoctorInfo, updateDoctorInfo, getDoctorDetailInfo, updateDoctorDetailInfo } from '@/api/doctor'

const router = useRouter()

// 页面加载状态
const pageLoading = ref(false)
const loading = ref(false)

// 表单引用
const formRef = ref()

// 医生信息
const doctorInfo = ref({})

// 表单数据
const formData = reactive({
  id: '',
  username: '',
  name: '',
  title: '',
  department: '',
  phone: '',
  email: '',
  status: 0,
  introduction: '',
  advantage: ''
})

// 原始数据备份（用于重置）
const originalData = ref({})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请选择职称', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择科室', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  introduction: [
    { max: 500, message: '自我介绍不能超过500个字符', trigger: 'blur' }
  ],
  advantage: [
    { max: 300, message: '专业优点不能超过300个字符', trigger: 'blur' }
  ]
}

// 返回工作台
const goBack = () => {
  router.push('/dashboard')
}

// 加载医生信息
const loadDoctorInfo = async () => {
  pageLoading.value = true
  try {
    console.log('开始获取医生信息...')
    
    // 并行获取基本信息和详细信息
    const [basicResponse, detailResponse] = await Promise.all([
      getDoctorInfo(),
      getDoctorDetailInfo().catch(err => {
        console.warn('获取详细信息失败，可能是首次使用:', err)
        return null
      })
    ])
    
    console.log('基本信息API响应:', basicResponse)
    console.log('详细信息API响应:', detailResponse)
    
    if (basicResponse && basicResponse.code === 0 && basicResponse.data) {
      doctorInfo.value = basicResponse.data
      
      // 填充基本表单数据
      Object.assign(formData, {
        id: basicResponse.data.id || '',
        username: basicResponse.data.username || '',
        name: basicResponse.data.name || '',
        title: basicResponse.data.title || '',
        department: basicResponse.data.department || '',
        phone: basicResponse.data.phone || '',
        email: basicResponse.data.email || '',
        status: basicResponse.data.status || 0,
        introduction: '',
        advantage: ''
      })
      
      // 填充详细信息（如果存在）
      if (detailResponse && detailResponse.code === 0 && detailResponse.data) {
        formData.introduction = detailResponse.data.introduction || ''
        formData.advantage = detailResponse.data.advantage || ''
      }
      
      // 备份原始数据
      originalData.value = { ...formData }
      console.log('表单数据已填充:', formData)
    } else {
      console.error('API返回数据格式错误:', basicResponse)
      ElMessage.error('获取个人信息失败：数据格式错误')
    }
  } catch (error) {
    console.error('获取医生信息失败:', error)
    ElMessage.error('获取个人信息失败，请稍后重试')
  } finally {
    pageLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  ElMessageBox.confirm(
    '确定要重置所有修改吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    Object.assign(formData, originalData.value)
    formRef.value?.clearValidate()
    ElMessage.success('已重置为原始数据')
  }).catch(() => {
    // 用户取消
  })
}

// 保存修改
const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    // 表单验证
    await formRef.value.validate()
    
    loading.value = true
    
    console.log('准备提交的数据:', formData)
    
    // 准备基本信息数据
    const basicData = {
      id: formData.id,
      username: formData.username,
      name: formData.name,
      title: formData.title,
      department: formData.department,
      phone: formData.phone,
      email: formData.email,
      status: formData.status
    }
    
    // 准备详细信息数据
    const detailData = {
      doctorId: formData.id,
      introduction: formData.introduction || '',
      advantage: formData.advantage || ''
    }
    
    // 并行更新基本信息和详细信息
    const [basicResponse, detailResponse] = await Promise.all([
      updateDoctorInfo(basicData),
      updateDoctorDetailInfo(detailData)
    ])
    
    console.log('基本信息更新响应:', basicResponse)
    console.log('详细信息更新响应:', detailResponse)
    
    if (basicResponse && basicResponse.code === 0 && detailResponse && detailResponse.code === 0) {
      // 更新原始数据备份
      originalData.value = { ...formData }
      ElMessage.success('个人信息更新成功')
    } else {
      console.error('更新失败:', { basicResponse, detailResponse })
      ElMessage.error('更新失败，请稍后重试')
    }
  } catch (error) {
    if (error.errors) {
      // 表单验证失败
      ElMessage.warning('请检查表单信息')
    } else {
      console.error('更新医生信息失败:', error)
      ElMessage.error('更新失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadDoctorInfo()
})
</script>

<style scoped lang="scss">
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
}

/* 顶部导航栏 */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  font-size: 16px;
  font-weight: 500;
  color: #2E7D32;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(76, 175, 80, 0.1);
}

.back-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  transform: translateX(-2px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  color: #666;
}

.breadcrumb-item.current {
  color: #2E7D32;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #ccc;
  font-size: 12px;
}

/* 主要内容区域 */
.profile-main {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 页面标题 */
.page-title {
  .title-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
  }
  
  .title-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
  }
  
  .title-text {
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #2E7D32;
      margin: 0 0 8px 0;
    }
    
    p {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
  }
}

/* 个人信息卡片 */
.profile-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  :deep(.el-card__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  :deep(.el-card__body) {
    padding: 32px 24px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #2E7D32;
}

/* 表单样式 */
.profile-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
  }
  
  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }
  
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.el-input.is-disabled .el-input__wrapper) {
    background-color: #f8f9fa;
    border-color: #e9ecef;
  }
  
  :deep(.el-select) {
    width: 100%;
  }
  
  :deep(.el-select .el-input__wrapper) {
    border-radius: 8px;
  }
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
  
  .el-button {
    padding: 12px 32px;
    border-radius: 8px;
    font-weight: 500;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    padding: 12px 16px;
  }
  
  .header-left {
    gap: 12px;
  }
  
  .breadcrumb {
    display: none;
  }
  
  .profile-main {
    padding: 16px;
  }
  
  .page-title .title-content {
    padding: 16px 0;
  }
  
  .title-icon {
    width: 48px;
    height: 48px;
  }
  
  .title-text h1 {
    font-size: 24px;
  }
  
  .profile-card :deep(.el-card__body) {
    padding: 24px 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>