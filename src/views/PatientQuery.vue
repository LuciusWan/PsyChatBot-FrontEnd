<template>
  <div class="patient-query-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-button 
          :icon="ArrowLeft" 
          @click="goBackToDashboard"
          class="back-btn"
          type="text"
          size="large"
        >
          返回工作台
        </el-button>
        <div class="breadcrumb">
          <span class="breadcrumb-item">工作台</span>
          <el-icon class="breadcrumb-separator"><ArrowRight /></el-icon>
          <span class="breadcrumb-item current">患者查询</span>
        </div>
      </div>
      <div class="nav-right">
        <el-button 
          :icon="Refresh" 
          @click="refreshData"
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
            <h1 class="page-title">患者查询管理</h1>
            <p class="page-subtitle">查看和管理患者信息，支持多条件筛选和数据导出</p>
          </div>
        </div>
        <div class="header-stats">
           <div class="stat-card">
             <div class="stat-number">{{ filteredPatients.length }}</div>
             <div class="stat-label">患者总数</div>
           </div>
           <div class="stat-card">
             <div class="stat-number">{{ activePatientCount }}</div>
             <div class="stat-label">正常状态</div>
           </div>
         </div>
       </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <div class="toolbar-container">
        <div class="toolbar-left">
          <el-button 
            type="success" 
            :icon="Download" 
            @click="exportToExcel"
            :loading="exportLoading"
            class="export-btn"
            size="large"
          >
            <span>导出Excel</span>
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索患者姓名、用户名或手机号..."
            :prefix-icon="Search"
            clearable
            class="search-input"
            @input="handleSearch"
          />
          <el-select
            v-model="statusFilter"
            placeholder="状态筛选"
            clearable
            @change="handleFilter"
            class="status-filter"
          >
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
          <el-select
            v-model="genderFilter"
            placeholder="性别筛选"
            clearable
            @change="handleFilter"
            class="gender-filter"
          >
            <el-option label="全部性别" value="" />
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 患者表格 -->
    <div class="patient-table-section">
      <div class="table-container">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">患者列表</span>
              <span class="patient-count">共 {{ filteredPatients.length }} 位患者</span>
            </div>
          </template>

        <el-table
          :data="paginatedPatients"
          v-loading="loading"
          stripe
          style="width: 100%"
          :empty-text="loading ? '加载中...' : '暂无患者数据'"
          @row-click="viewPatientDetail"
          class="patient-table"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          
          <el-table-column prop="name" label="姓名" min-width="100">
            <template #default="{ row }">
              <div class="name-cell">
                <el-avatar :size="32" class="patient-avatar-small">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="patient-name">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="username" label="用户名" min-width="120">
            <template #default="{ row }">
              <span class="username-text">@{{ row.username }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="gender" label="性别" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.gender === '男' ? 'primary' : 'success'" size="small">
                {{ row.gender }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="age" label="年龄" width="80" align="center">
            <template #default="{ row }">
              <span>{{ row.age }}岁</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="phone" label="手机号" min-width="130">
            <template #default="{ row }">
              <div class="contact-info">
                <el-icon><Phone /></el-icon>
                <span>{{ row.phone }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="email" label="邮箱" min-width="180">
            <template #default="{ row }">
              <div class="contact-info">
                <el-icon><Message /></el-icon>
                <span>{{ row.email }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="medicalHistory" label="病史" min-width="150">
            <template #default="{ row }">
              <el-tooltip :content="row.medicalHistory" placement="top">
                <span class="medical-history-text">{{ row.medicalHistory }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 0 ? 'success' : 'danger'" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="updateTime" label="最后更新" min-width="150">
            <template #default="{ row }">
              <div class="update-time">
                <el-icon><Clock /></el-icon>
                <span>{{ formatDateTime(row.updateTime) }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small" 
                @click.stop="viewPatientDetail(row)"
                link
              >
                <el-icon><View /></el-icon>
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div v-if="filteredPatients.length > pageSize" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredPatients.length"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
      </div>
    </div>

    <!-- 患者详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="患者详情"
      width="700px"
      :before-close="handleCloseDetail"
    >
      <div v-if="selectedPatient" class="patient-detail">
        <div class="detail-header">
          <el-avatar :size="80">
            <el-icon size="40"><User /></el-icon>
          </el-avatar>
          <div class="detail-info">
            <h3>{{ selectedPatient.name }}</h3>
            <p>@{{ selectedPatient.username }}</p>
            <el-tag :type="selectedPatient.status === 0 ? 'success' : 'danger'">
              {{ getStatusText(selectedPatient.status) }}
            </el-tag>
          </div>
        </div>
        
        <el-descriptions :column="2" border class="patient-descriptions">
          <el-descriptions-item label="患者ID">{{ selectedPatient.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ selectedPatient.username }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ selectedPatient.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ selectedPatient.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ selectedPatient.age }}岁</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedPatient.status === 0 ? 'success' : 'danger'">
              {{ getStatusText(selectedPatient.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="手机号">{{ selectedPatient.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedPatient.email }}</el-descriptions-item>
          <el-descriptions-item label="病史记录" span="2">
            <div class="medical-history-detail">
              {{ selectedPatient.medicalHistory }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="最后更新时间" span="2">
            {{ formatDateTime(selectedPatient.updateTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  UserFilled,
  Refresh,
  Search,
  User,
  Phone,
  Message,
  Clock,
  View,
  ArrowLeft,
  ArrowRight,
  Download
} from '@element-plus/icons-vue'
import { getPatientList } from '@/api/patient'
import { formatDate } from '@/utils'

// 路由
const router = useRouter()

// 响应式数据
const loading = ref(false)
const exportLoading = ref(false)
const patients = ref([])
const searchKeyword = ref('')
const statusFilter = ref('')
const genderFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const detailDialogVisible = ref(false)
const selectedPatient = ref(null)

// 计算属性
const filteredPatients = computed(() => {
  let result = patients.value

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(patient => 
      patient.name.toLowerCase().includes(keyword) ||
      patient.username.toLowerCase().includes(keyword) ||
      patient.phone.includes(keyword)
    )
  }

  // 状态过滤
  if (statusFilter.value !== '') {
    result = result.filter(patient => patient.status.toString() === statusFilter.value)
  }

  // 性别过滤
  if (genderFilter.value) {
    result = result.filter(patient => patient.gender === genderFilter.value)
  }

  return result
})

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPatients.value.slice(start, end)
})

const activePatientCount = computed(() => {
  return patients.value.filter(patient => patient.status === 0).length
})

// 方法
const loadPatients = async () => {
  loading.value = true
  try {
    const response = await getPatientList()
    if (response.code === 0) {
      patients.value = response.data || []
    } else {
      throw new Error(response.message || '获取患者列表失败')
    }
  } catch (error) {
    console.error('加载患者列表失败:', error)
    ElMessage.error('加载患者列表失败')
    patients.value = []
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadPatients()
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const getStatusText = (status) => {
  return status === 0 ? '正常' : '停用'
}

const formatDateTime = (dateTime) => {
  return formatDate(new Date(dateTime), 'YYYY-MM-DD HH:mm')
}

const viewPatientDetail = (patient) => {
  selectedPatient.value = patient
  detailDialogVisible.value = true
}

const handleCloseDetail = () => {
  detailDialogVisible.value = false
  selectedPatient.value = null
}

const goBackToDashboard = () => {
  router.push('/dashboard')
}

const exportToExcel = async () => {
  if (filteredPatients.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  exportLoading.value = true
  try {
    // 动态导入 xlsx 库
    const XLSX = await import('xlsx')
    
    // 准备导出数据
    const exportData = filteredPatients.value.map((patient, index) => ({
      '序号': index + 1,
      '姓名': patient.name,
      '用户名': patient.username,
      '性别': patient.gender,
      '年龄': `${patient.age}岁`,
      '手机号': patient.phone,
      '邮箱': patient.email,
      '病史记录': patient.medicalHistory,
      '状态': getStatusText(patient.status),
      '最后更新时间': formatDateTime(patient.updateTime)
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // 设置列宽
    const colWidths = [
      { wch: 6 },   // 序号
      { wch: 12 },  // 姓名
      { wch: 15 },  // 用户名
      { wch: 8 },   // 性别
      { wch: 8 },   // 年龄
      { wch: 15 },  // 手机号
      { wch: 25 },  // 邮箱
      { wch: 30 },  // 病史记录
      { wch: 8 },   // 状态
      { wch: 20 }   // 最后更新时间
    ]
    ws['!cols'] = colWidths

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '患者信息')

    // 生成文件名（包含当前日期时间）
    const now = new Date()
    const fileName = `患者信息_${formatDate(now, 'YYYY-MM-DD_HH-mm-ss')}.xlsx`

    // 导出文件
    XLSX.writeFile(wb, fileName)
    
    ElMessage.success(`成功导出 ${filteredPatients.value.length} 条患者信息`)
  } catch (error) {
    console.error('导出Excel失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  } finally {
    exportLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadPatients()
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.patient-query-container {
  min-height: 100vh;
  background: var(--background-color);
  padding: 0;
}

// 顶部导航栏样式
.top-nav {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .back-btn {
      color: #409eff;
      font-size: 14px;
      padding: 8px 12px;
      
      &:hover {
        background-color: #ecf5ff;
        color: #337ecc;
      }
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      
      .breadcrumb-item {
        color: #909399;
        
        &.current {
          color: #303133;
          font-weight: 500;
        }
      }
      
      .breadcrumb-separator {
        color: #c0c4cc;
        font-size: 12px;
      }
    }
  }
  
  .nav-right {
    .refresh-btn {
      color: #909399;
      
      &:hover {
        color: #409eff;
        background-color: #ecf5ff;
      }
    }
  }
}

// 页面头部样式
.page-header {
  background: #fff;
  padding: 24px;
  margin-bottom: 0;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .page-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #409eff, #67c23a);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      
      .header-text {
        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }
        
        .page-subtitle {
          color: var(--text-secondary);
          font-size: 14px;
          margin: 0;
        }
      }
    }
    
    .header-stats {
      display: flex;
      gap: 24px;
      
      .stat-card {
        text-align: center;
        
        .stat-number {
          font-size: 24px;
          font-weight: 600;
          color: #409eff;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }
    }
  }
}

// 工具栏样式
.toolbar {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 16px 24px;
  margin-bottom: 24px;
  
  .toolbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .toolbar-left {
      .export-btn {
        background: #67c23a;
        border-color: #67c23a;
        
        &:hover {
          background: #5daf34;
          border-color: #5daf34;
        }
      }
    }
    
    .toolbar-right {
      display: flex;
      gap: 12px;
      align-items: center;
      
      .search-input {
        width: 300px;
      }
      
      .status-filter,
      .gender-filter {
        width: 120px;
      }
    }
  }
}

.search-section {
  margin-bottom: var(--spacing-lg);
  
  .search-card {
    border-radius: var(--border-radius-large);
    border: none;
    box-shadow: var(--shadow-light);
    
    .search-content {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
      
      .search-left {
        flex: 1;
        
        .search-input {
          max-width: 400px;
        }
      }
      
      .search-right {
        display: flex;
        gap: var(--spacing-sm);
        
        .status-filter,
        .gender-filter {
          width: 120px;
        }
      }
    }
  }
}

.patient-table {
  :deep(.el-table__row) {
    cursor: pointer;
    
    &:hover {
      background-color: var(--background-color);
    }
  }
  
  .name-cell {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    .patient-avatar-small {
      flex-shrink: 0;
    }
    
    .patient-name {
      font-weight: 500;
      color: var(--text-primary);
    }
  }
  
  .username-text {
    color: var(--text-secondary);
    font-family: monospace;
  }
  
  .contact-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    
    .el-icon {
      color: var(--primary-color);
      font-size: 14px;
    }
  }
  
  .medical-history-text {
    display: block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .update-time {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 14px;
    color: var(--text-secondary);
    
    .el-icon {
      color: var(--info-color);
      font-size: 14px;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.patient-detail {
  .detail-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-light);
    
    .detail-info {
      h3 {
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--text-primary);
        font-size: 20px;
      }
      
      p {
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--text-secondary);
        font-family: monospace;
      }
    }
  }
  
  .patient-descriptions {
    .medical-history-detail {
      padding: var(--spacing-sm);
      background: var(--background-color);
      border-radius: var(--border-radius-small);
      color: var(--text-secondary);
      line-height: 1.5;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

// 响应式设计
@media (max-width: 768px) {
  .patient-query-container {
    padding: var(--spacing-md);
  }
  
  .search-content {
    flex-direction: column;
    align-items: stretch !important;
    
    .search-right {
      justify-content: space-between;
    }
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start !important;
    gap: var(--spacing-md);
  }
  
  .patient-table {
    :deep(.el-table__body-wrapper) {
      overflow-x: auto;
    }
  }
}
</style>