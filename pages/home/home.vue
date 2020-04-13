<template>
	<view>
		<uni-collapse accordion="true" @change="changeActive">
			<uni-collapse-item :title="order.tableNum+'号桌'" v-for="order in orderData" :key="order.id" v-if="!order.isPaid">
				<list>
					<cell class="cell" v-for="(item, index) in order.detail" :key="item.id">
						<text>{{item.name}}</text>
						<uni-number-box :value="item.num" @change="changeFoodNum(item)"></uni-number-box>
						<text>{{item.num*item.price}}元</text>
					</cell>
				</list>
				<view>
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
	} from '@/data/test_data.js'

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
		onLoad() {
			this.orderData = orderData;
		},
		methods: {
			changeActive(arr) {
				if (arr) {
					this.activeIndex = arr[0];
				}
			},

			changeFoodNum(e, e2) {
				console.log("e", e, e2)
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
	.cell {
		display: flex;
		flex-direction: row;
	}

	.neworder-btn {
		margin: 20px 30px;
	}
</style>
