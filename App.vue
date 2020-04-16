<script>
	import {
		mapMutations
	} from 'vuex'

	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getSystemInfo({
				success: (res) => {
					console.log("getSystemInfo success:", res);
					this.SET_SYS_INFO(res);
				},
				fail: (err) => {
					console.log("getSystemInfo error:", err);
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(["SET_SYS_INFO"])
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
</style>
