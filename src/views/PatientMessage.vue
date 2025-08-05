<template>
  <div class="patient-message-container">
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
          <span class="breadcrumb-item current">患者留言</span>
        </div>
      </div>
      <div class="nav-right">
        <el-button 
          :icon="Refresh" 
          @click="loadMessages"
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
            <el-icon size="28"><ChatDotSquare /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">患者留言管理中心</h1>
            <p class="page-subtitle">查看和回复患者留言，及时响应患者需求和咨询</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ totalMessages }}</div>
            <div class="stat-label">总留言数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ pendingMessages }}</div>
            <div class="stat-label">待处理</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ completedMessages }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar">
      <div class="toolbar-container">
        <div class="toolbar-left">
          <el-button-group class="filter-group">
            <el-button 
              :type="messageType === 'all' ? 'primary' : ''"
              @click="switchMessageType('all')"
              size="default"
            >
              <el-icon><List /></el-icon>
              所有留言
            </el-button>
            <el-button 
              :type="messageType === 'my' ? 'primary' : ''"
              @click="switchMessageType('my')"
              size="default"
            >
              <el-icon><User /></el-icon>
              我的留言
            </el-button>
          </el-button-group>
          <el-select v-model="statusFilter" placeholder="状态筛选" clearable class="status-filter">
            <el-option label="全部" value="" />
            <el-option label="待定" value="待定" />
            <el-option label="批准" value="批准" />
            <el-option label="拒绝" value="拒绝" />
            <el-option label="完成" value="完成" />
          </el-select>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索患者姓名或内容..."
            :prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="message-list">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      <div v-else-if="filteredMessages.length === 0" class="empty-container">
        <el-empty description="暂无留言数据" />
      </div>
      <div v-else class="message-cards">
        <div v-for="message in paginatedMessages" :key="message.id" class="message-card">
          <div class="card-header">
            <div class="patient-info">
              <el-avatar :size="40" class="patient-avatar">
                {{ message.patientName?.charAt(0) }}
              </el-avatar>
              <div class="patient-details">
                <h4 class="patient-name">{{ message.patientName }}</h4>
                <span class="message-time">
                  <el-icon><Clock /></el-icon>
                  {{ formatTime(message.createTime) }}
                </span>
              </div>
            </div>
            <el-tag :type="getStatusType(message.status)" class="status-tag">
              {{ message.status }}
            </el-tag>
          </div>
          
          <div class="card-body">
            <div class="message-content">
              <p class="content-text">{{ message.content }}</p>
            </div>
            
            <div class="message-info">
              <div class="info-item">
                <el-icon class="info-icon"><Calendar /></el-icon>
                <span class="info-text">预约时间：{{ message.appointmentTime }}</span>
              </div>
              <div class="info-item">
                <el-icon class="info-icon"><Phone /></el-icon>
                <span class="info-text">联系方式：{{ message.contactInfo }}</span>
              </div>
            </div>
          </div>

          <div v-if="message.replyContent" class="reply-section">
            <div class="reply-indicator">
              <el-icon><ChatDotRound /></el-icon>
              <span>医生回复</span>
            </div>
            <div class="reply-text">{{ message.replyContent }}</div>
            <div class="reply-meta">
              <el-icon><Clock /></el-icon>
              <span>{{ formatTime(message.replyTime) }}</span>
            </div>
          </div>

          <div class="card-footer">
            <div class="action-buttons">
              <el-button size="small" type="primary" @click="viewMessageDetail(message)" plain>
                <el-icon><View /></el-icon>
                查看详情
              </el-button>
              <el-button 
                v-if="message.status !== '完成'" 
                size="small" 
                type="success" 
                @click="openReplyDialog(message)"
                plain
              >
                <el-icon><ChatDotRound /></el-icon>
                回复
              </el-button>
              <el-dropdown @command="handleStatusChange(message, $event)" trigger="click">
                <el-button size="small" type="info" plain>
                  <el-icon><More /></el-icon>
                  状态
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="待定">设为待定</el-dropdown-item>
                    <el-dropdown-item command="批准">设为批准</el-dropdown-item>
                    <el-dropdown-item command="拒绝">设为拒绝</el-dropdown-item>
                    <el-dropdown-item command="完成">设为完成</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <div class="pagination-wrapper">
        <div class="pagination-info">
          <span class="total-info">
            共 <strong>{{ filteredMessages.length }}</strong> 条留言
          </span>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="filteredMessages.length"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="custom-pagination"
          background
        />
      </div>
    </div>

    <!-- 留言详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="留言详情"
      width="600px"
    >
      <div v-if="selectedMessage" class="message-detail">
        <div class="detail-section">
          <h4>患者信息</h4>
          <p><strong>姓名:</strong> {{ selectedMessage.patientName }}</p>
          <p><strong>联系方式:</strong> {{ selectedMessage.contactInfo }}</p>
          <p><strong>预约时间:</strong> {{ selectedMessage.appointmentTime }}</p>
        </div>
        
        <div class="detail-section">
          <h4>留言内容</h4>
          <p>{{ selectedMessage.content }}</p>
        </div>

        <div v-if="selectedMessage.replyContent" class="detail-section">
          <h4>医生回复</h4>
          <p>{{ selectedMessage.replyContent }}</p>
          <p><small>回复时间: {{ formatTime(selectedMessage.replyTime) }}</small></p>
        </div>
      </div>
    </el-dialog>

    <!-- 回复对话框 -->
    <el-dialog
      v-model="replyDialogVisible"
      title="回复患者留言"
      width="500px"
    >
      <el-form :model="replyForm" label-width="80px">
        <el-form-item label="回复内容">
          <el-input
            v-model="replyForm.replyContent"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">发送回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatDotSquare,
  Message,
  Clock,
  Check,
  List,
  User,
  Search,
  Refresh,
  View,
  ChatDotRound,
  More,
  Calendar,
  Phone,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import {
  getAllPatientMessages,
  getMyPatientMessages,
  replyToPatientMessage,
  updateMessageStatus,
  getMessageDetail
} from '@/api/message'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const messages = ref([])
const messageType = ref('all') // 'all' 或 'my'
const statusFilter = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const replyDialogVisible = ref(false)
const selectedMessage = ref(null)
const replyForm = reactive({
  messageId: null,
  replyContent: ''
})

// 计算属性
const totalMessages = computed(() => messages.value.length)
const pendingMessages = computed(() => 
  messages.value.filter(m => m.status === '待定').length
)
const completedMessages = computed(() => 
  messages.value.filter(m => m.status === '完成').length
)

const filteredMessages = computed(() => {
  let filtered = messages.value

  // 状态筛选
  if (statusFilter.value) {
    filtered = filtered.filter(m => m.status === statusFilter.value)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(m => 
      m.patientName.toLowerCase().includes(keyword) ||
      m.content.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMessages.value.slice(start, end)
})

// 方法
const loadMessages = async () => {
  loading.value = true
  try {
    const api = messageType.value === 'all' ? getAllPatientMessages : getMyPatientMessages
    const response = await api()
    messages.value = response.data || []
  } catch (error) {
    ElMessage.error('加载留言失败')
    console.error('加载留言失败:', error)
  } finally {
    loading.value = false
  }
}

const switchMessageType = (type) => {
  messageType.value = type
  loadMessages()
}

const viewMessageDetail = async (message) => {
  try {
    const response = await getMessageDetail(message.id)
    selectedMessage.value = response.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取留言详情失败')
  }
}

const openReplyDialog = (message) => {
  selectedMessage.value = message
  replyForm.messageId = message.id
  replyForm.replyContent = ''
  replyDialogVisible.value = true
}

const submitReply = async () => {
  if (!replyForm.replyContent.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  try {
    await replyToPatientMessage(replyForm)
    ElMessage.success('回复成功')
    replyDialogVisible.value = false
    loadMessages()
  } catch (error) {
    ElMessage.error('回复失败')
  }
}

const handleStatusChange = async (message, newStatus) => {
  try {
    await ElMessageBox.confirm(`确定要将留言状态设为${newStatus}吗？`, '提示', {
      type: 'warning'
    })
    
    await updateMessageStatus({
      messageId: message.id,
      status: newStatus
    })
    
    ElMessage.success('状态更新成功')
    loadMessages()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('状态更新失败')
    }
  }
}

const getStatusType = (status) => {
  const typeMap = {
    '待定': 'warning',
    '批准': 'success',
    '拒绝': 'danger',
    '完成': 'info'
  }
  return typeMap[status] || 'default'
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const getAvatarUrl = (name) => {
  // 这里可以接入真实的头像服务
  return ''
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const goBack = () => {
  router.push('/dashboard')
}

// 生命周期
onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.patient-message-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
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

.back-btn:hover {
  background: rgba(25, 118, 210, 0.2);
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
  color: #1976D2;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #ccc;
  font-size: 12px;
}

.refresh-btn {
  background: rgba(25, 118, 210, 0.1);
  border: none;
  color: #1976D2;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(25, 118, 210, 0.2);
  transform: rotate(180deg);
}

/* 页面头部 */
.page-header {
  padding: 32px 24px;
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
  color: #0277bd;
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
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
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
  box-shadow: 0 12px 32px rgba(33, 150, 243, 0.4);
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
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.toolbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group .el-button {
  border-radius: 0;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-group .el-button:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.filter-group .el-button:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.status-filter {
  width: 150px;
  border-radius: 8px;
}

.status-filter .el-input__wrapper {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 300px;
  border-radius: 8px;
}

.search-input .el-input__wrapper {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.search-input .el-input__wrapper:hover {
  border-color: #2196F3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

/* 内容区域 */
.message-list {
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 32px;
}

.loading-container,
.empty-container {
  padding: 40px;
  text-align: center;
}

.message-cards {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}

.message-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #2196F3;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.patient-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.patient-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.message-time {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-tag {
  font-weight: 500;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
}

/* 卡片主体 */
.card-body {
  padding: 20px 24px;
}

.message-content {
  margin-bottom: 16px;
}

.content-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #2196F3;
}

.message-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.info-icon {
  color: #2196F3;
  font-size: 14px;
}

.info-text {
  color: #555;
}

/* 回复区域 */
.reply-section {
  margin: 16px 24px 0;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 8px;
  border-left: 3px solid #2196F3;
}

.reply-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1976d2;
  font-size: 13px;
}

.reply-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 8px;
}

.reply-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

/* 卡片底部 */
.card-footer {
  padding: 16px 24px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-buttons .el-button {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 13px;
}

.action-buttons .el-button:hover {
  transform: translateY(-1px);
}

/* 分页 */
.pagination-container {
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-info {
  font-size: 14px;
  color: #666;
}

.total-info strong {
  color: #2196F3;
  font-weight: 600;
}

.custom-pagination {
  border-radius: 8px;
  overflow: hidden;
}

.custom-pagination .el-pagination__total {
  color: #666;
  font-weight: 500;
}

.custom-pagination .el-pager li {
  border-radius: 6px;
  margin: 0 2px;
  transition: all 0.3s ease;
}

.custom-pagination .el-pager li:hover {
  background: #2196F3;
  color: white;
}

.custom-pagination .el-pager li.is-active {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  color: white;
  font-weight: 600;
}

/* 对话框 */
.message-detail {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-section p {
  margin: 8px 0;
  color: #333;
  line-height: 1.6;
}

.detail-section p strong {
  color: #1a1a1a;
  font-weight: 600;
}

/* 对话框样式 */
.el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.el-dialog__header {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
  color: white;
  padding: 20px 24px;
}

.el-dialog__title {
  color: white;
  font-weight: 600;
}

.el-dialog__body {
  padding: 24px;
}

.el-form-item__label {
  font-weight: 600;
  color: #1a1a1a;
}

.el-textarea__inner {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.el-textarea__inner:focus {
   border-color: #2196F3;
   box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
 }

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .nav-left {
    justify-content: space-between;
  }

  .breadcrumb {
    display: none;
  }

  .page-header {
    padding: 20px 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .page-icon {
    width: 40px;
    height: 40px;
  }

  .page-title {
    font-size: 20px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .header-stats {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .stat-card {
    flex: 1;
    min-width: auto;
    padding: 12px 8px;
  }

  .stat-number {
    font-size: 18px;
  }

  .stat-label {
    font-size: 11px;
  }

  .toolbar {
    margin: 16px;
    padding: 16px;
  }

  .toolbar-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .toolbar-left {
    justify-content: center;
  }

  .toolbar-right {
    justify-content: center;
  }

  .search-input {
    width: 100%;
  }

  .message-list {
    padding: 0 16px;
  }

  .message-card {
    border-radius: 8px;
  }

  .card-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .patient-info {
    gap: 10px;
  }

  .patient-name {
    font-size: 15px;
  }

  .message-time {
    font-size: 12px;
  }

  .card-body {
    padding: 16px;
  }

  .content-text {
    font-size: 14px;
    padding: 12px;
  }

  .message-info {
    gap: 6px;
  }

  .info-item {
    font-size: 13px;
  }

  .card-footer {
    padding: 12px 16px;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 6px;
  }

  .action-buttons .el-button {
    flex: 1;
    min-width: 70px;
    font-size: 12px;
  }

  .reply-section {
    margin: 12px 16px 0;
    padding: 12px;
  }

  .pagination-container {
    margin: 16px;
    padding: 16px;
  }

  .pagination-wrapper {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .custom-pagination {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-stats {
    flex-direction: column;
  }

  .stat-card {
    flex: none;
    width: 100%;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group .el-button {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
  }

  .status-filter {
    width: 100%;
  }

  .message-actions {
    flex-direction: column;
  }

  .message-actions .el-button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .stat-card {
    flex: 1;
    min-width: 0;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .message-actions {
    flex-wrap: wrap;
  }
  
  .message-meta {
    flex-direction: column;
    gap: 5px;
  }
}
</style>