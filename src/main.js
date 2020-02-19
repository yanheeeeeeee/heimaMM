import Vue from 'vue'
import App from './App.vue'

// 导入router实例对象
import router from './router/index.js'

// 导入elementUI插件及css
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 注册elementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 把路由对象挂载到vue实例中
  router
}).$mount('#app')
