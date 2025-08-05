<template>
  <div class="paper-query-container">
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
          <span class="breadcrumb-item current">试卷查询</span>
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

      <!-- 分页组件 -->
      <div v-if="filteredPapers.length > pageSize" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[6, 12, 18, 24]"
          :total="filteredPapers.length"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          background
        />
      </div>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="page-icon">
            <el-icon size="32"><Notebook style="color: white;" /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">试卷查询管理</h1>
            <p class="page-subtitle">查看和管理心理测评量表，支持多条件筛选和详情查看</p>
          </div>
        </div>
        <div class="header-stats">
           <div class="stat-card">
             <div class="stat-icon">
               <el-icon size="20"><Notebook style="color: white;" /></el-icon>
             </div>
             <div class="stat-content">
               <div class="stat-number">{{ totalPapers }}</div>
               <div class="stat-label">试卷总数</div>
             </div>
           </div>
           <div class="stat-card">
             <div class="stat-icon">
               <el-icon size="20"><User style="color: white;"  /></el-icon>
             </div>
             <div class="stat-content">
               <div class="stat-number">{{ totalGroups }}</div>
               <div class="stat-label">适用人群</div>
             </div>
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
            placeholder="搜索试卷名称或描述..."
            :prefix-icon="Search"
            clearable
            class="search-input"
            @input="handleSearch"
          />
          <el-select
            v-model="selectedGroup"
            placeholder="适用人群"
            clearable
            @change="handleFilter"
            class="group-filter"
          >
            <el-option label="全部人群" value="" />
            <el-option 
              v-for="group in applicableGroups" 
              :key="group" 
              :label="group" 
              :value="group" 
            />
          </el-select>
          <el-select
            v-model="questionRange"
            placeholder="题目数量"
            clearable
            @change="handleFilter"
            class="range-filter"
          >
            <el-option label="全部数量" value="" />
            <el-option label="1-20题" value="1-20" />
            <el-option label="21-50题" value="21-50" />
            <el-option label="51-100题" value="51-100" />
            <el-option label="100题以上" value="100+" />
          </el-select>
          <el-button 
            :icon="Refresh" 
            @click="resetFilters"
            class="reset-btn"
            size="large"
            title="重置筛选"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 试卷卡片列表 -->
    <div class="papers-section">
      <div class="table-container">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">试卷列表</span>
              <span class="paper-count">共 {{ filteredPapers.length }} 份试卷</span>
            </div>
          </template>

          <el-row :gutter="24" v-loading="loading">
            <el-col 
              :xs="24" 
              :sm="12" 
              :md="8" 
              :lg="6" 
              v-for="paper in paginatedPapers" 
              :key="paper.id"
              class="paper-col"
            >
              <el-card class="paper-card" @click="viewPaperDetail(paper)">
                <div class="paper-header">
                  <div class="paper-icon">
                    <el-icon :size="24" color="white">
                      <Notebook />
                    </el-icon>
                  </div>
                  <div class="paper-badge">
                    <el-tag :type="getPaperTagType(paper.totalQuestions)" size="small">
                      {{ paper.totalQuestions }}题
                    </el-tag>
                  </div>
                </div>
                
                <div class="paper-content">
                  <h3 class="paper-title" :title="paper.paperName">
                    {{ paper.paperName }}
                  </h3>
                  
                  <div class="paper-info">
                    <div class="info-item">
                      <el-icon><User /></el-icon>
                      <span>{{ paper.applicableGroup }}</span>
                    </div>
                    <div class="info-item">
                      <el-icon><Clock /></el-icon>
                      <span>{{ formatDate(paper.createTime) }}</span>
                    </div>
                  </div>
                  
                  <div class="paper-description" :title="paper.description">
                    {{ paper.description || '暂无描述' }}
                  </div>
                </div>
                
                <div class="paper-footer">
                  <el-button type="success" size="small" :icon="View">
                    查看详情
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
          
          <!-- 空状态 -->
          <div v-if="!loading && filteredPapers.length === 0" class="empty-state">
            <el-empty description="暂无试卷数据">
              <el-button type="success" @click="loadPapers">刷新数据</el-button>
            </el-empty>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 试卷详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedPaper?.paperName"
      width="80%"
      max-width="800px"
      :before-close="handleCloseDetail"
    >
      <div v-if="selectedPaper" class="paper-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="试卷名称">
              {{ selectedPaper.paperName }}
            </el-descriptions-item>
            <el-descriptions-item label="适用人群">
              {{ selectedPaper.applicableGroup }}
            </el-descriptions-item>
            <el-descriptions-item label="题目数量">
              {{ selectedPaper.totalQuestions }}题
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(selectedPaper.createTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ formatDate(selectedPaper.updateTime) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-section">
          <h4>试卷描述</h4>
          <div class="description-content">
            {{ selectedPaper.description || '暂无描述' }}
          </div>
        </div>
        
        <div class="detail-section">
          <h4>计分规则</h4>
          <div class="score-rule-content">
            <pre>{{ selectedPaper.totalScoreRule || '暂无计分规则' }}</pre>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>试卷题目</h4>
          <div v-loading="questionsLoading" class="questions-content">
            <div v-if="questions.length === 0 && !questionsLoading" class="no-questions">
              <el-empty description="暂无题目数据" />
            </div>
            <div v-else class="questions-list">
              <div 
                v-for="(question, index) in questions" 
                :key="question.id" 
                class="question-item"
              >
                <div class="question-header">
                  <span class="question-number">第{{ index + 1 }}题</span>
                  <el-tag size="small" type="info">{{ question.answerType }}</el-tag>
                </div>
                <div class="question-content">
                  {{ question.questionContent }}
                </div>
                <div class="question-meta">
                  <span class="question-time">
                    创建时间：{{ formatDate(question.createTime) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  Notebook,
  Search,
  Refresh,
  User,
  Clock,
  View,
  ArrowLeft,
  ArrowRight,
  Download
} from '@element-plus/icons-vue'
import { getPaperList, getAllQuestions } from '@/api/paper'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const papers = ref([])
const searchKeyword = ref('')
const selectedGroup = ref('')
const questionRange = ref('')
const exportLoading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12) // 每页显示12个试卷卡片

// 详情对话框
const detailDialogVisible = ref(false)
const selectedPaper = ref(null)

// 题目相关数据
const questions = ref([])
const questionsLoading = ref(false)

// 计算属性
const applicableGroups = computed(() => {
  const groups = [...new Set(papers.value.map(paper => paper.applicableGroup))]
  return groups.filter(group => group)
})

const filteredPapers = computed(() => {
  let result = papers.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(paper => 
      paper.paperName.toLowerCase().includes(keyword) ||
      (paper.description && paper.description.toLowerCase().includes(keyword))
    )
  }

  // 适用人群筛选
  if (selectedGroup.value) {
    result = result.filter(paper => paper.applicableGroup === selectedGroup.value)
  }

  // 题目数量筛选
  if (questionRange.value) {
    result = result.filter(paper => {
      const count = paper.totalQuestions
      switch (questionRange.value) {
        case '1-20':
          return count >= 1 && count <= 20
        case '21-50':
          return count >= 21 && count <= 50
        case '51-100':
          return count >= 51 && count <= 100
        case '100+':
          return count > 100
        default:
          return true
      }
    })
  }

  return result
})

// 新增计算属性：试卷总数
const totalPapers = computed(() => {
  return papers.value.length
})

// 新增计算属性：适用人群数量
const totalGroups = computed(() => {
  return applicableGroups.value.length
})

// 分页计算属性
const paginatedPapers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPapers.value.slice(start, end)
})

// 方法
const loadPapers = async () => {
  loading.value = true
  try {
    const response = await getPaperList()
    if (response && response.code === 0) {
      papers.value = response.data || []
      /*ElMessage.success('试卷数据加载成功')*/
    } else {
      ElMessage.error(response?.message || '获取试卷数据失败')
    }
  } catch (error) {
    console.error('获取试卷列表失败:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 搜索时重置到第一页
  currentPage.value = 1
}

const handleFilter = () => {
  // 筛选时重置到第一页
  currentPage.value = 1
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedGroup.value = ''
  questionRange.value = ''
  currentPage.value = 1 // 重置时回到第一页
}

// 分页方法
const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const viewPaperDetail = async (paper) => {
  selectedPaper.value = paper
  detailDialogVisible.value = true
  
  // 加载题目
  await loadPaperQuestions(paper.id)
}

const loadPaperQuestions = async (paperId) => {
  questionsLoading.value = true
  questions.value = []
  
  try {
    // 一键获取试卷的所有题目
    const response = await getAllQuestions(paperId)
    if (response && response.code === 0) {
      const questionList = response.data || []
      questions.value = questionList
      
      if (questionList.length > 0) {
        /*ElMessage.success(`成功加载 ${questionList.length} 道题目`)*/
      } else {
        ElMessage.info('该试卷暂无题目')
      }
    } else {
      ElMessage.error(response?.message || '获取题目失败')
    }
  } catch (error) {
    console.error('加载试卷题目失败:', error)
    ElMessage.error('加载题目失败，请稍后重试')
  } finally {
    questionsLoading.value = false
  }
}

const handleCloseDetail = () => {
  detailDialogVisible.value = false
  selectedPaper.value = null
  questions.value = []
  questionsLoading.value = false
}

const goBackToDashboard = () => {
  router.push('/dashboard')
}

const refreshData = async () => {
  await loadPapers()
  ElMessage.success('数据已刷新')
}

const exportToExcel = async () => {
  if (filteredPapers.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  exportLoading.value = true
  try {
    // 动态导入 xlsx 库
    const XLSX = await import('xlsx')
    
    // 准备导出数据
    const exportData = filteredPapers.value.map((paper, index) => ({
      '序号': index + 1,
      '试卷名称': paper.paperName,
      '适用人群': paper.applicableGroup,
      '题目数量': paper.totalQuestions,
      '试卷描述': paper.description || '暂无描述',
      '创建时间': formatDate(paper.createTime),
      '更新时间': formatDate(paper.updateTime)
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 设置列宽
    const colWidths = [
      { wch: 8 },   // 序号
      { wch: 30 },  // 试卷名称
      { wch: 15 },  // 适用人群
      { wch: 12 },  // 题目数量
      { wch: 40 },  // 试卷描述
      { wch: 15 },  // 创建时间
      { wch: 15 }   // 更新时间
    ]
    ws['!cols'] = colWidths

    // 添加工作表
    XLSX.utils.book_append_sheet(wb, ws, '试卷列表')
    
    // 生成文件名
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_')
    const filename = `试卷查询数据_${timestamp}.xlsx`
    
    // 导出文件
    XLSX.writeFile(wb, filename)
    
    ElMessage.success(`成功导出 ${exportData.length} 条试卷数据`)
  } catch (error) {
    console.error('导出Excel失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  } finally {
    exportLoading.value = false
  }
}

const getPaperTagType = (questionCount) => {
  if (questionCount <= 20) return 'success'
  if (questionCount <= 50) return 'warning'
  if (questionCount <= 100) return 'info'
  return 'danger'
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  loadPapers()
})
</script>

<style scoped lang="scss">


.paper-query-container {
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
  min-height: 100vh;
  padding: 0;
}

// 顶部导航栏
.top-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(103, 194, 58, 0.1);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-btn {
      color: #2E7D32;
      font-weight: 500;
      
      &:hover {
        color: var(--green-dark);
        background: var(--green-light);
      }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;

      .breadcrumb-item {
        color: #666;
        
        &.current {
          color: #2E7D32;
          font-weight: 500;
        }
      }

      .breadcrumb-separator {
        color: #ccc;
        font-size: 12px;
      }
    }
  }

  .nav-right {
    .refresh-btn {
      color: #2E7D32;
      border-color: #2E7D32;
      
      &:hover {
        background: var(--green-light);
        border-color: var(--green-dark);
        color: var(--green-dark);
      }
    }
  }
}

// 页面头部
.page-header {
  background: linear-gradient(135deg, #e5fae6 0%, #C8E6C9 100%);
  padding: 40px 0;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

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
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          border-radius: inherit;
        }

        &:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 32px rgba(76, 175, 80, 0.4);
        }
        
        .el-icon {
          color: white;
          z-index: 1;
          position: relative;
        }
      }

      .header-text {
        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: black;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
          margin: 0;
          font-weight: 400;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      }
    }

    .header-stats {
      display: flex;
      gap: 24px;

      .stat-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 20px 24px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 140px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
          
          .el-icon {
            color: white;
            z-index: 1;
            position: relative;
          }
        }
        
        .stat-content {
          .stat-number {
            font-size: 28px;
            font-weight: 700;
            color: black;
            line-height: 1;
            margin-bottom: 4px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .stat-label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.8);
            font-weight: 500;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
}

// 工具栏样式
.toolbar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(103, 194, 58, 0.1);
  padding: 16px 24px;
  margin-bottom: 24px;
  
  .toolbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .toolbar-left {
       .export-btn {
         background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
         border: none;
         border-radius: 8px;
         padding: 12px 24px;
         font-size: 16px;
         font-weight: 500;
         box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
         transition: all 0.3s ease;
         color: white;
         
         &:hover {
           transform: translateY(-2px);
           box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
           background: linear-gradient(135deg, #388E3C 0%, #4CAF50 100%);
         }
       }
     }
    
    .toolbar-right {
       display: flex;
       gap: 12px;
       align-items: center;
       
       .search-input {
         width: 300px;
         
         :deep(.el-input__wrapper) {
           border-radius: 20px;
           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
           border: none;
         }
       }
       
       .group-filter,
       .range-filter {
         width: 120px;
       }
       
       .reset-btn {
         background: rgba(76, 175, 80, 0.1);
         border: 1px solid rgba(76, 175, 80, 0.3);
         color: #2E7D32;
         border-radius: 8px;
         transition: all 0.3s ease;
         
         &:hover {
           background: rgba(76, 175, 80, 0.2);
           border-color: #4CAF50;
           transform: translateY(-1px);
         }
       }
     }
  }
}

// 表格部分样式
.papers-section {
  .table-container {
    padding: 0 24px 24px 24px;
  }
  
  .table-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 20px rgba(103, 194, 58, 0.1);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      .paper-count {
        color: #4CAF50;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }

  .paper-col {
    margin-bottom: 24px;
  }
  
  .paper-card {
    height: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 16px;
    border: 1px solid rgba(76, 175, 80, 0.2);
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(76, 175, 80, 0.2);
      border-color: #4CAF50;
    }
    
    .paper-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .paper-icon {
        padding: 12px;
        background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .el-icon {
          color: white;
        }
      }
      
      .paper-badge {
        .el-tag {
          background: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
      }
    }
    
    .paper-content {
      .paper-title {
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 16px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
        min-height: 2.8em;
      }
      
      .paper-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7f8c8d;
          font-size: 13px;
        }
      }
      
      .paper-description {
        color: #7f8c8d;
        font-size: 13px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 16px;
        min-height: 3.9em;
      }
    }
    
    .paper-footer {
      display: flex;
      justify-content: center;
      
      .el-button {
        border-radius: 8px;
        min-width: 120px;
        background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
        border: none;
        color: white;
        
        &:hover {
          background: linear-gradient(135deg, #388E3C 0%, #4CAF50 100%);
          transform: translateY(-1px);
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 48px 0;
}

.paper-detail {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      color: #2c3e50;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .description-content,
    .score-rule-content {
      background: #F1F8E9;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(76, 175, 80, 0.2);
      
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 0;
        font-family: inherit;
        line-height: 1.6;
      }
    }
    
    .questions-content {
      .no-questions {
        text-align: center;
        padding: 48px 0;
      }
      
      .questions-list {
        max-height: 400px;
        overflow-y: auto;
        
        .question-item {
          background: #F1F8E9;
          border: 1px solid rgba(76, 175, 80, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
          
          &:hover {
            border-color: #4CAF50;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
          }
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            
            .question-number {
              font-weight: 600;
              color: #4CAF50;
              font-size: 14px;
            }
          }
          
          .question-content {
            color: #2c3e50;
            line-height: 1.6;
            margin-bottom: 12px;
            font-size: 14px;
          }
          
          .question-meta {
            .question-time {
              color: #7f8c8d;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 分页组件样式
.pagination-wrapper {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 32px 0;
  background: white;
  border-top: 1px solid #f0f0f0;
  
  :deep(.el-pagination) {
    .el-pager li {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      margin: 0 2px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(76, 175, 80, 0.1);
        border-color: #4CAF50;
        color: #4CAF50;
      }
      
      &.is-active {
        background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
        border-color: #4CAF50;
        color: white;
      }
    }
    
    .btn-prev,
    .btn-next {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(76, 175, 80, 0.1);
        border-color: #4CAF50;
        color: #4CAF50;
      }
      
      &:disabled {
        background: #f5f5f5;
        border-color: #e0e0e0;
        color: #c0c0c0;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .paper-query-container {
    padding: 0;
  }
  
  .top-nav {
    padding: 12px 16px;
    
    .nav-left {
      gap: 12px;
      
      .breadcrumb {
        display: none;
      }
    }
  }
  
  .page-header {
    padding: 16px;
    
    .header-content {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
      
      .header-stats {
        justify-content: center;
        gap: 16px;
      }
    }
  }
  
  .toolbar {
    padding: 16px;
    
    .toolbar-container {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
      
      .toolbar-right {
        flex-direction: column;
        gap: 12px;
        
        .search-input,
        .group-filter,
        .range-filter {
          width: 100%;
        }
      }
    }
  }
  
  .papers-section .table-container {
    padding: 0 16px 16px 16px;
  }
}
</style>