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
// 获取台卓
export const getAllPar = (data) => {
	return requestFun("get-allPar", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}