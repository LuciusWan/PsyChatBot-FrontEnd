<template>
  <div class="expert-management">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-button 
          :icon="ArrowLeft" 
          @click="goBack"
          class="back-btn"
          type="text"
          size="large"
        >
          返回工作台
        </el-button>
        <div class="breadcrumb">
          <span class="breadcrumb-item">工作台</span>
          <el-icon class="breadcrumb-separator"><ArrowRight /></el-icon>
          <span class="breadcrumb-item current">专家管理</span>
        </div>
      </div>
      <div class="nav-right">
        <el-button 
          :icon="Refresh" 
          @click="loadExpertList"
          :loading="loading"
          circle
          class="refresh-btn"
        />
      </div>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="page-icon">
            <el-icon size="28"><UserFilled /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">专家管理中心</h1>
            <p class="page-subtitle">统一管理心理健康专家信息，支持专家资料的添加、编辑和查询</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ expertCount }}</div>
            <div class="stat-label">专家总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeExperts }}</div>
            <div class="stat-label">活跃专家</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ uniqueFields }}</div>
            <div class="stat-label">专业领域</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <div class="toolbar-container">
        <div class="toolbar-left">
          <el-button 
            type="primary" 
            :icon="Plus" 
            @click="showAddDialog = true"
            class="add-btn"
            size="large"
          >
            <span>添加专家</span>
          </el-button>
          <el-button-group class="filter-group">
            <el-button 
              :type="selectedField === '' ? 'primary' : ''"
              @click="filterByField('')"
              size="default"
            >
              全部
            </el-button>
            <el-button 
              v-for="field in uniqueFieldsList.slice(0, 4)"
              :key="field"
              :type="selectedField === field ? 'primary' : ''"
              @click="filterByField(field)"
              size="default"
            >
              {{ field }}
            </el-button>
          </el-button-group>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索专家姓名或专业领域..."
            :prefix-icon="Search"
            clearable
            class="search-input"
            @input="handleSearch"
          />
          <el-button 
            :icon="Grid" 
            @click="toggleViewMode"
            :type="viewMode === 'grid' ? 'primary' : ''"
            circle
          />
          <el-button 
            :icon="List" 
            @click="toggleViewMode"
            :type="viewMode === 'list' ? 'primary' : ''"
            circle
          />
        </div>
      </div>
    </div>

    <!-- 专家展示区域 -->
    <div class="content-area">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <div class="expert-grid" v-loading="loading">
          <div 
            v-for="expert in filteredExperts" 
            :key="expert.id"
            class="expert-card"
            @click="viewExpert(expert)"
          >
            <div class="card-header">
              <div class="expert-avatar">
                <img 
                  v-if="expert.icon" 
                  :src="expert.icon" 
                  :alt="expert.name"
                  @error="handleImageError"
                />
                <el-icon v-else class="default-avatar"><User /></el-icon>
              </div>
              <div class="expert-status">
                <el-tag 
                  :type="expert.status === 1 ? 'success' : 'danger'"
                  size="small"
                >
                  {{ expert.status === 1 ? '启用' : '停用' }}
                </el-tag>
              </div>
            </div>
            
            <div class="card-body">
              <h3 class="expert-name">{{ expert.name }}</h3>
              <div class="expert-field">
                <el-tag type="primary" size="small">{{ expert.field }}</el-tag>
              </div>
              <div class="expert-contact">
                <div class="contact-item">
                  <el-icon><Phone /></el-icon>
                  <span>{{ expert.contactInformation }}</span>
                </div>
              </div>
              <div class="expert-intro">
                <p>{{ expert.introduction }}</p>
              </div>
              <div class="expert-time">
                <div class="time-item">
                  <el-icon><Clock /></el-icon>
                  <span>创建: {{ formatDate(expert.createdAt) }}</span>
                </div>
                <div class="time-item" v-if="expert.updatedAt !== expert.createdAt">
                  <el-icon><Edit /></el-icon>
                  <span>更新: {{ formatDate(expert.updatedAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="expert-meta">
                <span class="create-time">{{ formatDate(expert.createdAt) }}</span>
              </div>
              <div class="expert-actions">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click.stop="editExpert(expert)"
                  :icon="Edit"
                  circle
                />
                <el-button 
                  type="danger" 
                  size="small" 
                  @click.stop="deleteExpertConfirm(expert)"
                  :icon="Delete"
                  circle
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <el-table 
          :data="filteredExperts" 
          v-loading="loading"
          class="expert-table"
          @row-click="viewExpert"
        >
          <el-table-column label="专家信息" min-width="200">
            <template #default="{ row }">
              <div class="expert-info">
                <div class="expert-avatar-small">
                  <img 
                    v-if="row.icon" 
                    :src="row.icon" 
                    :alt="row.name"
                    @error="handleImageError"
                  />
                  <el-icon v-else><User /></el-icon>
                </div>
                <div class="expert-details">
                  <div class="expert-name">{{ row.name }}</div>
                  <div class="expert-field">
                    <el-tag type="primary" size="small">{{ row.field }}</el-tag>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" min-width="180">
            <template #default="{ row }">
              <div class="contact-info">
                <div>{{ row.contactInformationType }}: {{ row.contactInformation }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="简介" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.introduction }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag 
                :type="row.status === 1 ? 'success' : 'danger'"
                size="small"
              >
                {{ row.status === 1 ? '活跃' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="120">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small" 
                @click.stop="editExpert(row)"
                :icon="Edit"
                circle
              />
              <el-button 
                type="danger" 
                size="small" 
                @click.stop="deleteExpertConfirm(row)"
                :icon="Delete"
                circle
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
      
    <!-- 空状态 -->
    <el-empty 
      v-if="!loading && filteredExperts.length === 0"
      description="暂无专家数据"
      class="empty-state"
    >
      <el-button type="primary" @click="showAddDialog = true">
        添加第一个专家
      </el-button>
    </el-empty>

    <!-- 添加/编辑专家对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑专家' : '添加专家'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="expertFormRef"
        :model="expertForm"
        :rules="formRules"
        label-width="120px"
        class="expert-form"
      >
        <el-form-item label="专家头像" prop="icon">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-change="handleAvatarChange"
            :auto-upload="false"
          >
            <img v-if="avatarPreview" :src="avatarPreview" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持 jpg、png 格式，文件大小不超过 5MB</div>
        </el-form-item>
        
        <el-form-item label="专家姓名" prop="name">
          <el-input v-model="expertForm.name" placeholder="请输入专家姓名" />
        </el-form-item>
        
        <el-form-item label="专业领域" prop="field">
          <el-input v-model="expertForm.field" placeholder="请输入专业领域" />
        </el-form-item>
        
        <el-form-item label="联系方式类型" prop="contactInformationType">
          <el-select v-model="expertForm.contactInformationType" placeholder="请选择联系方式类型">
            <el-option label="电话" value="电话" />
            <el-option label="邮箱" value="邮箱" />
            <el-option label="微信" value="微信" />
            <el-option label="QQ" value="QQ" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="联系方式" prop="contactInformation">
          <el-input v-model="expertForm.contactInformation" placeholder="请输入联系方式" />
        </el-form-item>
        
        <el-form-item label="专家介绍" prop="introduction">
          <el-input
            v-model="expertForm.introduction"
            type="textarea"
            :rows="4"
            placeholder="请输入专家介绍"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-radio-group v-model="expertForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="deleted">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ isEdit ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 专家详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="专家详情"
      width="500px"
    >
      <div class="expert-detail" v-if="currentExpert">
        <div class="detail-header">
          <div class="detail-avatar">
            <img 
              v-if="currentExpert.icon" 
              :src="currentExpert.icon" 
              :alt="currentExpert.name"
            />
            <el-icon v-else class="default-avatar"><User /></el-icon>
          </div>
          <div class="detail-info">
            <h2>{{ currentExpert.name }}</h2>
            <el-tag :type="currentExpert.status === 1 ? 'success' : 'danger'">
              {{ currentExpert.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </div>
        </div>
        
        <div class="detail-content">
          <div class="detail-item">
            <label>专业领域:</label>
            <span>{{ currentExpert.field }}</span>
          </div>
          <div class="detail-item">
            <label>{{ currentExpert.contactInformationType }}:</label>
            <span>{{ currentExpert.contactInformation }}</span>
          </div>
          <div class="detail-item">
            <label>专家介绍:</label>
            <p>{{ currentExpert.introduction }}</p>
          </div>
          <div class="detail-item">
            <label>创建时间:</label>
            <span>{{ formatDateTime(currentExpert.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <label>更新时间:</label>
            <span>{{ formatDateTime(currentExpert.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, ArrowRight, Plus, User, UserFilled, Collection, Search, Refresh, 
  Clock, Edit, View, Delete, Grid, List, Phone, Message
} from '@element-plus/icons-vue'
import { 
  getExpertList, addExpert, updateExpert, deleteExpert, 
  getExpertCount, getExpertsByField 
} from '@/api/expert'

// 路由实例
const router = useRouter()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const expertList = ref([])
const expertCount = ref(0)
const searchKeyword = ref('')
const selectedField = ref('')
const viewMode = ref('grid')
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const isEdit = ref(false)
const currentExpert = ref(null)
const avatarPreview = ref('')
const expertFormRef = ref()

// 表单数据
const expertForm = reactive({
  id: null,
  name: '',
  field: '',
  contactInformationType: '',
  contactInformation: '',
  introduction: '',
  status: 'active',
  icon: null
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入专家姓名', trigger: 'blur' }
  ],
  field: [
    { required: true, message: '请输入专业领域', trigger: 'blur' }
  ],
  contactInformationType: [
    { required: true, message: '请选择联系方式类型', trigger: 'change' }
  ],
  contactInformation: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ],
  introduction: [
    { required: true, message: '请输入专家介绍', trigger: 'blur' }
  ]
}

// 计算属性
const activeExperts = computed(() => {
  return expertList.value.filter(expert => expert.status === 1).length
})

const uniqueFieldsList = computed(() => {
  const fields = expertList.value.map(expert => expert.field)
  return [...new Set(fields)].filter(Boolean)
})

const uniqueFields = computed(() => {
  return uniqueFieldsList.value.length
})

const filteredExperts = computed(() => {
  let filtered = expertList.value
  console.log(filtered)

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(expert => 
      expert.name.toLowerCase().includes(keyword) ||
      expert.field.toLowerCase().includes(keyword)
    )
  }

  // 专业领域过滤
  if (selectedField.value) {
    filtered = filtered.filter(expert => expert.field === selectedField.value)
  }

  return filtered
})

// 方法
const loadExpertList = async () => {
  loading.value = true
  try {
    const response = await getExpertList()
    if (response && response.code === 0) {
      console.log(response.data,"getexpert专家列表")
      expertList.value = response.data || []
      console.log("加载专家列表成功expert:",expertList.value)
      // 加载完成后立即更新统计数据
      loadExpertCount()
    } else {
      console.error('获取专家列表失败:', response)
      ElMessage.error(response?.message || '获取专家列表失败')
    }
  } catch (error) {
    console.error('获取专家列表失败:', error)
    ElMessage.error('获取专家列表失败')
  } finally {
    loading.value = false
  }
}

const loadExpertCount = ()=>{
  //直接统计专家数组长度
  expertCount.value = expertList.value.length
  console.log(expertCount.value,"专家总数")
  console.log(expertList.value,"专家列表")
}

// async () => {
//   try {
//     const response = await getExpertCount()
//     if (response && response.code === 0) {
//       console.log("获取专家总数成功:", response)
//       expertCount.value = response.data || 0
//     }
//   } catch (error) {
//     console.error('获取专家总数失败:', error)
//   }
// }

const handleSearch = () => {
  // 搜索逻辑在计算属性中处理
}

const filterByField = (field) => {
  selectedField.value = field
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const goBack = () => {
  // 返回工作台逻辑
  router.push({ name: 'Dashboard' })
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedField.value = ''
}

const viewExpert = (expert) => {
  currentExpert.value = expert
  showDetailDialog.value = true
}

const editExpert = (expert) => {
  isEdit.value = true
  Object.assign(expertForm, {
    id: expert.id,
    name: expert.name,
    field: expert.field,
    contactInformationType: expert.contactInformationType,
    contactInformation: expert.contactInformation,
    introduction: expert.introduction,
    status: expert.status,
    icon: null
  })
  avatarPreview.value = expert.icon || ''
  showAddDialog.value = true
}

const deleteExpertById = async (id) => {
  try {
    const response = await deleteExpert(id)
    if (response && response.code === 0) {
      ElMessage.success('删除成功')
      await loadExpertList()
      await loadExpertCount()
    } else {
      ElMessage.error(response?.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const deleteExpertConfirm = async (expert) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除专家 "${expert.name}" 吗？此操作不可恢复。`, 
      '确认删除', 
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    await deleteExpertById(expert.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除专家失败:', error)
    }
  }
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleAvatarChange = (file) => {
  if (beforeAvatarUpload(file.raw)) {
    expertForm.icon = file.raw
    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
}

const submitForm = async () => {
  if (!expertFormRef.value) return
  
  try {
    await expertFormRef.value.validate()
    submitting.value = true
    
    const formData = {
      name: expertForm.name,
      field: expertForm.field,
      contactInformationType: expertForm.contactInformationType,
      contactInformation: expertForm.contactInformation,
      introduction: expertForm.introduction,
      status: expertForm.status,
      icon: expertForm.icon
    }
    
    let response
    if (isEdit.value) {
      formData.id = expertForm.id
      response = await updateExpert(formData)
    } else {
      response = await addExpert(formData)
    }
    
    if (response && response.code === 0) {
      ElMessage.success(isEdit.value ? '更新专家成功' : '添加专家成功')
      showAddDialog.value = false
      loadExpertList()
      loadExpertCount()
    } else {
      ElMessage.error(response?.message || (isEdit.value ? '更新专家失败' : '添加专家失败'))
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error(isEdit.value ? '更新专家失败' : '添加专家失败')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  isEdit.value = false
  Object.assign(expertForm, {
    id: null,
    name: '',
    field: '',
    contactInformationType: '',
    contactInformation: '',
    introduction: '',
    status: 'active',
    icon: null
  })
  avatarPreview.value = ''
  if (expertFormRef.value) {
    expertFormRef.value.resetFields()
  }
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex'
}

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleString('zh-CN')
}


// 生命周期
onMounted(() => {
  loadExpertList()
})
</script>

<style scoped>
.expert-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 0;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  font-size: 16px;
  font-weight: 500;
  color: #1976D2;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(25, 118, 210, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1976D2;
  margin: 0;
}

.add-btn {
  font-size: 16px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
}

/* 页面头部统计 */
.page-header {
  padding: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1976D2, #42A5F5);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1976D2;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.header-stats {
  display: flex;
  gap: 20px;
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
  color: #1976D2;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #ccc;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  background: linear-gradient(135deg, #1976D2, #42A5F5);
}

.stat-icon.active {
  background: linear-gradient(135deg, #388E3C, #66BB6A);
}

.stat-icon.fields {
  background: linear-gradient(135deg, #F57C00, #FFB74D);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1976D2;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 工具栏 */
.toolbar {
  padding: 0 24px 24px;
}

.toolbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  gap: 0;
}

.search-input {
  width: 300px;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-select {
  width: 200px;
}

.reset-btn {
  color: #666;
}

/* 专家展示区域 */
.content-area {
  padding: 0 24px 24px;
}

.grid-view {
  width: 100%;
}

.expert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 专家列表 */
.expert-list {
  padding: 0 24px 24px;
}

.expert-col {
  margin-bottom: 24px;
}

.expert-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.expert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #1976D2;
}

.expert-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1976D2, #42A5F5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.expert-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.expert-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
  flex-shrink: 0;
}

.expert-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1976D2, #42A5F5);
  color: white;
  font-size: 20px;
}

.expert-status {
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.expert-name {
  font-size: 18px;
  font-weight: 600;
  color: #1976D2;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.expert-field {
  margin: 0 0 12px 0;
}

.expert-contact {
  margin: 12px 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.contact-item .el-icon {
  color: #1976D2;
  font-size: 16px;
}

.expert-intro {
  flex: 1;
}

.expert-intro p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expert-time {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 12px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: auto;
}

.expert-meta {
  font-size: 12px;
  color: #999;
}

.expert-actions {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  margin-top: 60px;
}

/* 对话框样式 */
.expert-form .avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expert-form .avatar-uploader:hover {
  border-color: #1976D2;
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* 专家详情 */
.expert-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f0f0f0;
}

.detail-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info h2 {
  margin: 0 0 8px 0;
  color: #1976D2;
  font-size: 20px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.detail-item span,
.detail-item p {
  color: #333;
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .nav-left {
    justify-content: space-between;
  }

  .toolbar-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .toolbar-left {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .toolbar-right {
    justify-content: space-between;
  }

  .search-input {
    width: 100%;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .header-stats {
    justify-content: space-between;
  }

  .expert-grid {
    grid-template-columns: 1fr;
  }

  .expert-card {
    margin-bottom: 16px;
  }

  .card-footer {
    flex-direction: column;
  }

  .card-footer .el-button {
    width: 100%;
  }

  .nav-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}


.list-view {
  padding: 0 24px 24px;
}

.expert-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.expert-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expert-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
}

.expert-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expert-details {
  flex: 1;
}

.expert-details .expert-name {
  font-weight: 600;
  color: #1976D2;
  margin-bottom: 4px;
}

.contact-info {
  font-size: 14px;
  color: #666;
}

.contact-info .email {
  color: #999;
  font-size: 12px;
  margin-top: 2px;
}

</style>