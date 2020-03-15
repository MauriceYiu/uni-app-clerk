<template>
	<view class="index">
		<view class="tab">
			<scroll-view scroll-x="true" class="tab-sc">
				<view :class="nowIndex==-1?'tab-item active':'tab-item'" :key="-1" @click="nowIndex=-1">
					全部
				</view>
				<view :class="nowIndex==index?'tab-item active':'tab-item'" v-for="(item,index) in tabArr" :key="index" @click="setIndex(index,item)">
					{{item.partitionName}}
				</view>
			</scroll-view>
		</view>
		<view class="desk">
			<view class="desk-wrap" v-for="(item,index) in nowSelParsDesk.pars" :key="index">
				<view class="desk-par-name">
					{{item.parName}}
				</view>
				<view class="desk-items">
					<view class="desk-item" v-for="(deskItem,deskIndex) in nowSelParsDesk.pars[index].desks" @click.stop="clickTable(deskItem,deskIndex)"
					 :key="deskIndex">
						<view :class="deskCss[deskItem.status]">
							<view class="info">
								<text class="desk-name">{{deskItem.deskName}}</text>
								<text class="desk-amount">消费:{{deskItem.amount}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="click-table" v-if="showOpenOrBook" @click="showOpenOrBook=false">
			<view class="open-or-book">
				<view class="button">
					<button class="open-table" @click.stop="doOpenOrBook('BUSY')"><i class="iconfont icon-diancai"></i>开单</button>
					<button class="sure" @click.stop="doOpenOrBook('BOOK')"><i class="iconfont icon-yuyue"></i>预定</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getAllPar,
		getPar,
		openDesk,
		doGetnumDetail
	} from "../../api/api.js";
	import {WS_URL} from "../../api/index.js";
	import {
		mapActions
	} from "vuex";
	export default {
		data() {
			return {
				isOpenOrBook: "BUSY", //BUSY是开台，BOOK是预定
				showOpenOrBook: false,
				deskCss: {
					"FREE": "item-wrap free",
					"BUSY": "item-wrap busy",
					"BOOK": "item-wrap book",
					"FAULT": "item-wrap bad",
				},
				tabArr: [], //标签栏
				nowIndex: "-1", //当前所选择的标签
				storeId: "", //店铺id
				nowSelPar: {}, //当前所选择的分区
				nowSelParsDesk: [], //当前所选择的分区下面的台桌
				canClick: true, //按钮点击事件
				showOpenTable: false, //显示开台界面
				curSelTableOpenInfo: {
					numName: "",
					parName: "",
					people: 1,
					beginTime: "",
					rules: [{
						ruleName: "",
						ruleId: -1
					}],
					notice: "",
					names: [],
				}, //当前所选台桌的开台信息
				isChange: false, //当前所选台桌是否可处于修改状态
				curSelTable: {}, //用户所点击的台桌信息
				showCartInfoType: "normal", //afterOpen;此字段用于判断当前展示购物车列表的形式
				nowDeskOrderInfo: {}, //当前台桌的订单信息
			}
		},
		watch: {
			nowIndex(val) {
				if (val == -1) {
					this.getDesks(this.storeId, "ALL", 0);
				} else {
					this.getDesks(this.storeId, "ALL", this.nowSelPar.id);
				}
			}
		},
		onLoad() {
			let storeId = uni.getStorageSync('storeId');
			let token = uni.getStorageSync('token');
			this.storeId = storeId;
			getPar({
				storeId
			}).then(res => {
				this.tabArr = res.data;
			});
			this.getDesks(storeId, "ALL", 0);
			
			// 
			// uni.connectSocket({
			//     url: WS_URL+'/gs-guide-websocket',
			//     header: {
			// 		'Auth-Token':token
			//     },
			// });
			// uni.onSocketMessage(function (res) {
			//   console.log('收到服务器内容：' + res.data);
			// });
			// console.log(WS_URL)
			// 
		},
		methods: {
			...mapActions(["saveNowDeskOrderInfo", "saveNowSelDesk", "setIsAddItem", "saveOrderIdFirst", "refreshNum"]),
			// 点击台桌,进行预约或开台
			clickTable(item, index) {
				if (item.status == 'FAULT') {
					uni.showToast({
						icon: "none",
						title: "台桌故障中！请联系收银台...",
						duration: 3000
					});
					return;
				}
				this.curSelTable = item;
				this.saveNowSelDesk(item);
				if (item.status == "BUSY") {
					this.isChange = false;
					this.showCartInfoType = "normal";
					this.getnumDetail(item.deskID);
				} else if (item.status == "BOOK") {
					this.isChange = true;
					// 修改当前显示的预定信息页面，和购物车同一组件
					this.isOpenOrBook = "BOOK";
					this.showCartInfoType = "afterOpen";
					this.getnumDetail(this.curSelTable.deskID, "BOOK");
					return;
				} else if (item.status == "FREE") {
					this.isChange = false;
					this.showCartInfoType = "normal";
					this.showOpenOrBook = true;
				}
			},
			// 开台或预定
			doOpenOrBook(type) {
				this.isOpenOrBook = type;
				this.showOpenOrBook = false;
				let url = "";
				if(type == "BUSY"){
					url = '../openTable/openTable?parId='+this.curSelTable.parId+'&deskId='+this.curSelTable.deskID+'&source='+this.isOpenOrBook;
				}else{
					url = '../bookTable/bookTable?parId='+this.curSelTable.parId+'&deskId='+this.curSelTable.deskID+'&source='+this.isOpenOrBook;
				}
				uni.redirectTo({
					url
				});
			},
			getnumDetail(numId, type = "BUSY") {
				doGetnumDetail({
					numId
				}).then(res => {
					if (res.status == 200) {
						// 成功返回后显示相关界面
						this.nowDeskOrderInfo = res.data;
						this.saveNowDeskOrderInfo(res.data);
						if (type == "BUSY") {
							// this.$router.push({
							// 	path: '/goPay'
							// });
						} else if (type == "BOOK") {
							this.curSelTableOpenInfo = {
								addTime: res.data.numTrans.addTime,
								bookTime: res.data.numTrans.bookTime,
								cancelTime: res.data.numTrans.cancelTime,
								bookMobile: res.data.numTrans.bookMobile,
								bookName: res.data.numTrans.bookName,
								rules: [{
									ruleName: res.data.numTrans.rulesName,
									ruleId: res.data.numTrans.ruleId
								}],
								people: res.data.numTrans.people,
								parName: res.data.numTrans.partitionName,
								parId: res.data.numTrans.parId,
								numId: res.data.numTrans.numId,
								numName: res.data.numTrans.numName,
								names: [{
									empId: res.data.numTrans.empId,
									empName: res.data.numTrans.empName,
									mobile: res.data.numTrans.mobile
								}],
								notice: res.data.numTrans.notice
							}
							this.showOpenTable = true;
						}
					}
				});
			},
			setIndex(index, item) {
				this.nowIndex = index;
				this.nowSelPar = item;
			},
			getDesks(storeId, source, parId) {
				getAllPar({
					storeId,
					source,
					parId
				}).then(res => {
					console.log(res);
					this.nowSelParsDesk = res.data;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>
