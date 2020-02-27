import Vue from 'vue'

// 1.导入Vuex
import Vuex from 'vuex'
// 2.注册Vuex
Vue.use(Vuex)
// 3.实例话Vuex
const store = new Vuex.Store({
    state: {
        // 储存用户信息
        avatar: '',
        username: ''
    },
    mutations: {
        // 存入username
        setUsername(state, val) {
            state.username = val
        },
        // 存入avatar
        setAvatar(state, val) {
            state.avatar = val
        }
    }
})

// 返回vuex实例
export default store