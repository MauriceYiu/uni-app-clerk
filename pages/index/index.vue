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
					<view class="desk-item" v-for="(deskItem,deskIndex) in nowSelParsDesk.pars[index].desks"
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
	</view>
</template>

<script>
	import {
		getAllPar,
		getPar
	} from "../../api/api.js";
	export default {
		data() {
			return {
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
			this.storeId = storeId;
			getPar({
				storeId
			}).then(res => {
				this.tabArr = res.data;
			});
			this.getDesks(storeId, "ALL", 0);
		},
		methods: {
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
