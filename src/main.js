import Vue from 'vue'
import App from './App.vue'
import router from './router'
//element-ui组件
import './plugins/element.js'
//全局样式
import './assets/css/global.css'
//iconfont图标样式
import './assets/font/iconfont.css'

//axios
import axios from 'axios'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
