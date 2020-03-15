let baseUrl = "https://table-api.huoxingy.com/v1/clerk/";
let wsUrl = "wss://prod-ws.huoxingy.com";

let requestApi = (url, method, data, headers = null) => {
	let header = {};
	const token = uni.getStorageSync('token');
	if(token){
		header = {
			"content-type": "application/json",
			"authorization":token
		};
	}else{
		if(url == "login"){
			headers ? header = headers : header = {
				"content-type": "application/json"
			};
		}else{
			uni.showToast({
				icon:"none",
			    title: '账号失效，请重新登录',
			    duration: 3000
			});
			uni.navigateTo({
			    url: '/pages/login/login'
			});
		}
	}
	
	return new Promise((resolve,reject) => {
		uni.request({
			url: baseUrl + url, //
			method,
			data,
			header,
			success: (res) => {
				console.log(res.data);
				if(res.data.status == 401){
					uni.showToast({
						icon:"none",
					    title: '请重新登录',
					    duration: 3000
					});
				}
				resolve(res);
			},
			fail: (res) => {
				console.log(res.data);
				uni.showToast({
					icon:"error",
					title: '错误的请求',
					duration: 3000
				});
				reject(res);
			},
			complete: () => {
				resolve({
					"isComplete": "ok"
				});
			}
		});
	});
	
}

export const requestFun = requestApi;
export const WS_URL = wsUrl;
