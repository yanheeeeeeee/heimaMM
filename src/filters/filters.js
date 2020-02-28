// 此处存放全局过滤器
import Vue from 'vue'

// 时间过滤器
// 导入moment
import moment from 'moment'
Vue.filter('formatTime', function (val) {
    // value是一个时间戳, 需要处理成年-月-日的格式
    //YYYY-MM-DD
    return moment(val).format("YYYY-MM-DD")
})