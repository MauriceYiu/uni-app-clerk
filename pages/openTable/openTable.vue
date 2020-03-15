<template>
	<view class="open-table">
		<view class="open-table-wrap">
			<view class="item">
				<view class="item-left">
					<text>开单时间</text>
				</view>
				<view class="item-right">
					<text>{{openTime}}</text>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<text>顾客人数</text>
				</view>
				<view class="item-right">
					<text>{{curSelTableOpenInfo.people}}</text>
				</view>
			</view>
			<view class="item">
				<view class="item-left">
					<text>服务员</text>
				</view>
				<view class="item-right">
					<text>{{nowEmp.empName}}</text>
				</view>
			</view>
			<view class="item oth">
				<view class="item-left">
					<text>备注信息</text>
				</view>
				<view class="item-right">
					<textarea class="area" v-model="curSelTableOpenInfo.notice" value="" placeholder="请输入备注信息" />
					</view>
			</view>
			<view class="btn">
				<button type="primary" @click="open">确定开台</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		openDesk,
		sureOpenOrBookDesk
	} from "../../api/api.js";
	import {numberToAllDate} from "../../tools/index.js";
	export default {
		data() {
			return {
				storeId:"",
				curSelTable:{
					parId:-1,
					deskId:-1,
					source:""
				},
				nowEmp:{},
				curSelTableOpenInfo:{},//开台初始信息
			};
		},
		computed:{
			openTime(){
				return numberToAllDate(this.curSelTableOpenInfo.beginTime);
			}
		},
		methods:{
			check(){
				if(!/^\d+$/.test(this.curSelTableOpenInfo.people)){
					uni.showToast({
						title: "人数填写错误",
						duration: 3000,
						icon: "none"
					});
					return false;
				}
				if(this.curSelTableOpenInfo.people == 0){
					uni.showToast({
						title:"请填写人数",
						duration: 3000,
						icon: "none"
					});
					return false;
				}
				return true;
			},
			open(){
				let flag = this.check();
				if(!flag){
					return;
				}
				sureOpenOrBookDesk({
						numId:this.curSelTable.deskId,//桌号id
						source:this.curSelTable.source,
						storeId:this.storeId,
						empName:this.nowEmp.empName,
						empId:this.nowEmp.empId,
						mobile:this.nowEmp.mobile,
						notice:this.curSelTableOpenInfo.notice,
						people:this.curSelTableOpenInfo.people,
						parName:this.curSelTableOpenInfo.parName,
						parId:this.curSelTable.parId,
						numName:this.curSelTableOpenInfo.numName,
						beginTime:new Date(this.curSelTableOpenInfo.beginTime).Format("yyyy-MM-dd hh:mm:ss")
				}).then(res=>{
					if(res.data.code == 400){
						uni.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 3000
						});
						return;
					}
					uni.redirectTo({
						url:"../index/index"
					});
				}).catch(err=>{
				});
			},
			getOpenOrBookInfo() {
				openDesk({
					storeId: this.storeId,
					parId: this.curSelTable.parId,
					numId: this.curSelTable.deskId,
				}).then(res => {
					if (res.data.result.code == 200) {
						let data = res.data.data;
						data = Object.assign(data, {
							notice: ""
						});
						this.curSelTableOpenInfo = data;
						let empId = uni.getStorageSync('empId');
					  if(this.curSelTableOpenInfo.names.length==1){
						  this.nowEmp = this.curSelTableOpenInfo.names[0];
					  }
				
					  for(let i=0;i<this.curSelTableOpenInfo.names.length;i++){
						  if(this.curSelTableOpenInfo.names[i].empId == empId){
							  this.nowEmp = this.curSelTableOpenInfo.names[i];
						  }
					  }
					} else if (res.data.result.code == 400) {
						uni.showToast({
							icon: "none",
							title: res.data.result.msg,
							duration: 3000
						});
					}
				}).catch(err => {
				})
			},
		},
		onShow() {
			let storeId = uni.getStorageSync('storeId');
			this.storeId = storeId;
			this.curSelTable={
				parId:option.parId,
				deskId:option.deskId,
				source:option.source
			};
			this.getOpenOrBookInfo();
		},
		onLoad(option) {
			let storeId = uni.getStorageSync('storeId');
			this.storeId = storeId;
			this.curSelTable={
				parId:option.parId,
				deskId:option.deskId,
				source:option.source
			};
			this.getOpenOrBookInfo();
		}
	}
</script>

<style lang="scss" scoped>
	@import "./openTable.scss";
</style>
