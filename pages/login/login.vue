<template>
	<view class="login">
		<view class="login-wrap">
			<text class="com-info">火星收银</text>
			<view class="login-info">
				<input type="text" v-model="username" placeholder="请输入用户名..."/>
			</view>
			<view class="login-info">
				<input type="password" v-model="password" placeholder="请输入密码..."/>
			</view>
			<view class="do-login">
				<button type="primary" @click="doLogin">登录</button>
			</view>
		</view>
		<view class="sel-store" v-if="showStoreList" @click="showStoreList=false">
			<view class="sel-store-wrap" @click.stop="">
				<scroll-view class="sc-view" scroll-y="true">
					<view class="store-item" v-for="(item,index) in storeArr" @click="selStore(item)" :key="index">
						{{item.storeName}}
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import { Base64 } from 'js-base64';
	import { login } from "./../../api/api.js";
	export default {
		data() {
			return {
				username:"",//用户名
				password:"",//密码
				showStoreList:false,
				storeArr:[],//店铺列表
			};
		},
		methods:{
			selStore(item){
				console.log(item);
				uni.setStorage({
				    key: 'storeId',
				    data: item.storeId
				});
				uni.setStorage({
				    key: 'storePayMode',
				    data: item.payMode
				});
				uni.setStorage({
				    key: 'empId',
				    data: item.employeeId
				});
				uni.setStorage({
				    key: 'empName',
				    data: item.employeeName
				});
				uni.navigateTo({
				    url: '../index/index'
				});
			},
			doLogin(){
				if(this.username==""||this.password==""){
					uni.showToast({
						icon:"none",
					    title: '请正确填写用户名和密码',
					    duration: 3000
					});
					return;
				}
				let data = {
					"username":this.username,
					"password":this.password
				}
				let token = "Basic "+Base64.encode(data.username + ":" + data.password);
				login(token).then(res=>{
					if(res.data.length){
						// 存储token
						uni.setStorage({
						    key: 'token',
						    data: token
						});
						if(res.data.length>1){
							this.showStoreList = true;
							this.storeArr = res.data;
						}else{
							uni.setStorage({
							    key: 'storeId',
							    data: res.data[0].storeId
							});
							uni.setStorage({
							    key: 'storePayMode',
							    data: res.data[0].payMode
							});
							uni.setStorage({
							    key: 'empId',
							    data: res.data[0].employeeId
							});
							uni.setStorage({
							    key: 'empName',
							    data: res.data[0].employeeName
							});
							uni.navigateTo({
							    url: '../index/index'
							});
						}
					}else{
						uni.showToast({
							icon:"none",
						    title: '暂无店铺，请至后台注册。',
						    duration: 3000
						});
					}
				});
			}
		},
		onShow() {
			try {
			    uni.clearStorageSync();
			} catch (e) {
				//
			}
		},
		onUnload() {
			this.showStoreList = false;
			this.username = "";
			this.password = "";
		},
		onLoad() {
			try {
			    uni.clearStorageSync();
			} catch (e) {
				//
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "./login.scss"
</style>
