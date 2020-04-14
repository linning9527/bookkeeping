<template>
	<view>
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
					<text>总价：{{getTotalPrice(order.id)}}</text>
					<button size="mini" type="primary">点菜</button>
					<button size="mini" type="warn" @click="showModal(order.id)">买单</button>
				</view>
			</uni-collapse-item>
		</uni-collapse>
		<view class="neworder-btn">
			<button type="primary" plain=true @click="addNewOrder">新订单</button>
		</view>
		<chunLei-modal v-model="isModalShow" :mData="modalData" type="default" @onConfirm="payBill" navMask>
		</chunLei-modal>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import chunLeiModal from '@/components/chunLei-modal/chunLei-modal.vue'
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'

	import {
		orderData
	} from '@/common/test_data.js'

	export default {
		components: {
			uniCollapse,
			uniNumberBox,
			chunLeiModal,
			uniCollapseItem,
		},
		data() {
			return {
				orderData: [],
				selectOrderId: "",
				activeIndex: 0,

				isModalShow: false,
				modalData: {
					title: "提示",
					content: "确定顾客已买单？"
				}
			}
		},
		computed: {
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
			this.orderData = orderData;
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
				this.isModalShow = true;
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
				return totalPrice;
			},

			addNewOrder() {

			},
		}
	}
</script>

<style>
	.order-detail {
		display: flex;
		flex-direction: row;
		text-align: center;
	}
	
	.order-control {
		display: flex;
		margin: 8px 0;
	}
	
	.neworder-btn {
		margin: 20px 30px;
	}
</style>
