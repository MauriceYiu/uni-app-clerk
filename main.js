import Vue from 'vue'
import App from './App'
import store from './store/index'


Vue.config.productionTip = false

Vue.filter('numberToAllDate', function(val) {
	let date = new Date(val);
	let dateStr = date.getFullYear() + '/' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() +
			1)) + '/' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' +
		(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() :
			date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return dateStr;
});


Date.prototype.Format = function (fmt) { //
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
