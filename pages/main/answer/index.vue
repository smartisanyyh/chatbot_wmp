<template>
	<view class="container">
		<view class="action">
			<view class="tips">
				官方接口通道
			</view>
			<view class="switch">
				<u-switch activeColor="#26B3A0" :value="true"></u-switch>
			</view>
		</view>
		
		
		<view class="answer" >
			<view class="ask">{{inputContent}}</view>
			<text  style="white-space:pre-wrap" class="content">
				{{bootAns}}
			</text>
		</view>
		<view class="kongbai" style="height: 200rpx" >
			
		</view>
		
		
		<view class="sheet">
			<view class="btn">
				<u-button open-type="share" icon="share" text="分享给好友"></u-button>
			</view>
			<view class="btn">
				<u-button iconColor="#ffffff" @click="copyRequest" color="#26B3A0" icon="file-text" text="复制问题答案"></u-button>
			</view>

		</view>
	</view>
</template>

<script>
	import request from "../../../request/request.js";
	export default {
		data() {
			return {
				inputContent: '',
				resultContent: '',
				resultContentText: '',
				bootAns: 'AI正在整理答案,请稍等...'
			};
		},
		onLoad(option) {
			let data = JSON.parse(decodeURIComponent(option.dataParamInput))
			this.inputContent = data.inputContent
			this.submitAks(data.inputContent)
		},
		methods: {
			submitAks(inputContent) {
				let that = this;
				// uni.showLoading({
				// 	title: `正在请求,请稍等...`,
				// 	icon: 'error'
				// })
				console.log(inputContent)
				let data = {
					"prompt": inputContent
				}
				request('', '/ai/chat', 'POST', data, {}).then(res => {
					console.log(res)
					if (res.code == 200) {
						that.resultContent = "<pre>" + res.msg + "</pre>";
						that.resultContentText = res.msg;
						// that.loadingText(that.resultContent)
						that.bootAns = that.resultContentText;
					} else if (res.code == 500) {
						if(!res.msg){
							uni.showToast({
								title: '请重新请求',
								icon: 'error',
								duration: 2000
							});
						}else{
						uni.showToast({
							title: res.msg,
							icon: 'error',
							duration: 2000
						});
						setTimeout(()=> {
							uni.switchTab({
								//保留当前页面，跳转到应用内的某个页面
							url: '/pages/main/form/index',
							})
						}, 2000)
						}
					}
					// uni.hideLoading();
				})
			},
			loadingText(text) {
				let that = this;
				let i = 0;
				let timer = setInterval(() => {
					if (i >= text.length) {
						clearInterval(timer);
						return;
					}
					that.bootAns = text.substring(0, i++)
				}, 20);
			},
			copyRequest() {
				let that = this;
				if (that.resultContentText == undefined || that.resultContentText === null || that.resultContentText ===
					'') {
					uni.showToast({ //提示
						title: `暂无数据或信息正在查询`,
						icon: 'error'
					})
					return;
				} else {
					uni.setClipboardData({
						data: that.resultContentText, //要被复制的内容
						success: () => { //复制成功的回调函数
							uni.showToast({ //提示
								title: `复制成功`,
								icon: 'success'
							})
						}
					}, true);
				}
			},
		}
	}
</script>

<style lang="scss">
	.answer {
		width: 90%;
		margin: 0 auto;
		margin-top: 200rpx;
		z-index: -1;

		.ask {
			font-size: 36rpx;
			font-weight: bolder;
		}

		.content {
			margin-top: 30rpx;
			color: #606266;
		}
	}

	.action {
		width: 92%;
		position: fixed;
		bottom: 0rpx;
		top: 0rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 80rpx;
		align-items: center;
		box-shadow: 10rpx 10rpx 10rpx #eee;
		padding: 30rpx;
		z-index: 999;
		background-color: #fff;
	}

	.sheet {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		bottom: env(safe-area-inset-bottom);
		padding: 30rpx 0rpx;
		background-color: #fff;
		box-shadow: -10rpx -10rpx 10rpx #eee;

		.btn {
			width: 42%;

			.u-button {
				height: 90rpx;
			}
		}
	}
</style>
