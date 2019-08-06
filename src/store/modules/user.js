import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,setCompanyId,getCompanyId ,removeCompanyId} from '@/utils/auth'
import { parseTime } from '@/utils/index'
import { selectCompany } from '@/api/selectCompany'
const user = {
  state: {
    theme:localStorage.getItem("theme") ? localStorage.getItem("theme"):'3',
    companyId: getCompanyId(),
    company: {},
    companies: [],
    token: getToken(),
    name: '',
    email: '',
    avatar: '',
    createTime: '',
    roles: [],
    codes:{},
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_THEME:(state,theme)=>{
      state.theme = theme
    },
    SET_COMPANYID: (state, companyId) => {
      state.companyId = companyId
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_COMPANIES: (state, companies) => {
      state.companies = companies
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CODES:(state,codes)=>{
      state.codes = codes
    },
    SET_CREATE_TIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(username, password).then(res => {
          removeToken()
          setToken(res.token)
          setCompanyId(res.user.company.id)
          commit('SET_TOKEN', res.token)
          commit('SET_COMPANY', Object.assign({}, res.user.company))
          commit('SET_COMPANIES', res.user.companies)
          commit('SET_COMPANYID', res.user.company.id)
          setUserInfo(res.user, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const coId = getCompanyId()
        getInfo(getToken(),coId).then(res => {
          removeToken()
          setToken(res.token)
          setCompanyId(res.user.company.id)
          commit('SET_TOKEN', res.token)
          commit('SET_COMPANY', Object.assign({}, res.user.company))
          commit('SET_COMPANIES', res.user.companies)
          commit('SET_COMPANYID',res.user.company.id)
          setUserInfo(res.user, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
   // 自动登录获取用户信息
   autoLogin({ commit },token) {
    return new Promise((resolve, reject) => {
      getInfo(token).then(res => {
        removeToken()
        setToken(res.token)
        setCompanyId(res.user.company.id)
        commit('SET_TOKEN', res.token)
        commit('SET_COMPANY', Object.assign({}, res.user.company))
        commit('SET_COMPANIES', res.user.companies)
        commit('SET_COMPANYID',res.user.company.id)
        setUserInfo(res.user, commit)
        // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
        commit('SET_LOAD_MENUS', true)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },



    // 切换公司
    SelectCompany({ commit }, companyId) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        const coId = companyId
        selectCompany(token, coId).then(res => {
          removeToken()
          setToken(res.token)
          setCompanyId(res.user.company.id)
          commit('SET_TOKEN', res.token)
          commit('SET_COMPANY', Object.assign({}, res.user.company))
          commit('SET_COMPANIES', res.user.companies,)
          commit('SET_COMPANYID',res.user.company.id)
          setUserInfo(res.user, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeCompanyId()
          resolve()
        
        
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    },
    setCompanyId({ commit }, companyid) {
      commit('SET_COMPANYID', companyid)
    }
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.codes) {
    commit('SET_CODES', res.codes)
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  }
  commit('SET_NAME', res.userName)
  commit('SET_AVATAR', res.avatar)
  commit('SET_EMAIL', res.email)
  commit('SET_CREATE_TIME', parseTime(res.createTime))
}

export default user
