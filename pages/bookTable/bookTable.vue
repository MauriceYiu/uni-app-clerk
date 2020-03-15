<template>
	<view class="book-table">
		<view class="book-table-wrap">
			<time-selector showType="dateTotime" beginDate="2019-01-01" endDate="2030-12-31" beginTime="00:00:00" endTime="23:59:59"
			 @btnConfirm="btnConfirm">
				<view class="item" @click="setDateType='arrive'">
					<view class="item-left">
						<text>预抵时间</text>
					</view>
					<view class="item-right">
						<text>{{bookInfo.arriveTime}}</text>
					</view>
				</view>
			</time-selector>
			<time-selector showType="dateTotime" beginDate="2019-01-01" endDate="2030-12-31" beginTime="00:00:00" endTime="23:59:59"
			 @btnConfirm="btnConfirm">
				<view class="item" @click="setDateType='cancel'">
					<view class="item-left">
						<text>取消时间</text>
					</view>
					<view class="item-right">
						<text>{{bookInfo.cancelTime}}</text>
					</view>
				</view>
			</time-selector>
			<view class="item" @click="open('phone')">
				<view class="item-left">
					<text>联系电话</text>
				</view>
				<view class="item-right">
					<text>{{bookInfo.phoneNum}}</text>
				</view>
			</view>
			<view class="item" @click="open('bookName')">
				<view class="item-left">
					<text>预订人</text>
				</view>
				<view class="item-right">
					<text>{{bookInfo.bookName}}</text>
				</view>
			</view>
			<view class="item" @click="open('people')">
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
				<button type="primary" @click="book">确定预订</button>
			</view>
		</view>
		<view class="mask" v-if="showMaskInp" @click.stop="showMaskInp=false">
			<view class="mask-wrap" @click.stop="">
				<view class="inp-val">
					<text class="tit">请输入</text>
					<input type="text" class="inp" v-model="inpVal" placeholder="请输入..." />
					<button type="primary" class="btn" @click.stop="setInpVal">确定</button>
				</view>
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
	import timeSelector from '@/components/wing-time-selector/wing-time-selector.vue';
	export default {
		components: {timeSelector},
		data() {
			return {
				setDateType:'',//设置到达时间或者取消时间
				nowInpType:"",//当前输入信息的类型，如phone，如人数等
				showMaskInp:false,//是否显示输入信息弹框
				inpVal:"",//用户输入的值，如电话号码，预订人等
				curSelTable:{
					parId:-1,
					deskId:-1,
					source:""
				},
				storeId:"",
				nowEmp:{},
				curSelTableOpenInfo:{},//台桌初始信息
				bookInfo:{
					arriveTime:new Date().Format("yyyy/MM/dd hh:mm:ss"),//预计抵达时间
					cancelTime:new Date().Format("yyyy/MM/dd hh:mm:ss"),//取消时间
					phoneNum:"",//联系电话
					bookName:""//预订人
				}
			};
		},
		methods:{
			btnConfirm(e){
				console.log(e);
				if(this.setDateType == 'arrive'){
					this.bookInfo.arriveTime = e.key;
				}else{
					this.bookInfo.cancelTime = e.key;
				}
			},
			setInpVal(){
				//设置输入框信息
				switch (this.nowInpType){
					case "phone":
						this.bookInfo.phoneNum = this.inpVal;
						break;
					case "bookName":
						this.bookInfo.bookName = this.inpVal;
						break;
					case "people":
						this.curSelTableOpenInfo.people = this.inpVal;
						break;
					default:
						break;
				}
				this.inpVal = "";
				this.nowInpType = "";
				this.showMaskInp = false;
			},
			open(type){
				//设置输入类型
				this.nowInpType = type;
				this.showMaskInp = true;
			},
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
						title: "请填写人数",
						duration: 3000,
						icon: "none"
					});
					return false;
				}
				if(!this.bookInfo.phoneNum){
					uni.showToast({
						title: "请填写联系电话",
						duration: 3000,
						icon: "none"
					});
					return false;
			    }
			    if(!this.bookInfo.bookName){
					uni.showToast({
						title: "请填写预定人名字",
						duration: 3000,
						icon: "none"
					});
					return false;
			    }
				return true;
			},
			book(){
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
				  bookMobile:this.bookInfo.phoneNum,
				  notice:this.curSelTableOpenInfo.notice,
				  people:this.curSelTableOpenInfo.people,
				  parName:this.curSelTableOpenInfo.parName,
				  parId:this.curSelTable.parId,
				  numName:this.curSelTableOpenInfo.numName,
				  bookTime:new Date(this.bookInfo.arriveTime.replace(/\-/g, "/")).Format("yyyy-MM-dd hh:mm:ss"),
				  cancelTime:new Date(this.bookInfo.cancelTime.replace(/\-/g, "/")).Format("yyyy-MM-dd hh:mm:ss"),
				  bookName:this.bookInfo.bookName,
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
	@import "./bookTable.scss";
</style>
