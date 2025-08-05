import { createStore } from 'vuex'
import { getToken, setToken, removeToken } from '@/utils/auth'

export default createStore({
  state: {
    user: {
      id: null,
      userName: '',
      name: '',
      token: getToken()
    },
    loading: false
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = { ...state.user, ...user }
    },
    
    SET_TOKEN(state, token) {
      state.user.token = token
      setToken(token)
    },
    
    CLEAR_USER(state) {
      state.user = {
        id: null,
        userName: '',
        name: '',
        token: null
      }
      removeToken()
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        commit('SET_LOADING', true)
        // 这里会在API工具类中调用
        resolve()
      })
    },
    
    // 登出
    logout({ commit }) {
      commit('CLEAR_USER')
      return Promise.resolve()
    },
    
    // 设置用户信息
    setUser({ commit }, user) {
      commit('SET_USER', user)
      if (user.token) {
        commit('SET_TOKEN', user.token)
      }
    }
  },
  
  getters: {
    isLoggedIn: state => !!state.user.token,
    currentUser: state => state.user,
    isLoading: state => state.loading
  }
})