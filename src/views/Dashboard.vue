<template>
  <div class="dashboard-container">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="dashboard-header">
        <div class="header-left">
          <h1 class="system-title">
            <el-icon><Stethoscope /></el-icon>
            心理医生管理系统
          </h1>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="36" :src="avatarUrl">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ displayDoctorInfo.name || displayDoctorInfo.userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 主要内容区域 -->
      <el-main class="dashboard-main">
        <div class="welcome-section">
          <el-card class="welcome-card">
            <div class="welcome-content">
              <div class="welcome-text">
                <h2>欢迎回来，{{ displayDoctorInfo.name || displayDoctorInfo.userName }}{{ displayDoctorInfo.title ? displayDoctorInfo.title : '医生' }}</h2>
                <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
                <p v-if="displayDoctorInfo.department" class="department-info">{{ displayDoctorInfo.department }}</p>
              </div>
              <div class="welcome-icon">
                <el-icon size="64" color="var(--primary-color)">
                  <Sunny />
                </el-icon>
              </div>
            </div>
          </el-card>
        </div>
        
        <!-- 快捷功能区 -->
        <div class="quick-actions">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            快捷功能
          </h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="action in quickActions" :key="action.key">
              <el-card class="action-card" @click="navigateTo(action.route)">
                <div class="action-content">
                  <div class="action-icon">
                    <el-icon :size="28" :color="action.color">
                      <component :is="action.icon" />
                    </el-icon>
                  </div>
                  <div class="action-text">
                    <h3>{{ action.title }}</h3>
                    <p>{{ action.description }}</p>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 数据统计区 -->
        <div class="statistics-section">
          <h3 class="section-title">
            <el-icon><TrendCharts /></el-icon>
            数据统计
          </h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="stat in statistics" :key="stat.key">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon :size="24" :color="stat.color">
                      <component :is="stat.icon" />
                    </el-icon>
                  </div>
                  <div class="stat-data">
                    <div class="stat-number" v-loading="stat.loading">
                      {{ stat.loading ? '--' : stat.value }}
                    </div>
                    <div class="stat-label">{{ stat.label }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        

      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  Sunny,
  ChatDotRound,
  Calendar,
  Document,
  Edit,
  Notebook,
  TrendCharts,
  UserFilled,
  Clock,
  Star
} from '@element-plus/icons-vue'
import { formatDate } from '@/utils'
import { getDoctorInfo, getPaperCount, getQuestionCount, getFileCount, getPatientCount } from '@/api/doctor'
import { getMessageCount } from '@/api/message'
import { getExpertCount } from '@/api/expert'

const router = useRouter()
const store = useStore()

// 医生信息
const doctorInfo = ref({
  name: '',
  title: '',
  department: '',
  username: ''
})

// 当前用户信息（从store获取，作为备用）
const currentUser = computed(() => store.getters.currentUser)

// 显示的医生信息（优先使用API获取的信息）
const displayDoctorInfo = computed(() => {
  if (doctorInfo.value.name) {
    return doctorInfo.value
  }
  return currentUser.value
})

// 当前日期
const currentDate = ref('')

// 头像URL（可以根据实际需求设置）
const avatarUrl = ref('')

// 快捷操作
const quickActions = ref([
  {
    key: 'patient-query',
    title: '患者查询',
    description: '查看和管理患者信息',
    icon: 'UserFilled',
    color: 'var(--primary-color)',
    route: '/patient-query'
  },
  {
    key: 'patient-message',
    title: '患者留言',
    description: '查看和回复患者留言',
    icon: 'ChatDotRound',
    color: '#67C23A',
    route: '/patient-message'
  },
  {
    key: 'file-management',
    title: '文件管理',
    description: '上传和管理治疗文档资料',
    icon: 'Document',
    color: 'var(--accent-color)',
    route: '/file-management'
  },
  {
    key: 'paper-query',
    title: '试卷查询',
    description: '查看和管理心理测评量表',
    icon: 'Notebook',
    color: 'var(--secondary-color)',
    route: '/paper-query'
  },
  {
    key: 'paper-management',
    title: '试卷管理',
    description: '创建和管理心理测评量表',
    icon: 'Edit',
    color: 'var(--info-color)',
    route: '/paper-management'
  },
  {
    key: 'expert-management',
    title: '专家管理',
    description: '管理心理健康专家信息',
    icon: 'UserFilled',
    color: '#E6A23C',
    route: '/expert-management'
  }
])

// 统计数据
const statistics = ref([
  {
    key: 'patients',
    label: '患者数量',
    value: '0',
    icon: 'UserFilled',
    color: 'var(--primary-color)',
    loading: false
  },
  {
    key: 'messages',
    label: '留言数量',
    value: '0',
    icon: 'ChatDotRound',
    color: '#67C23A',
    loading: false
  },
  {
    key: 'files',
    label: '文件数量',
    value: '0',
    icon: 'Document',
    color: 'var(--accent-color)',
    loading: false
  },
  {
    key: 'papers',
    label: '试卷数量',
    value: '0',
    icon: 'Notebook',
    color: 'var(--secondary-color)',
    loading: false
  },
  {
    key: 'questions',
    label: '题目数量',
    value: '0',
    icon: 'Edit',
    color: 'var(--info-color)',
    loading: false
  },
  {
    key: 'experts',
    label: '专家数量',
    value: '0',
    icon: 'UserFilled',
    color: '#E6A23C',
    loading: false
  }
])

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await store.dispatch('logout')
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch {
        // 用户取消
      }
      break
  }
}

// 处理快捷操作
const handleQuickAction = (actionKey) => {
  ElMessage.info(`${actionKey} 功能开发中...`)
}

// 导航到指定页面
const navigateTo = (route) => {
  router.push(route)
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
    // 如果API调用失败，使用store中的用户信息作为备用
    if (currentUser.value) {
      doctorInfo.value = {
        name: currentUser.value.name || currentUser.value.userName,
        title: '医生', // 默认职称
        department: '心理科', // 默认科室
        username: currentUser.value.userName
      }
    }
    ElMessage.warning('无法获取详细医生信息，使用基本信息显示')
  }
}

// 加载统计数据
const loadStatistics = async () => {
  const loadFunctions = [
    { key: 'patients', fn: getPatientCount },
    { key: 'messages', fn: getMessageCount },
    { key: 'files', fn: getFileCount },
    { key: 'papers', fn: getPaperCount },
    { key: 'questions', fn: getQuestionCount },
    { key: 'experts', fn: getExpertCount }
  ]

  // 并行加载所有统计数据
  const promises = loadFunctions.map(async ({ key, fn }) => {
    const stat = statistics.value.find(s => s.key === key)
    if (stat) {
      stat.loading = true
      try {
        const response = await fn()
        if (response && response.code === 0) {
          if (key === 'questions') {
            // 题目数量通过试卷接口获取，计算所有试卷的题目总数
            if (Array.isArray(response.data)) {
              const totalQuestions = response.data.reduce((sum, paper) => {
                return sum + (paper.totalQuestions || 0)
              }, 0)
              stat.value = totalQuestions.toString()
            } else {
              stat.value = '0'
            }
          } else if (key === 'messages') {
            // 留言数量
            if (typeof response.data === 'number') {
              stat.value = response.data.toString()
            } else if (response.data && typeof response.data.count === 'number') {
              stat.value = response.data.count.toString()
            } else if (response.data && typeof response.data.total === 'number') {
              stat.value = response.data.total.toString()
            } else if (Array.isArray(response.data)) {
              stat.value = response.data.length.toString()
            } else {
              stat.value = '0'
            }
          } else {
            // 其他统计项直接使用数组长度或数字
            if (Array.isArray(response.data)) {
              stat.value = response.data.length.toString()
            } else if (typeof response.data === 'number') {
              stat.value = response.data.toString()
            } else if (response.data && typeof response.data.count === 'number') {
              stat.value = response.data.count.toString()
            } else if (response.data && typeof response.data.total === 'number') {
              stat.value = response.data.total.toString()
            } else {
              stat.value = '0'
            }
          }
        } else {
          stat.value = '0'
        }
      } catch (error) {
        console.error(`获取${stat.label}失败:`, error)
        stat.value = '0'
      } finally {
        stat.loading = false
      }
    }
  })

  await Promise.all(promises)
}

// 初始化页面数据
const initPageData = async () => {
  currentDate.value = formatDate(new Date(), 'YYYY年MM月DD日')
  await Promise.all([
    loadDoctorInfo(),
    loadStatistics()
  ])
}

onMounted(() => {
  initPageData()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  height: 100vh;
  background: var(--background-color);
}

.dashboard-header {
  background: var(--surface-color);
  box-shadow: var(--shadow-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  
  .header-left {
    .system-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-medium);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--border-light);
      }
      
      .username {
        font-weight: 500;
        color: var(--text-primary);
      }
    }
  }
}

.dashboard-main {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: var(--spacing-xl);
  
  .welcome-card {
    border-radius: var(--border-radius-large);
    border: none;
    box-shadow: var(--shadow-light);
    
    :deep(.el-card__body) {
      padding: var(--spacing-xl);
    }
    
    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .welcome-text {
        h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-sm);
        }
        
        p {
          color: var(--text-secondary);
          font-size: 16px;
        }
        
        .department-info {
          color: var(--primary-color);
          font-size: 14px;
          font-weight: 500;
          margin-top: var(--spacing-xs);
        }
      }
      
      .welcome-icon {
        opacity: 0.8;
      }
    }
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  padding-left: var(--spacing-xs);
  
  .el-icon {
    color: var(--primary-color);
  }
}

.quick-actions {
  margin-bottom: var(--spacing-xl);
  
  .action-card {
    border-radius: var(--border-radius-large);
    border: none;
    box-shadow: var(--shadow-light);
    cursor: pointer;
    transition: all 0.3s ease;
    height: 110px;
    margin-bottom: var(--spacing-md);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
    
    :deep(.el-card__body) {
      padding: var(--spacing-md) var(--spacing-lg);
      height: 100%;
      display: flex;
      align-items: center;
    }
    
    .action-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      width: 100%;
      
      .action-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius-medium);
        background: rgba(127, 179, 211, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .action-text {
        flex: 1;
        
        h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
          line-height: 1.2;
        }
        
        p {
          color: var(--text-secondary);
          font-size: 13px;
          margin: 0;
          line-height: 1.3;
        }
      }
    }
  }
}

.statistics-section {
  .stat-card {
    border-radius: var(--border-radius-large);
    border: none;
    box-shadow: var(--shadow-light);
    height: 110px;
    margin-bottom: var(--spacing-md);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
    
    :deep(.el-card__body) {
      padding: var(--spacing-md) var(--spacing-lg);
      height: 100%;
      display: flex;
      align-items: center;
    }
    
    .stat-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      width: 100%;
      
      .stat-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius-medium);
        background: rgba(127, 179, 211, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .stat-data {
        flex: 1;
        
        .stat-number {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: var(--spacing-xs);
        }
        
        .stat-label {
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.3;
        }
      }
    }
  }
}

.debug-section {
  margin-top: var(--spacing-xl);
  
  .debug-card {
    border-radius: var(--border-radius-large);
    border: 2px dashed var(--warning-color);
    box-shadow: var(--shadow-light);
    
    :deep(.el-card__header) {
      background: rgba(255, 193, 7, 0.1);
      border-bottom: 1px solid var(--warning-color);
      
      .debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        color: var(--warning-color);
      }
    }
    
    :deep(.el-card__body) {
      padding: var(--spacing-lg);
    }
    
    .debug-content {
      p {
        margin-bottom: var(--spacing-sm);
        font-family: 'Courier New', monospace;
        font-size: 14px;
        
        strong {
          color: var(--text-primary);
        }
      }
      
      pre {
        background: var(--background-color);
        padding: var(--spacing-sm);
        border-radius: var(--border-radius-small);
        font-size: 12px;
        overflow-x: auto;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-header {
    padding: 0 var(--spacing-md);
    
    .system-title {
      font-size: 18px;
    }
  }
  
  .dashboard-main {
    padding: var(--spacing-md);
  }
  
  .welcome-card .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }
  
  .action-card {
    margin-bottom: var(--spacing-md);
  }
}
</style>