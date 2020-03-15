import {
	requestFun
} from "./index.js";

// 登录接口
export const login = (data) => {
	return requestFun("login", "POST", {}, {
		"authorization": data,
		"content-type": "application/json"
	}).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
// 获取分区
export const getPar = (data) => {
	return requestFun("get-par", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
// 获取台卓
export const getAllPar = (data) => {
	return requestFun("get-allPar", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
// 开台或预定
export const openDesk = (data) => {
	return requestFun("one-open", "POST", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
// 确定开台或预定
export const sureOpenOrBookDesk = (data) => {
	return requestFun("open-num", "POST", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
// 获取已开台或预定的台桌信息
export const doGetnumDetail = (data) => {
	return requestFun("get-numDetail", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
