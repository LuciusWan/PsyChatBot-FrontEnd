<template>
  <div class="file-management">
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
          <span class="breadcrumb-item current">文件管理</span>
        </div>
      </div>
      <div class="nav-right">
        <el-button 
          :icon="Refresh" 
          @click="loadFileList"
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
            <el-icon size="28"><Files /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">文件管理中心</h1>
            <p class="page-subtitle">统一管理心理治疗相关的文档资料，支持在线预览和下载</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ fileList.length }}</div>
            <div class="stat-label">总文件数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ activeFileCount }}</div>
            <div class="stat-label">正常文件</div>
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
            :icon="Upload" 
            @click="showUploadDialog = true"
            class="upload-btn"
            size="large"
          >
            <span>上传文件</span>
          </el-button>
          <el-button 
            type="success" 
            :icon="Link"
            @click="openDesensitizationSystem"
            class="desensitization-btn"
            size="large"
          >
            <span>文档脱敏系统</span>
          </el-button>
          <el-button-group class="filter-group">
            <el-button 
              :type="selectedCategory === 'all' ? 'primary' : ''"
              @click="filterByCategory('all')"
              size="default"
            >
              全部
            </el-button>
            <el-button 
              :type="selectedCategory === 'psy-doc' ? 'primary' : ''"
              @click="filterByCategory('psy-doc')"
              size="default"
            >
              心理文档
            </el-button>
            <el-button 
              :type="selectedCategory === 'treatment' ? 'primary' : ''"
              @click="filterByCategory('treatment')"
              size="default"
            >
              治疗方案
            </el-button>
            <el-button 
              :type="selectedCategory === 'other' ? 'primary' : ''"
              @click="filterByCategory('other')"
              size="default"
            >
              其他
            </el-button>
          </el-button-group>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文件名..."
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

    <!-- 文件展示区域 -->
    <div class="content-area">
      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="list-view">
        <el-table 
          :data="filteredFileList" 
          v-loading="loading"
          class="file-table"
          @row-click="handleRowClick"
          :header-cell-style="{ 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
            color: '#495057',
            fontWeight: '600',
            fontSize: '14px',
            padding: '20px 16px',
            borderBottom: '2px solid #dee2e6'
          }"
          :cell-style="{ padding: '20px 16px' }"
          :row-style="{ cursor: 'pointer' }"
          empty-text="暂无文件数据"
        >
          <el-table-column prop="fileName" label="文件信息" min-width="320">
            <template #default="{ row }">
              <div class="file-info-cell">
                <div class="file-icon-wrapper">
                  <el-icon class="file-icon" :class="getFileIconClass(row.fileType)">
                    <Document />
                  </el-icon>
                </div>
                <div class="file-details">
                  <div class="file-name">{{ row.fileName }}</div>
                  <div class="file-meta">
                    <el-tag size="small" class="file-size-tag">{{ formatFileSize(row.fileSize) }}</el-tag>
                    <el-tag size="small" :type="getFileTypeColor(row.fileType)" class="file-type-tag">
                      {{ row.fileType.toUpperCase() }}
                    </el-tag>
                    <span class="upload-time">{{ formatDate(row.fileCreateTime) }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="category" label="分类" width="140" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getCategoryColor(row.category)" 
                size="default"
                effect="light"
                round
                class="category-tag"
              >
                {{ getCategoryName(row.category) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="doctorName" label="上传医生" width="160" align="center">
            <template #default="{ row }">
              <div class="doctor-info">
                <el-avatar :size="36" class="doctor-avatar">
                  {{ row.doctorName ? row.doctorName.charAt(0) : 'U' }}
                </el-avatar>
                <div class="doctor-details">
                  <div class="doctor-name">{{ row.doctorName || '未知医生' }}</div>
                  <div class="doctor-role">{{ row.doctorTitle || '医师' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="fileStatus" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="row.fileStatus === 'active' ? 'success' : 'danger'" 
                size="default"
                effect="light"
                round
                class="status-tag"
              >
                <el-icon class="status-icon">
                  <CircleCheck v-if="row.fileStatus === 'active'" />
                  <CircleClose v-else />
                </el-icon>
                {{ row.fileStatus === 'active' ? '正常' : '异常' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-tooltip content="预览文件" placement="top">
                  <el-button 
                    type="primary" 
                    :icon="View"
                    @click.stop="viewFile(row)"
                    circle
                    size="small"
                  />
                </el-tooltip>
                <el-tooltip content="下载文件" placement="top">
                  <el-button 
                    type="success" 
                    :icon="Download"
                    @click.stop="downloadFile(row)"
                    circle
                    size="small"
                  />
                </el-tooltip>
                <el-tooltip content="删除文件" placement="top">
                  <el-button 
                    type="danger" 
                    :icon="Delete"
                    @click.stop="handleDelete(row)"
                    circle
                    size="small"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 网格视图 -->
      <div v-else class="grid-view">
        <div class="file-grid">
          <div 
            v-for="file in filteredFileList" 
            :key="file.id" 
            class="file-card"
            @click="viewFile(file)"
          >
            <div class="card-header">
              <div class="file-icon-large">
                <el-icon :class="getFileIconClass(file.fileType)">
                  <Document />
                </el-icon>
              </div>
              <div class="card-actions">
                <el-dropdown trigger="click">
                  <el-button type="text" :icon="MoreFilled" circle size="small" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click.stop="viewFile(file)">
                        <el-icon><View /></el-icon>预览
                      </el-dropdown-item>
                      <el-dropdown-item @click.stop="downloadFile(file)">
                        <el-icon><Download /></el-icon>下载
                      </el-dropdown-item>
                      <el-dropdown-item @click.stop="handleDelete(file)" divided>
                        <el-icon><Delete /></el-icon>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
            <div class="card-body">
              <div class="file-name-grid">{{ file.fileName }}</div>
              <div class="file-info-grid">
                <div class="info-row">
                  <span class="info-label">大小:</span>
                  <span class="info-value">{{ formatFileSize(file.fileSize) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">类型:</span>
                  <el-tag size="small" :type="getFileTypeColor(file.fileType)">
                    {{ file.fileType.toUpperCase() }}
                  </el-tag>
                </div>
                <div class="info-row">
                  <span class="info-label">分类:</span>
                  <el-tag size="small" :type="getCategoryColor(file.category)">
                    {{ getCategoryName(file.category) }}
                  </el-tag>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="upload-info">
                <el-avatar :size="20" class="mini-avatar">
                  {{ file.doctorName ? file.doctorName.charAt(0) : 'U' }}
                </el-avatar>
                <div class="doctor-info-grid">
                  <span class="upload-text">{{ file.doctorName || '未知医生' }}</span>
                  <span class="doctor-title-grid">{{ file.doctorTitle || '医师' }}</span>
                </div>
              </div>
              <div class="upload-date">{{ formatDate(file.fileCreateTime) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传文件对话框 -->
    <el-dialog 
      v-model="showUploadDialog" 
      title="上传文件" 
      width="500px"
      :before-close="handleUploadClose"
    >
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="80px">
        <el-form-item label="文件分类" prop="category">
          <el-select v-model="uploadForm.category" placeholder="请选择文件分类" style="width: 100%">
            <el-option label="心理文档" value="psy-doc" />
            <el-option label="心理文本" value="psyText" />
            <el-option label="治疗方案" value="treatment" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="选择文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :limit="1"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            drag
            class="upload-area"
          >
            <el-icon class="el-icon--upload" style="font-size: 48px;">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 PDF、Word、文本、图片格式，文件大小不超过 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleUploadClose">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleUpload"
            :loading="uploading"
          >
            {{ uploading ? '上传中...' : '确定上传' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文件详情对话框 -->
    <el-dialog 
      v-model="showDetailDialog" 
      title="文件详情" 
      width="600px"
    >
      <div v-if="currentFile" class="file-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="文件名">
            {{ currentFile.fileName }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="文件ID">
            {{ currentFile.fileId }}
          </el-descriptions-item> -->
          <el-descriptions-item label="上传医生">
            <div class="doctor-detail-info">
              <span class="doctor-name-detail">{{ currentFile.doctorName || '未知医生' }}</span>
              <span class="doctor-title-detail">{{ currentFile.doctorTitle || '医师' }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="文件大小">
            {{ formatFileSize(currentFile.fileSize) }}
          </el-descriptions-item>
          <el-descriptions-item label="文件类型">
            {{ currentFile.fileType }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentFile.fileStatus === 'active' ? 'success' : 'danger'">
              {{ currentFile.fileStatus === 'active' ? '正常' : '异常' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentFile.fileCreateTime }}
          </el-descriptions-item>
          <el-descriptions-item label="分类">
            {{ getCategoryName(currentFile.category) }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="文件路径" span="2">
            <el-link :href="currentFile.filePath" target="_blank" type="primary">
              {{ currentFile.filePath }}
            </el-link>
          </el-descriptions-item> -->
        </el-descriptions>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button 
            type="primary" 
            @click="downloadFile(currentFile)"
          >
            下载文件
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Upload, 
  Refresh, 
  Document, 
  View, 
  Download, 
  Delete,
  UploadFilled,
  ArrowLeft,
  ArrowRight,
  Files,
  Search,
  Grid,
  List,
  MoreFilled,
  CircleCheck,
  CircleClose,
  Link
} from '@element-plus/icons-vue'
import { 
  uploadFile, 
  getFileList, 
  getFileInfo, 
  deleteFile,
  getDoctorInfo,
  getDoctorInfoById
} from '@/api/doctor'

const router = useRouter()

// 医生信息
const doctorInfo = ref({
  name: '',
  title: '',
  department: '',
  username: ''
})

// 医生信息缓存 - 用于缓存根据ID查询的医生信息
const doctorInfoCache = ref(new Map())

// 响应式数据
const loading = ref(false)
const uploading = ref(false)
const fileList = ref([])
const showUploadDialog = ref(false)
const showDetailDialog = ref(false)
const currentFile = ref(null)
const searchKeyword = ref('')
const selectedCategory = ref('all')
const viewMode = ref('list') // 'list' 或 'grid'

// 表单数据
const uploadForm = reactive({
  category: 'psy-doc',
  file: null
})

// 表单验证规则
const uploadRules = {
  category: [
    { required: true, message: '请选择文件分类', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请选择要上传的文件', trigger: 'change' }
  ]
}

// 表单引用
const uploadFormRef = ref()
const uploadRef = ref()

// 计算属性
const activeFileCount = computed(() => {
  return fileList.value.filter(file => file.fileStatus === 'active').length
})

const filteredFileList = computed(() => {
  let filtered = fileList.value

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(file => file.category === selectedCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(file => 
      file.fileName.toLowerCase().includes(keyword) ||
      file.doctorName?.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 导航方法
const goBack = () => {
  router.push('/dashboard')
}

const filterByCategory = (category) => {
  selectedCategory.value = category
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const getFileIconClass = (fileType) => {
  const typeMap = {
    'pdf': 'file-pdf',
    'doc': 'file-word',
    'docx': 'file-word',
    'xls': 'file-excel',
    'xlsx': 'file-excel',
    'ppt': 'file-powerpoint',
    'pptx': 'file-powerpoint',
    'txt': 'file-text',
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'png': 'file-image',
    'gif': 'file-image'
  }
  return typeMap[fileType?.toLowerCase()] || 'file-default'
}

// 根据医生ID获取医生信息
const getDoctorInfoByIdCached = async (doctorId) => {
  if (!doctorId) return { name: '未知医生', title: '医师' }
  
  // 检查缓存
  if (doctorInfoCache.value.has(doctorId)) {
    return doctorInfoCache.value.get(doctorId)
  }
  
  try {
    const response = await getDoctorInfoById(doctorId)
    if (response && response.code === 0 && response.data) {
      const doctorInfo = {
        name: response.data.name || '未知医生',
        title: response.data.title || '医师'
      }
      // 缓存医生信息
      doctorInfoCache.value.set(doctorId, doctorInfo)
      return doctorInfo
    }
  } catch (error) {
    console.error(`获取医生ID ${doctorId} 信息失败:`, error)
  }
  
  // 返回默认信息
  const defaultInfo = { name: '未知医生', title: '医师' }
  doctorInfoCache.value.set(doctorId, defaultInfo)
  return defaultInfo
}

// 加载文件列表
const loadFileList = async () => {
  try {
    loading.value = true
    const response = await getFileList()
    console.log('加载文件列表API响应:', response)
    
    // 检查API响应格式
    if (response && response.code === 0) {
      const files = response.data || []
      
      // 为每个文件获取医生信息
      const filesWithDoctorInfo = await Promise.all(
        files.map(async (file) => {
          const doctorInfo = await getDoctorInfoByIdCached(file.doctorId)
          return {
            ...file,
            doctorName: doctorInfo.name,
            doctorTitle: doctorInfo.title
          }
        })
      )
      
      fileList.value = filesWithDoctorInfo
      console.log('文件列表加载成功:', fileList.value)
    } else {
      console.error('API返回错误:', response)
      ElMessage.error(response?.message || '加载文件列表失败')
      fileList.value = []
    }
  } catch (error) {
    console.error('加载文件列表失败:', error)
    ElMessage.error('加载文件列表失败')
    fileList.value = []
  } finally {
    loading.value = false
  }
}

// 文件上传相关方法
const handleFileChange = (file) => {
  uploadForm.file = file.raw
}

const handleFileRemove = () => {
  uploadForm.file = null
}

const handleUpload = async () => {
  if (!uploadFormRef.value) return
  
  try {
    await uploadFormRef.value.validate()
    
    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('category', uploadForm.category)
    
    uploading.value = true
    const response = await uploadFile(formData)
    console.log('文件上传API响应:', response)
    
    if (response && response.code === 0) {
      ElMessage.success('文件上传成功')
      showUploadDialog.value = false
      resetUploadForm()
      loadFileList()
    } else {
      console.error('文件上传失败:', response)
      ElMessage.error(response?.message || '文件上传失败')
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败')
  } finally {
    uploading.value = false
  }
}

const handleUploadClose = () => {
  showUploadDialog.value = false
  resetUploadForm()
}

const resetUploadForm = () => {
  uploadForm.category = 'psy-doc'
  uploadForm.file = null
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields()
  }
}

// 查看文件详情
const viewFile = async (row) => {
  try {
    const response = await getFileInfo(row.id)
    console.log('获取文件详情API响应:', response)
    
    if (response && response.code === 0) {
      const fileDetail = response.data || response
      
      // 如果文件详情中没有医生信息，从列表中获取
      if (!fileDetail.doctorName && row.doctorName) {
        fileDetail.doctorName = row.doctorName
        fileDetail.doctorTitle = row.doctorTitle
      }
      
      currentFile.value = fileDetail
      showDetailDialog.value = true
    } else {
      console.error('获取文件详情失败:', response)
      ElMessage.error(response?.message || '获取文件详情失败')
    }
  } catch (error) {
    console.error('获取文件详情失败:', error)
    ElMessage.error('获取文件详情失败')
  }
}

// 下载文件
const downloadFile = async (row) => {
  try {
    let fileInfo = row
    
    // 如果没有filePath，需要先获取文件详情
    if (!fileInfo.filePath) {
      const response = await getFileInfo(row.id || row.fileId)
      console.log('下载文件-获取详情API响应:', response)
      
      if (response && response.code === 0) {
        fileInfo = response.data || response
      } else {
        ElMessage.error(response?.message || '获取文件信息失败')
        return
      }
    }
    
    // 检查文件路径是否存在
    if (!fileInfo.filePath) {
      ElMessage.error('文件路径不存在，无法下载')
      return
    }
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = fileInfo.filePath
    link.download = fileInfo.fileName
    link.target = '_blank'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('开始下载文件')
  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error('下载文件失败，请检查文件是否存在')
  }
}

// 删除文件
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件 "${row.fileName}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const response = await deleteFile(row.id)
    console.log('删除文件API响应:', response)
    
    if (response && response.code === 0) {
      ElMessage.success('文件删除成功')
      loadFileList()
    } else {
      console.error('删除文件失败:', response)
      ElMessage.error(response?.message || '文件删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文件失败:', error)
      ElMessage.error('删除文件失败')
    }
  }
}

// 行点击事件
const handleRowClick = (row) => {
  viewFile(row)
}

// 工具方法
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileTypeColor = (fileType) => {
  const typeMap = {
    '.pdf': 'danger',
    '.doc': 'primary',
    '.docx': 'primary',
    '.txt': 'info',
    '.png': 'success',
    '.jpg': 'success',
    '.jpeg': 'success'
  }
  return typeMap[fileType] || 'info'
}

const getCategoryName = (category) => {
  const categoryMap = {
    'psy-doc': '心理文档',
    'psyText': '心理文本',
    'treatment': '治疗方案',
    'other': '其他'
  }
  return categoryMap[category] || category
}

const getCategoryColor = (category) => {
  const colorMap = {
    'psy-doc': 'primary',
    'psyText': 'success',
    'treatment': 'warning',
    'other': 'info'
  }
  return colorMap[category] || 'info'
}

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载医生信息
const loadDoctorInfo = async () => {
  try {
    const response = await getDoctorInfo()
    if (response && response.code === 0 && response.data) {
      doctorInfo.value = {
        name: response.data.name,
        title: response.data.title,
        department: response.data.department,
        username: response.data.username
      }
    }
  } catch (error) {
    console.error('获取医生信息失败:', error)
    // 如果API调用失败，使用默认信息
    doctorInfo.value = {
      name: '医生',
      title: '医生',
      department: '心理科',
      username: 'doctor'
    }
  }
}

// 打开文档脱敏系统
const openDesensitizationSystem = () => {
  const url = 'http://116.234.79.59:5000/'
  window.open(url, '_blank')
  ElMessage.success('正在打开文档脱敏系统...')
}

// 生命周期
onMounted(async () => {
  await loadDoctorInfo()
  loadFileList()
})
</script>

<style scoped>
.file-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
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

.refresh-btn {
  background: rgba(76, 175, 80, 0.1);
  border: none;
  color: #2E7D32;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  transform: rotate(180deg);
}

/* 页面头部 */
.page-header {
  padding: 32px 24px;
  background: linear-gradient(135deg, #e5fae6 0%, #C8E6C9 100%);
  color: #44db4e;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.page-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  border-radius: inherit;
}

.page-icon:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 32px rgba(76, 175, 80, 0.4);
}

.page-icon .el-icon {
  color: white;
  z-index: 1;
  position: relative;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #000000;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.page-subtitle {
  font-size: 16px;
  color: #000000;
  margin: 0;
  line-height: 1.5;
  opacity: 0.9;
}

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.4);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  min-width: 100px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #000000;
}

.stat-label {
  font-size: 14px;
  color: #000000;
  opacity: 0.8;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}

.toolbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  gap: 40px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.desensitization-btn {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  transition: all 0.3s ease;
  color: white;
}

.desensitization-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
}

.filter-group {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

/* 内容区域 */
.content-area {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 列表视图 */
.list-view {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.file-table {
  border-radius: 12px;
  overflow: hidden;
}

.file-table :deep(.el-table__header) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.file-table :deep(.el-table__row) {
  transition: all 0.3s ease;
}

.file-table :deep(.el-table__row:hover) {
  background: rgba(64, 158, 255, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-info-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon {
  font-size: 24px;
  color: white !important;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.file-size-tag {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: none;
  font-size: 12px;
}

.file-type-tag {
  font-size: 12px;
  font-weight: 500;
}

.upload-time {
  font-size: 12px;
  color: #999;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-avatar {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.doctor-details {
  text-align: left;
}

.doctor-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 2px;
}

.doctor-role {
  font-size: 12px;
  color: #999;
}

.category-tag, .status-tag {
  font-weight: 500;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-icon {
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 网格视图 */
.grid-view {
  padding: 0;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.file-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.file-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: rgba(64, 158, 255, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.file-icon-large {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon-large .el-icon {
  font-size: 32px;
  color: white !important;
}

.card-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-card:hover .card-actions {
  opacity: 1;
}

.card-body {
  margin-bottom: 16px;
}

.file-name-grid {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.file-info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #2c3e50;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.upload-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.doctor-info-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-avatar {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.upload-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.doctor-title-grid {
  font-size: 10px;
  color: #999;
  font-weight: 400;
}

.upload-date {
  font-size: 12px;
  color: #999;
}

/* 文件详情对话框样式 */
.doctor-detail-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doctor-name-detail {
  font-weight: 500;
  color: #2c3e50;
}

.doctor-title-detail {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 12px 16px;
  }
  
  .nav-left {
    gap: 12px;
  }
  
  .breadcrumb {
    display: none;
  }
  
  .page-header {
    padding: 24px 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .toolbar-left, .toolbar-right {
    width: 100%;
    justify-content: center;
  }
  
  .search-input {
    width: 100%;
    max-width: 300px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .file-grid {
    grid-template-columns: 1fr;
  }
  
  .file-table :deep(.el-table__header-wrapper) {
    overflow-x: auto;
  }
}

/* 文件类型图标颜色 */
.file-pdf {
  color: #E57373;
}

.file-word {
  color: #64B5F6;
}

.file-excel {
  color: #81C784;
}

.file-powerpoint {
  color: #FFB74D;
}

.file-text {
  color: #90A4AE;
}

.file-image {
  color: #BA68C8;
}

.file-default {
  color: #BDBDBD;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-card {
  animation: fadeInUp 0.5s ease-out;
}

.file-table :deep(.el-table__row) {
  animation: fadeInUp 0.3s ease-out;
}

/* 加载状态 */
.el-loading-mask {
  border-radius: 12px;
}

/* 空状态 */
.el-table__empty-text {
  color: #999;
  font-size: 16px;
  padding: 40px 0;
}
</style>