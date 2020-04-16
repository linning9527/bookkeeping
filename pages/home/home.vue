<template>
	<view>
		<view class="order-view" :style="{height: orderHeight}">
			<uni-collapse accordion="true" @change="changeActive">
				<uni-collapse-item :title="order.tableNum+'号桌'" v-for="order in activeOrder" :key="order.id">
					<list>
						<cell class="order-detail" v-for="item in order.detail" :key="item.id">
							<text class="uni-flex-item">{{item.name}}</text>
							<uni-number-box class="uni-flex-item" :value="item.num" @change="changeDishNum($event, item)"></uni-number-box>
							<text class="uni-flex-item">{{item.num*item.price}}元</text>
						</cell>
					</list>
					<view class="order-control">
						<text>总价：{{getTotalPrice(order.id)}}元</text>
						<button size="mini">操作</button>
						<button size="mini" type="primary">点菜</button>
						<button size="mini" type="warn" @click="showModal(order.id)">买单</button>
					</view>
				</uni-collapse-item>
			</uni-collapse>
			<view class="neworder-btn">
				<button type="primary" plain=true @click="addNewOrder">新订单</button>
			</view>
		</view>

		<view class="dish-view">
			<input class="dish-input" type="number" placeholder="请输入价格" />
			<list>
				<cell class="order-detail" v-for="(item, index) in choiceDishData" :key="item.id">
					<text class="uni-flex-item">{{item.name}}</text>
					<text class="uni-flex-item">{{item.price.toFixed(1)}}</text>
					<uni-number-box class="uni-flex-item" min="1"></uni-number-box>
					<button size="mini" type="primary" @click="addDish(index)">添加</button>
				</cell>
			</list>
		</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'

	import {
		mapGetters
	} from 'vuex'
	import {
		dishData,
		orderData,
	} from '@/common/test_data.js'

	var self = null;

	export default {
		components: {
			uniCollapse,
			uniNumberBox,
			uniCollapseItem,
		},
		data() {
			return {
				orderData: [],
				selectOrderId: "",
				activeIndex: 0,
				choiceDishData: [],
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
		},
		methods: {
			changeActive(arr) {
				if (arr) {
					this.activeIndex = arr[0];
				}
			},

			changeDishNum(newValue, item) {
				var detail = this.orderData[this.activeIndex].detail;
				for (var i in detail) {
					if (detail[i].id == item.id) {
						break;
					}
				}
				if (newValue > 0) {
					this.orderData[this.activeIndex].detail[i].num = newValue;
				} else {
					this.orderData[this.activeIndex].detail.splice(i, 1);
				}
			},

			showModal(orderId) {
				this.selectOrderId = orderId;
				uni.showModal({
					title: '提示',
					content: '确定顾客已买单？',
					success: function(res) {
						if (res.confirm) {
							self.payBill();
						}
					}
				});
			},

			payBill() {
				var index = this.orderIdToIndex(this.selectOrderId);
				this.orderData[index].isPaid = true;
			},

			orderIdToIndex(orderId) {
				return parseInt(orderId.split("_")[1]) - 1;
			},

			getTotalPrice(orderId) {
				var index = this.orderIdToIndex(orderId);
				var detail = this.orderData[index].detail;
				var totalPrice = 0;
				detail.forEach(item => {
					totalPrice += (item.num * item.price);
				})
				return totalPrice.toFixed(1);
			},

			addDish(index) {
				console.log("index", index);
			},

			addNewOrder() {

			},
		}
	}
</script>

<style>
	.order-view {
		overflow: scroll;
	}

	.order-detail {
		display: flex;
		flex-direction: row;
		text-align: center;
		margin-bottom: 2px;
	}

	.order-control {
		display: flex;
		margin: 8px 0;
	}

	.neworder-btn {
		margin: 20px 30px;
	}

	.dish-view {
		padding: 0 20px;
	}

	.dish-input {
		border: 1px solid #007AFF;
		height: 40px;
		margin-bottom: 5px;
	}
</style>
