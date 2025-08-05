import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录 - 心理医生工作台' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '医生注册 - 心理医生工作台' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: '工作台 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人信息 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/file-management',
    name: 'FileManagement',
    component: () => import('@/views/FileManagement.vue'),
    meta: { title: '文件管理 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/paper-management',
    name: 'PaperManagement',
    component: () => import('@/views/PaperManagement.vue'),
    meta: { title: '试卷管理 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/patient-query',
    name: 'PatientQuery',
    component: () => import('@/views/PatientQuery.vue'),
    meta: { title: '患者查询 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/paper-query',
    name: 'PaperQuery',
    component: () => import('@/views/PaperQuery.vue'),
    meta: { title: '试卷查询 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/patient-message',
    name: 'PatientMessage',
    component: () => import('@/views/PatientMessage.vue'),
    meta: { title: '患者留言板 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/expert-management',
    name: 'ExpertManagement',
    component: () => import('@/views/ExpertManagement.vue'),
    meta: { title: '专家管理 - 心理医生工作台', requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 心理医生管理系统`
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 如果已登录且访问登录页，重定向到工作台
    if (to.path === '/login' && token) {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router