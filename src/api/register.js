// 这个文件里面放所有与注册有关的接口

// 导入axios
import axios from 'axios'

// 准备封装接口的方法

// 获取手机验证码
// 把接口需要的数据当作data传进来
export function sendSMS(data) {
    return axios({
        url: process.env.VUE_APP_URL + "/sendsms",
        method: "post",
        data,
        // 携带cookie
        withCredentials: true
    })
}

export function register(data) {
    return axios({
        url: process.env.VUE_APP_URL + '/register',
        method: 'post',
        data,
        withCredentials: true
    })
}