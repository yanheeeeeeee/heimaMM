import axios from 'axios';
import { getToken } from "@/utilis/token.js"
// 克隆一个axios对象出来，
// 他的名字叫indexRequest
// 他有一些初始基因，就是设置了基地址，以及设置了请求头携带token
// 所以以后，如果要是通过indexRequest这个对象去发请求，就会自动有基地址和自动携带token了
let indexRequest = axios.create({
    // 基地址
    baseURL: process.env.VUE_APP_URL,
    // 请求头
    headers: {
        token: getToken()  // return一个token
    }
})

// axios请求拦截
indexRequest.interceptors.request.use(function (config) {

    // config参数就是被拦截下来的请求的配置
    // window.console.log(config)

    // 我只要对congig里面的headers加一个token
    // 就代表你这次发的请求就有token了
    config.headers.token = getToken();//这句话就代表每次首页里的请求都会被拦下来并且自动加一个token


    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 获取用户信息
export function info() {
    return indexRequest({
        url: "/info",
        method: 'get',
    })
}

// 退出登录=
export function logout() {
    return indexRequest({
        url: "/logout",
        method: 'get',
    })
}

