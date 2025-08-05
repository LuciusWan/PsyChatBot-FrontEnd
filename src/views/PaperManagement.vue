<template>
  <div class="paper-management">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <el-button 
        type="info" 
        :icon="ArrowLeft" 
        @click="goBackToDashboard"
        class="back-btn"
      >
        返回工作台
      </el-button>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">添加试卷</h1>
      <p class="page-description">创建新的心理测评试卷</p>
    </div>

    <!-- 操作区域 -->
    <div class="action-bar">
      <el-button 
        type="primary" 
        size="large"
        :icon="Plus" 
        @click="showCreateDialog = true"
        class="create-btn"
      >
        开始创建试卷
      </el-button>
    </div>

    <!-- 创建试卷对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建新试卷"
      width="800px"
      :before-close="handleCreateClose"
      class="create-dialog"
    >
      <el-form 
        :model="paperForm" 
        :rules="paperRules" 
        ref="paperFormRef" 
        label-width="120px"
      >
        <el-form-item label="试卷名称" prop="paperName">
          <el-input 
            v-model="paperForm.paperName" 
            placeholder="请输入试卷名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="适用人群" prop="applicableGroup">
          <el-input 
            v-model="paperForm.applicableGroup" 
            placeholder="例如：青少年、成年人、老年人等"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="试卷描述" prop="description">
          <el-input 
            v-model="paperForm.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入试卷的详细描述，包括测评目的、使用场景等"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="总题数" prop="totalQuestions">
          <el-input-number 
            v-model="paperForm.totalQuestions" 
            :min="1" 
            :max="100"
            placeholder="请输入题目总数"
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="计分规则" prop="totalScoreRule">
          <el-input 
            v-model="paperForm.totalScoreRule" 
            type="textarea" 
            :rows="3"
            placeholder="请描述试卷的计分规则，例如：每题1-7分，总分范围7-49分"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCreateClose">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleCreatePaper"
            :loading="creating"
          >
            {{ creating ? '创建中...' : '创建试卷' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加题目对话框 -->
    <el-dialog 
      v-model="showQuestionDialog" 
      :title="`为试卷「${currentPaperName}」添加题目`" 
      width="900px"
      :before-close="handleQuestionClose"
      class="question-dialog"
    >
      <div class="question-form-container">
        <div class="question-header">
          <h3>为试卷 "{{ currentPaperName }}" 添加题目</h3>
          <el-button 
            type="primary" 
            size="small" 
            @click="addQuestion"
            :icon="Plus"
          >
            添加题目
          </el-button>
        </div>
        
        <div class="questions-list">
          <div 
            v-for="(question, index) in questions" 
            :key="index" 
            class="question-item"
          >
            <div class="question-header-item">
              <span class="question-number">题目 {{ index + 1 }}</span>
              <el-button 
                type="danger" 
                size="small" 
                :icon="Delete"
                @click="removeQuestion(index)"
                v-if="questions.length > 1"
              >
                删除
              </el-button>
            </div>
            
            <el-form 
              :model="question" 
              :rules="questionRules" 
              :ref="el => questionFormRefs[index] = el"
              label-width="100px"
              class="question-form"
            >
              <el-form-item label="题目内容" prop="questionContent">
                <el-input 
                  v-model="question.questionContent" 
                  type="textarea" 
                  :rows="3"
                  placeholder="请输入题目内容，例如：时间过得比平时慢。"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="答案选项" prop="answerType">
                <el-input 
                  v-model="question.answerType" 
                  type="textarea" 
                  :rows="2"
                  placeholder="请输入答案选项，例如：1=完全不同意;2=不同意;3=有点不同意;4=不确定;5=有点同意;6=同意;7=完全同意"
                  maxlength="300"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleQuestionClose">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSubmitQuestions"
            :loading="submitting"
          >
            {{ submitting ? '提交中...' : '提交题目' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 成功提示 -->
    <el-dialog 
      v-model="showSuccessDialog" 
      title="创建成功" 
      width="400px"
      :show-close="false"
    >
      <div class="success-content">
        <el-icon class="success-icon" color="#67C23A" size="48">
          <CircleCheck />
        </el-icon>
        <p class="success-text">试卷创建成功！</p>
        <p class="success-desc">试卷ID: {{ createdPaperId }}</p>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSuccessClose">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Delete,
  CircleCheck,
  ArrowLeft
} from '@element-plus/icons-vue'
import { 
  createPaper, 
  insertQuestions 
} from '@/api/doctor'

// 路由
const router = useRouter()

// 返回工作台
const goBackToDashboard = () => {
  router.push('/dashboard')
}

// 响应式数据
const creating = ref(false)
const submitting = ref(false)
const showCreateDialog = ref(false)
const showQuestionDialog = ref(false)
const showSuccessDialog = ref(false)
const createdPaperId = ref(null)
const currentPaperName = ref('')

// 试卷表单数据
const paperForm = reactive({
  paperName: '',
  resultType: 1, // 默认值
  applicableGroup: '',
  description: '',
  totalQuestions: 1,
  totalScoreRule: ''
})

// 题目数据
const questions = ref([
  {
    questionContent: '',
    questionPaperId: null,
    answerType: ''
  }
])

// 表单验证规则
const paperRules = {
  paperName: [
    { required: true, message: '请输入试卷名称', trigger: 'blur' },
    { min: 2, max: 100, message: '试卷名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  applicableGroup: [
    { required: true, message: '请输入适用人群', trigger: 'blur' },
    { max: 50, message: '适用人群不能超过 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入试卷描述', trigger: 'blur' },
    { max: 500, message: '试卷描述不能超过 500 个字符', trigger: 'blur' }
  ],
  totalQuestions: [
    { required: true, message: '请输入总题数', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '题目数量在 1 到 100 之间', trigger: 'blur' }
  ],
  totalScoreRule: [
    { required: true, message: '请输入计分规则', trigger: 'blur' },
    { max: 300, message: '计分规则不能超过 300 个字符', trigger: 'blur' }
  ]
}

const questionRules = {
  questionContent: [
    { required: true, message: '请输入题目内容', trigger: 'blur' },
    { max: 200, message: '题目内容不能超过 200 个字符', trigger: 'blur' }
  ],
  answerType: [
    { required: true, message: '请输入答案选项', trigger: 'blur' },
    { max: 300, message: '答案选项不能超过 300 个字符', trigger: 'blur' }
  ]
}

// 表单引用
const paperFormRef = ref()
const questionFormRefs = ref([])

// 创建试卷
const handleCreatePaper = async () => {
  if (!paperFormRef.value) return
  
  try {
    await paperFormRef.value.validate()
    
    creating.value = true
    const response = await createPaper(paperForm)
    
    // 假设返回的数据中包含试卷ID
    createdPaperId.value = response.data?.id || response.data
    currentPaperName.value = paperForm.paperName
    
    // 设置题目的试卷ID
    questions.value.forEach(question => {
      question.questionPaperId = createdPaperId.value
    })
    
    showCreateDialog.value = false
    showQuestionDialog.value = true
    
    ElMessage.success('试卷创建成功，请添加题目')
  } catch (error) {
    console.error('创建试卷失败:', error)
    ElMessage.error('创建试卷失败')
  } finally {
    creating.value = false
  }
}

// 添加题目
const addQuestion = () => {
  questions.value.push({
    questionContent: '',
    questionPaperId: createdPaperId.value,
    answerType: ''
  })
}

// 删除题目
const removeQuestion = (index) => {
  if (questions.value.length > 1) {
    questions.value.splice(index, 1)
    // 重新设置表单引用数组
    nextTick(() => {
      questionFormRefs.value = questionFormRefs.value.slice(0, questions.value.length)
    })
  }
}

// 提交题目
const handleSubmitQuestions = async () => {
  try {
    // 验证所有题目表单
    const validationPromises = questionFormRefs.value.map(formRef => {
      if (formRef) {
        return formRef.validate()
      }
      return Promise.resolve()
    })
    
    await Promise.all(validationPromises)
    
    submitting.value = true
    await insertQuestions(questions.value)
    
    showQuestionDialog.value = false
    showSuccessDialog.value = true
    
    ElMessage.success('题目添加成功')
  } catch (error) {
    console.error('添加题目失败:', error)
    ElMessage.error('添加题目失败')
  } finally {
    submitting.value = false
  }
}

// 对话框关闭处理
const handleCreateClose = () => {
  showCreateDialog.value = false
  resetPaperForm()
}

const handleQuestionClose = () => {
  showQuestionDialog.value = false
  resetQuestions()
}

const handleSuccessClose = () => {
  showSuccessDialog.value = false
  resetAll()
}

// 重置表单
const resetPaperForm = () => {
  Object.assign(paperForm, {
    paperName: '',
    resultType: 1,
    applicableGroup: '',
    description: '',
    totalQuestions: 1,
    totalScoreRule: ''
  })
  if (paperFormRef.value) {
    paperFormRef.value.resetFields()
  }
}

const resetQuestions = () => {
  questions.value = [
    {
      questionContent: '',
      questionPaperId: null,
      answerType: ''
    }
  ]
  questionFormRefs.value = []
}

const resetAll = () => {
  resetPaperForm()
  resetQuestions()
  createdPaperId.value = null
  currentPaperName.value = ''
}
</script>

<style scoped>
.paper-management {
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.back-button-container {
  margin-bottom: 24px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dcdfe6;
  color: #606266;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateX(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  color: var(--text-secondary);
  margin: 0;
  font-size: 18px;
  font-weight: 400;
}

.action-bar {
  margin-bottom: 40px;
  text-align: center;
}

.create-btn {
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  border: none;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(64, 158, 255, 0.4);
}

/* 对话框样式 */
:deep(.create-dialog .el-dialog) {
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

:deep(.create-dialog .el-dialog__header) {
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 24px 32px;
}

:deep(.create-dialog .el-dialog__title) {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

:deep(.create-dialog .el-dialog__body) {
  padding: 32px;
}

:deep(.question-dialog .el-dialog) {
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

:deep(.question-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea, var(--primary-color));
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 24px 32px;
}

:deep(.question-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.question-dialog .el-dialog__body) {
  padding: 32px;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 15px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-form-container {
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 8px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #ebeef5;
}

.question-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 18px;
  font-weight: 600;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.question-item {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.question-header-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-number {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 16px;
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.question-form {
  margin: 0;
}

.success-content {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  margin-bottom: 24px;
}

.success-text {
  font-size: 24px;
  font-weight: 700;
  color: #67C23A;
  margin: 0 0 12px 0;
}

.success-desc {
  color: var(--text-secondary);
  margin: 0;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
}

:deep(.dialog-footer .el-button) {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 8px;
}

:deep(.dialog-footer .el-button--primary) {
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .paper-management {
    padding: 20px;
  }
  
  .page-header {
    padding: 24px 16px;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-description {
    font-size: 16px;
  }
  
  .create-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .question-header-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .question-item {
    padding: 16px;
  }
  
  :deep(.create-dialog .el-dialog__body),
  :deep(.question-dialog .el-dialog__body) {
    padding: 20px;
  }
}

/* 滚动条样式 */
.question-form-container::-webkit-scrollbar {
  width: 6px;
}

.question-form-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.question-form-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  border-radius: 3px;
}

.question-form-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #667eea, var(--primary-color));
}
</style>