<template>
	<view>
		<view class="order-view" :style="{height: orderHeight}">
			<uni-collapse accordion="true" @change="changeActive">
				<uni-collapse-item :title="order.tableNum+'号桌'" v-for="(order, index) in activeOrder" :key="order.id" :name="order.id"
				 :open="activeIndex==index">
					<list class="order-detail-view">
						<cell class="order-detail" v-for="item in order.detail" :key="item.id">
							<image class="order-image" src="../../static/activity.png"></image>
							<text>{{ item.name }}</text>
							<text class="uni-flex-item">{{ item.price }}</text>
							<uni-number-box class="uni-flex-item" :value="item.num" @change="changeDishNum($event, item)"></uni-number-box>
							<text class="uni-flex-item">{{ item.num*item.price }}元</text>
						</cell>
					</list>
					<view class="order-control">
						<text class="order-totalprice">总价：{{ order.totalPrice }}元</text>
						<view class="btn" @click="toChangeTable(order.tableNum)">换座</view>
						<view class="btn btn-dish" @click="toAddDish">点菜</view>
						<view class="btn btn-pay" @click="showModal(order.totalPrice)">买单</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>

		<view class="dish-view">
			<view>当前订单号：{{ selectOrderId }}</view>
			<input class="dish-input" type="number" placeholder="请输入价格" @input="onInput" :focus="isInputFocus" v-model="inputValue"
			 @blur="handleInputBlur" />
			<list>
				<cell class="order-detail" v-for="(item, index) in choiceDishData" :key="item.id">
					<text class="uni-flex-item">{{ item.name }}</text>
					<text class="uni-flex-item">{{ item.price.toFixed(1) }}</text>
					<button size="mini" type="primary" @click="addDish(index)">+1</button>
					<button size="mini" type="primary" @click="addDish(index, 2)">+2</button>
				</cell>
			</list>
		</view>

		<uni-fab ref="fab" :pattern="pattern" :content="content" @trigger="trigger" direction="vertical"></uni-fab>

		<uni-popup ref="popup" type="bottom" @change="popupChange">
			<view class="popup-view">
				<view class="popup-top">
					<uni-icons class="cancel-icon" type="closeempty" size="30" color="#DD524D" @click="showPopup(false)"></uni-icons>
					<text>{{ oldTableNum }}</text>
					<uni-icons type="arrowthinright" size="30"></uni-icons>
					<text>{{ newTableNum }}</text>
					<uni-icons class="confirm-icon" type="checkmarkempty" size="30" color="#007AFF" @click="changeTable"></uni-icons>
				</view>
				<picker-view :value="pickerValue" class="picker-view" @change="pickerChange">
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in allTable" :key="index">{{ item }}号桌</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'

	import {
		mapGetters
	} from 'vuex'
	import {
		shopConfig,
		homePageConfig,
	} from '@/common/config.js'
	import {
		dishData,
		orderData,
	} from '@/common/test_data.js'

	var self = null;

	export default {
		components: {
			uniFab,
			uniPopup,
			uniIcons,
			uniCollapse,
			uniNumberBox,
			uniCollapseItem,
		},
		data() {
			return {
				orderData: [],
				selectOrderId: "",
				activeIndex: -1,
				choiceDishData: [],
				inputValue: "",
				isInputFocus: false,
				pattern: {},
				content: [],
				allTable: [],
				pickerValue: [0],
				oldTableNum: 0,
				newTableNum: 0,
			}
		},
		computed: {
			...mapGetters(["sys_info"]),
			orderHeight() {
				return this.sys_info.windowHeight / 2 + 'px';
			},
			activeOrder() {
				var activeOrder = [];
				for (var i in this.orderData) {
					if (!this.orderData[i].isPaid) {
						activeOrder.push(this.orderData[i]);
					}
				}
				return activeOrder;
			}
		},
		onLoad() {
			self = this;
			this.orderData = orderData;
			this.choiceDishData = dishData;
			this.pattern = homePageConfig.fabPattern;
			this.content = homePageConfig.fabContent;
			let allTable = [];
			for (let i = 0; i <= shopConfig.tableNum; i++) {
				allTable.push(i);
			}
			this.allTable = allTable;
		},
		methods: {
			changeTable() {
				var order = this.searchOrderById(this.selectOrderId);
				order.tableNum = this.newTableNum;
				this.showPopup(false);
				uni.showToast({
					title: 'success',
					duration: 1000,
					icon: "none"
				});
			},

			pickerChange(e) {
				this.newTableNum = e.detail.value[0];
			},

			showPopup(choiceShow = true) {
				if (choiceShow == true) {
					this.$refs.popup.open();
				} else {
					this.$refs.popup.close();
				}
			},

			popupChange(e) {
				if (e.show == true) {
					uni.hideTabBar({});
				} else {
					uni.showTabBar({});
				}
			},

			toChangeTable(oldTableNum) {
				this.pickerValue = [oldTableNum];
				this.oldTableNum = oldTableNum;
				this.showPopup();
			},

			trigger(e) {
				this.content[e.index].active = !e.item.active;
				if (this.content[1].active == true) {
					this.addNewOrder();
					this.$refs.fab.close();
					this.content[1].active = false;
				}
			},

			toAddDish() {
				this.isInputFocus = true;
			},

			onInput(e) {
				this.inputValue = e.target.value;
			},

			handleInputBlur(e) {
				this.isInputFocus = false;
			},

			changeActive(arr) {
				if (arr.length > 0) {
					let orderId = arr[0];
					for (var i in this.activeOrder) {
						if (this.activeOrder[i].id == orderId) {
							this.activeIndex = i;
							break;
						}
					}
					this.selectOrderId = orderId;
				} else {
					this.activeIndex = -1;
					this.selectOrderId = "";
				}
			},

			changeDishNum(newValue, item) {
				if (newValue == "" || this.activeIndex < 0) {
					return;
				}
				var selectOrder = this.activeOrder[this.activeIndex];
				var detail = selectOrder.detail;
				for (var i in detail) {
					if (detail[i].id == item.id) {
						break;
					}
				}
				if (newValue > 0) {
					detail[i].num = newValue;
				} else {
					detail.splice(i, 1);
				}
				selectOrder.totalPrice = this.getTotalPrice(detail);
			},

			showModal(totalPrice) {
				uni.showModal({
					title: '提示',
					content: `确定顾客已买单？\n合计：${totalPrice}元`,
					success: function(res) {
						if (res.confirm) {
							self.payBill();
						}
					}
				});
			},

			payBill() {
				var order = this.searchOrderById(this.selectOrderId)
				order.isPaid = true;
				this.selectOrderId = "";
			},

			orderIdToIndex(orderId) {
				return parseInt(orderId.split("_")[1]) - 1;
			},

			getTotalPrice(detail) {
				var totalPrice = 0.0;
				detail.forEach(item => {
					totalPrice += (item.num * item.price);
				})
				return totalPrice.toFixed(1);
			},

			deepCopy(obj, cache = []) {
				if (obj === null || typeof obj !== 'object') {
					return obj
				}
				const hit = cache.filter(c => c.original === obj)[0]
				if (hit) {
					return hit.copy
				}
				const copy = Array.isArray(obj) ? [] : {}
				cache.push({
					original: obj,
					copy
				})
				Object.keys(obj).forEach(key => {
					copy[key] = this.deepCopy(obj[key], cache)
				})
				return copy
			},

			searchOrderById(orderId) {
				for (var i in this.orderData) {
					if (this.orderData[i].id == orderId) {
						break;
					}
				}
				return this.orderData[i];
			},

			addDish(index, num = 1) {
				if (!this.selectOrderId) {
					uni.showToast({
						title: '请先选择订单',
						duration: 2000,
						icon: "none"
					});
					return;
				}
				var order = this.searchOrderById(this.selectOrderId);
				var detail = order.detail;
				var find = false;
				var newDish = this.deepCopy(this.choiceDishData[index]);
				newDish["num"] = num;
				for (var i in detail) {
					if (detail[i].id == newDish.id) {
						find = true;
						break;
					}
				}
				if (find == true) {
					detail[i].num += newDish.num;
				} else {
					detail.push(newDish);
				}
				order.totalPrice = this.getTotalPrice(detail);
			},

			addNewOrder() {
				var now = new Date();
				var yyyy = now.getFullYear();
				var mm = now.getMonth() + 1;
				var str_mm = mm < 10 ? "0" + mm : mm.toString();
				var dd = now.getDate();
				var str_dd = dd < 10 ? "0" + dd : dd.toString();
				var index = this.orderData.length + 1;
				var newOrderId = `${yyyy}${str_mm}${str_dd}_${index}`;
				var newOrder = {
					id: newOrderId,
					tableNum: 0,
					isPaid: false,
					totalPrice: 0.0,
					detail: []
				};
				this.orderData.push(newOrder);
				this.activeIndex = this.activeOrder.length - 1;
				this.selectOrderId = newOrderId;
			},
		},
		watch: {
			inputValue(newV, oldV) {
				let topData = [];
				let bottomData = [];
				for (let i in dishData) {
					let value = dishData[i];
					if (value.price.toString().startsWith(newV)) {
						topData.push(value);
					} else {
						bottomData.push(value);
					}
				}
				this.choiceDishData = topData.concat(bottomData);
			}
		},
	}
</script>

<style>
	.order-view {
		overflow: scroll;
	}

	uni-collapse-item>>>.uni-collapse-cell__title {
		color: #007AFF;
	}

	.order-detail-view {
		background-color: #FFFFFF;
		padding: 9px 0;
		border-top: solid 1px #91bef0;
		border-bottom: solid 1px #91bef0;
	}

	.order-detail {
		display: flex;
		flex-direction: row;
		text-align: center;
		margin-bottom: 2px;
	}

	.order-image {
		height: 40px;
		width: 40px;
	}

	.order-control {
		display: flex;
		padding: 8px 8px;
	}

	.order-totalprice {
		font-weight: bold;
	}

	.btn {
		padding: 0 1.3em;
		border-radius: 5px;
	}

	.btn-dish {
		margin-left: auto;
		background-color: #09BB07;
	}

	.btn-pay {
		margin-left: 2px;
		background-color: #DD524D;
	}

	/* 菜单列表 */
	.dish-view {
		padding: 0 20px;
	}

	.dish-input {
		border: 1px solid #007AFF;
		height: 40px;
		margin-bottom: 5px;
	}

	/* popup座位改变 */
	.popup-view {
		height: 200px;
		background-color: #FFFFFF;
	}

	.popup-top {
		text-align: center;
		border-bottom: solid 1px #91bef0;
		padding: 0 5px;
	}

	.cancel-icon {
		float: left;
	}

	.confirm-icon {
		float: right;
	}

	.picker-view {
		height: 100px;
		margin: 10px 0;
	}

	.picker-item {
		text-align: center;
	}
</style>
