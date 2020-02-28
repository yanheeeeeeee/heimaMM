import Vue from 'vue'
import App from './App.vue'


// 导入全局样式
import './style/base.css'

// 导入router实例对象
import router from './router/index.js'
// 导入vuex对象
import store from './store/index.js'
// 导入axios插件
import axios from 'axios'
// 给axios设置一个及地址
axios.defaults.baseURL = "http://127.0.0.1/heimamm/public"
// 在VUE原型中添加axios
Vue.prototype.$axios = axios
// 导入elementUI插件及css
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 注册elementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

// 导入全局过滤器
import './filters/filters.js'

new Vue({
  render: h => h(App),
  // 把路由对象挂载到vue实例中
  router,
  // 挂载仓库对象
  store
}).$mount('#app')