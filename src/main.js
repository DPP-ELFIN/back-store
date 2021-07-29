import Vue from 'vue'
import App from './App.vue'
import router from './router'
//element-ui组件
import './plugins/element.js'
//全局样式
import './assets/css/global.css'
//iconfont图标样式
import './assets/font/iconfont.css'

//axios S
import axios from 'axios'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
//添加认证
axios.interceptors.request.use(config=>{
  //console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios
//axios E


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
