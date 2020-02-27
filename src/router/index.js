// 导入vue及路由插件
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 注册路由
Vue.use(VueRouter)
// 导入子组件
import login from '../views/login/index.vue'
import index from '../views/index/index.vue'
import business from '../views/index/business/business.vue'
import chart from '../views/index/chart/chart.vue'
import question from '../views/index/question/question.vue'
import subject from '../views/index/subject/subject.vue'
import user from '../views/index/user/user.vue'
// 导入api文件
import { info } from "@/api/index.js";
import { removeToken } from '@/utilis/token.js'
import { Message } from 'element-ui';
import store from '../store'
// 创建规则
const routes = [{
    // 路径与组件的名字尽量保持一致
    path: "/login",
    component: login,
    meta: { title: '登录' }
},
{
    // 路径与组件的名字尽量保持一致
    path: "/index",
    component: index,
    meta: { title: '首页' },
    children: [
        // 子路由一般不加/
        { path: "user", component: user, meta: { title: '用户列表' } },
        { path: "chart", component: chart, meta: { title: '数据概览' } },
        { path: "business", component: business, meta: { title: '企业列表' } },
        { path: "question", component: question, meta: { title: '题库列表' } },
        { path: "subject", component: subject, meta: { title: '学科列表' } },
    ]
}]
// 实例化路由对象
const router = new VueRouter({
    routes
})

// 创建路由白名单
let whiteUrl = ['/login']


// 可以直接放行的页面，在真实项目可能有多个
// 注册、广告页面、给用户看的新闻页面、给普通用户展示的产品页面，都不需要做登录判断
// 路由白名单，里面存放了一些不需要做权限验证的路径，遇到这些白名单里的路径就直接跳转
// if (to.path == '/login') {

// 如果我白名单里包含了你要去的页面的路径，代表你这个页面
// 是不需要权限验证的，直接放行就可以了

// 导航守卫: 跳转前
router.beforeEach((to, from, next) => {
    // 开始进度条
    NProgress.start()
    // 如果在路由白名单内,则直接跳转
    if (whiteUrl.includes(to.path)) {
        next()
    } else { //其他请求则加token真假判断
        info().then(res => {
            if (res.data.code == 200) { // 如果返回信息状态码为200 ,则说明token正确
                // 将接口返回的数据存入仓库
                store.commit('setAvatar', process.env.VUE_APP_URL + '/' + res.data.data.avatar)
                store.commit('setUsername', res.data.data.username)
                // 跳转至目标路径
                next()
            } else {
                //弹出提示 注意：在路由的js文件里，this不是vue实例，所以没有this.$message
                // 直接用报错的
                // this.$message.error('登录状态有问题，请重新登录')
                Message.error('登录状态异常，请重新登录！')

                //删除本地token
                removeToken();

                // 手动在这里把进度条完成
                NProgress.done();

                //打回登录页
                next('/login')
            }
        })

    }
})
router.afterEach((to) => {
    // 进来以后结束进度条
    NProgress.done();

    // 取出当前要去的页面的标签，设置给title
    document.title = to.meta.title;
})
// 输出路由对象
export default router