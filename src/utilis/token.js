// 将token的key用一个常量保存下来, 以后修改key直接修改该常量即可. 常量名一般为大写
const TOKENKEY = "mmToken"

// 获取token
export function getToken() {
    return window.localStorage.getItem(TOKENKEY)
}

// 设置token, 或者叫保存token , 它有一个参数用于接受token值
export function setToken(token) {
    window.localStorage.setItem(TOKENKEY, token)
}

// 删除token
export function removeToken() {
    window.localStorage.removeItem(TOKENKEY)
}