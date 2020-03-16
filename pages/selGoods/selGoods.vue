<template>
	<view class="sel-goods">
		<view class="sel-goods-wrap">
			<view class="left-cont">
				<view :class="nowSelTypeIndex==index?'cate-item active':'cate-item'" v-for="(item,index) in goods" @click="setNowSelTypeIndex(index)"
				 :key="index">
					<text>{{item.typeName}}</text>
				</view>
			</view>
			<view class="right-cont">
				<view class="goods-item" v-for="(item,index) in goods[nowSelTypeIndex].data" :key="index">
					<view class="goods-img">
						<image class="goods-img" :src="item.image" mode=""></image>
					</view>
					<view class="goods-item-info">
						<view class="goods-item-name">
							{{item.productName}}
						</view>
						<view class="goods-item-other-info">
							<view class="goods-price">
								￥{{item.price}}
							</view>
							<view class="goods-count">
								<text class="count">{{item.qty}}</text>
								<view class="add" @click="modifyItem('add',item)">
									<text class="iconfont icon-tianjia-xue"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cart">
			<view class="cart-wrap">
				<view class="cart-img" @click="showNowSeledGoods=!showNowSeledGoods">
					<image class="img" src="../../static/cart.png" mode=""></image>
					<text class="seled-count" v-if="totalCount>0">{{totalCount}}</text>
				</view>
				<view class="total-amount">
					￥{{totalAmount}}
				</view>
				<view class="right">
					<view class="sure-add" @click.stop="addGoodsItem">
						<text>添加</text>
					</view>
					<view class="sure" @click.stop="goSureSelGoods">
						<text>支付</text>
					</view>
				</view>
			</view>
			<view class="seled-goods" v-if="showNowSeledGoods&&nowSelectGoods.length" @click.stop="showNowSeledGoods=false">
				<view class="seled-goods-wrap" @click.stop="">
					<view class="item" v-for="(item,index) in nowSelectGoods" :key="index">
						<view class="item-name">
							{{item.productName}}
						</view>
						<view class="item-amount">
							￥{{item.price}}
						</view>
						<view class="item-modify">
							<view class="reduce modi-btn" @click.stop="modifyItem('reduce',item)">
								<text class="iconfont icon-jianshao"></text>
							</view>
							<view class="count">
								{{item.count}}
							</view>
							<view class="add modi-btn" @click.stop="modifyItem('add',item)">
								<text class="iconfont icon-tianjia-xue"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getGoods,
		getGoodsSpec,
		pay,
		getPayOrderInfo,
		addGoods
	} from "../../api/api.js";
	import {mapGetters,mapActions} from "vuex";
	export default {
		data() {
			return {
				showNowSeledGoods:false,
				nowSelTypeIndex: 0,
				goodsCates: [], //商品分类
				storeId: "",
				goods: [], //商品
				canClick:true,
				nowGoodsSpecs:[],//商品规格
				nowSelectGoods:[],//当前所选择的商品
				clickCount:0,
				totalAmount:0,//总金额
				totalCount:0,//总数量
			};
		},
		watch:{
			"clickCount":function(val){
				let nowSelectGoods = this.nowSelectGoods;
				let totalAmount=0;
				let totalCount=0;
				for(let i=0;i<nowSelectGoods.length;i++){
				if(nowSelectGoods[i].specId!=0){
					totalAmount += Number(Number(nowSelectGoods[i].allPrice).toFixed(2));
					totalCount += nowSelectGoods[i].count;
				}else{
					totalAmount += Number(Number(nowSelectGoods[i].count * nowSelectGoods[i].price).toFixed(2));
					totalCount += nowSelectGoods[i].count;
				}
				}
				this.totalAmount = totalAmount.toFixed(2);
				this.totalCount = totalCount;
			},
		},
		methods: {
			...mapGetters(['getNowDeskOrderInfo',"getNowSelDesk"]),
			...mapActions(['setIsAddItem',"saveNowDeskOrderInfo"]),
			async addGoodsItem(){
				if(!this.totalCount){
					uni.showToast({
						icon:"none",
						title:"请选择商品"
					})
					return;
				}
				let reqlist = [];
				for(let i=0;i<this.nowSelectGoods.length;i++){
					let obj = {
						productCount:this.nowSelectGoods[i].count,
						spec:this.nowSelectGoods[i].qty,
					}
					if(this.nowSelectGoods[i].setMealEnabled){
					  obj = Object.assign(obj,{
						  productId:"",
						  setMealId:this.nowSelectGoods[i].setMealId,
					  });
					}else{
					  obj = Object.assign(obj,{
						  productId:this.nowSelectGoods[i].productId,
						  setMealId:0,
					  });
					}
					reqlist.push(obj);
				}
				console.log(this.curSelTable);
				
				let empName = uni.getStorageSync("empName");
				let phone = uni.getStorageSync("phone");
				let data = {
					numId:this.curSelTable.deskID,
					storeId:this.storeId,
					createName:empName,
					createMobile:phone,
					reqList:reqlist,
					orderId:this.nowDeskOrderInfo.res.orderId
				}
				// 
				await addGoods(data).then(res=>{
					//
					if(res.data.result.code == 200){
						uni.showToast({
							icon:"none",
							title:"添加成功"
						});
						uni.redirectTo({
							url:"../index/index"
						})
					}
				});
			},
			async goSureSelGoods(){
				//
				await getPayOrderInfo({
					numId:this.nowDeskOrderInfo.numTrans.numId,
					orderId:this.nowDeskOrderInfo.res.orderId,
					percent:"",
					price:""
				}).then(res1=>{
					if(res1.data.code == 200){
						this.nowPayInfo = res1.data.data;
					}
				});
				let me = this;
				let listRes = [];
				for(let i=0;i<this.nowPayInfo.list.length;i++){
					let obj = {
						id:this.nowPayInfo.list[i].id,
						numEnabled:this.nowPayInfo.list[i].numEnabled,
						discount:this.nowPayInfo.list[i].discount,
						amount:this.nowPayInfo.list[i].amount,
					}
					listRes.push(obj);
				}
				
				uni.scanCode({
				    onlyFromCamera: true,
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
						let data = {
							closeEnabled:false,
							count:me.totalCount,
							orderId:me.nowDeskOrderInfo.res.orderId,
							numId:me.nowPayInfo.numId,
							allCouponDiscount:me.nowPayInfo.allCouponDiscount.toFixed(2),
							allHandDiscount:me.nowPayInfo.allHandDiscount.toFixed(2),
							allMemberDiscount:me.nowPayInfo.allMemberDiscount.toFixed(2),
							allTimeDiscount:me.nowPayInfo.allTimeDiscount.toFixed(2),
							discountAmount:me.nowPayInfo.discountAmount.toFixed(2),
							originalPrice:me.nowPayInfo.originalPrice.toFixed(2),
							totalAmount:me.nowPayInfo.totalAmount.toFixed(2),
							amount:me.nowPayInfo.amount.toFixed(2),
							notes:"",
							listRes,
							channel:"PAYCARD",
							authCode:res.result,
						};
						pay(data).then(res=>{
							if(res.data.code == 200){
								uni.showToast({
									icon:"none",
									title:"支付成功!"
								});
								uni.redirectTo({
									url:"../index/index"
								});
							}else{
								uni.showToast({
									icon:"none",
									title:res.data
								});
							}
						})
				    }
				});
			},
			setNowSelTypeIndex(index) {
				this.nowSelTypeIndex = index;
			},
			checkGoodsCount(item) {
				if (item.stockEnabled) {
					console.log(item);
					console.log("check--------------------check1");
					console.log(this.nowSelectGoods);
					console.log("check--------------------check2");
					console.log(this.curSelGoods);
					for (let i = 0; i < this.nowSelectGoods.length; i++) {
						if (item.productId == this.nowSelectGoods[i].productId) {
							if (item.stockCount <= this.nowSelectGoods[i].count) {
								uni.showToast({
									icon:"none",
									title:"商品库存不足!"
								});
								return false;
							}
						}
					}
				}
				return true;
			},
			modifyItem(type, item) {
				if (type == 'add') {
					if (!this.checkGoodsCount(item)) {
						return;
					}
				}
				if (item.lowerShelf) {
					uni.showToast({
						icon:"none",
						title:"此商品已下架!"
					});
					return;
				}
				this.clickCount++;
				let nowSelectGoods = this.nowSelectGoods;
				if (type == 'add') {
					if (item.specEnabled) {
						this.getSpecs(item);
						return;
					}
					console.log(item);
					let flag = false;
					let index;
					for (let i = 0; i < nowSelectGoods.length; i++) {
						if (nowSelectGoods[i].productId == item.productId && nowSelectGoods[i].specEnabled == item.specEnabled) {
							flag = true;
							index = i;
						}
					}
					if (flag) {
						nowSelectGoods[index].count++;
					} else {
						item.count++;
						nowSelectGoods.push(item);
					}
					this.nowSelectGoods = nowSelectGoods;
					console.log(item)
				} else {
					let flag = false;
					let index;
					console.log(item.productId);
					for (let i = 0; i < nowSelectGoods.length; i++) {
						if (nowSelectGoods[i].productId == item.productId && nowSelectGoods[i].specEnabled == item.specEnabled) {
							flag = true;
							index = i;
						}
					}
					console.log(index);
					if (flag) {
						nowSelectGoods[index].count--;
						if (nowSelectGoods[index].count <= 0) {
							nowSelectGoods.splice(index, 1);
						}
					}
					this.nowSelectGoods = nowSelectGoods;
				}
			},
			// 获取规格
			getSpecs(item) {
				if (!this.canClick) {
					return;
				}
				this.canClick = false;
				getGoodsSpec({
					productId: item.productId
				}).then(res => {
					this.canClick = true;
					let specs = res.data.data;

					for (let i = 0; i < specs.length; i++) {
						specs[i].count = 0;
						specs[i].allPrice = specs[i].price;
						if (specs[i].setMealEnabled) {
							specs[i].productId = specs[i].setMealId;
						}
					}
					if (specs.length == 1) {
						// 加入库存限制
						if (item.stockEnabled) {
							if (item.qty < 1) {
								uni.showToast({
									icon:"none",
									title:"商品库存不足!"
								});
								return;
							}
						}
						// 加入库存限制end
						this.modifyItem("add", specs[0]);
						return;
					}
					this.nowGoodsSpecs = specs;
				}).catch(err => {
					this.canClick = true;
				});
			},
		},
		onLoad() {
			let storeId = uni.getStorageSync('storeId');
			this.storeId = storeId;
			getGoods({
				storeId
			}).then(res => {
				this.goods = res.data.data;
			});
			// 从vuex获取信息
			this.nowDeskOrderInfo = this.getNowDeskOrderInfo();
			this.curSelTable = this.getNowSelDesk();
		}
	}
</script>

<style lang="scss" scoped>
	@import "./selGoods.scss";
</style>
