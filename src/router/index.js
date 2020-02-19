// 导入vue及路由插件
import Vue from 'vue'
import VueRouter from 'vue-router'
// 注册路由
Vue.use(VueRouter)
// 导入子组件

// 创建规则
const routes = []
// 实例化路由对象
const router = new VueRouter({
    routes
})

// 输出路由对象
export default router