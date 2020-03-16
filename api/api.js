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
// 获取商品
export const getGoods = (data) => {
	return requestFun("get-all", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}
// 获取商品规格
export const getGoodsSpec = (data) => {
	return requestFun("get-spec", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}

// 支付
export const getPayOrderInfo = (data) => {
	return requestFun("pre-order", "GET", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}

// 添加商品
export const addGoods = (data) => {
	return requestFun("add-item", "POST", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}

// 支付
export const pay = (data) => {
	return requestFun("payments", "PUT", data).then(res => {
		console.log(res);
		return Promise.resolve(res);
	});
}

