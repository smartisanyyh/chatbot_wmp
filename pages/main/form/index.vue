<template>
	<view class="container">
		<view class="bg"></view>
		<view class="form">
			<view class="header">
				<view class="title">人工智能回答你需要的问题</view>
			</view>
			<u-transition :show="true" mode="fade-left">
				<view class="panel">
					<view class="head">
						<view class="title">填写您的问题</view>
						<view class="tips">与人工智能对话</view>
					</view>
					<view class="ad-box">
						<ad unit-id="adunit-6e18ed873f6eafe1"></ad>
					</view>
					
					<view class="textarea">
						<u--textarea height="140" maxlength="-1" v-model="inputContent" placeholder="支持长按粘贴您的问题">
						</u--textarea>
					</view>


					<view class="btn-group">
						<view class="btn paste">
							<u-button icon="file-text" text="粘贴问题"></u-button>
						</view>
						<view class="btn get">
							<u-button @click="onSubmitGPT" iconColor="#ffffff" color="#26B3A0" icon="edit-pen"
								text="获取问题答案"></u-button>
						</view>
					</view>
				</view>
			</u-transition>
		</view>
		<view class="alert">
			<u-alert title="1.本站系统调用官方接口，数据由官方返回。" type="error"></u-alert>
			<u-alert title="2.尽可能的多描述问题(例如：写一篇中文文章，标题为XXXX)" type="error"></u-alert>
			<u-alert title="3.调用官方API是不需要排队的，但是高峰期官方会慢或者卡住（超过2分钟），一般刷新或者过几秒再试就可以了" type="error"></u-alert>
		</view>
		
		
		<view class="tool">
			<view class="header">
				<view class="title">功能特性</view>
			</view>
			<u-transition :show="true" mode="slide-up">
				<view class="grid">
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01v7Y9311o5k2r5Rwaq_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">AI回答</view>
						<view class="desc">轻松获取</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01H200mY1o5k2ythU1B_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">智能答案</view>
						<view class="desc">免去千篇一律</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01FDSoxG1o5k2xjTHUD_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">自动代码</view>
						<view class="desc">免去繁琐搜索</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i4/2064565174/O1CN01UP4ksa1o5k2rDpdOP_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">引导写作</view>
						<view class="desc">AI发散思维</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i2/2064565174/O1CN01Oep4C01o5k2zlWs2q_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">存在限制</view>
						<view class="desc">会有偏见内容</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01onUFC01o5k2uPHOqj_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">在线工具</view>
						<view class="desc">无需下载软件</view>
					</view>
				</view>
			</u-transition>
		</view>
		<!-- <view class="share">
			<u-button open-type="share" shape="circle" color="#26B3A0" :plain="true" icon="share" text="推荐给朋友"></u-button>
		</view> -->
	</view>
</template>

<script>
	//这里直接关掉激励视频
	let videoAd = false;
	// 在页面中定义插屏广告
	let interstitialAd = null
	export default {
		data() {
			return {
				inputContent: ''
			};
		},
		async onLoad() {
			// this.videoAdLoad()
			// this.interstitialAdLoad()
			// setTimeout(() => {
			// 	this.interstitialAdClick()
			// }, 2 * 1000)
		},
		methods: {
			onSubmitGPT() {
				let that = this;
				if (that.inputContent === undefined || that.inputContent === null || that.inputContent === '') {
					uni.showToast({ //提示
						title: `咨询问题不可为空`,
						icon: 'error'
					})
					return;
				}


				let dataParamInput = {
					inputContent: this.inputContent
				}
				uni.navigateTo({
					url: '/pages/main/answer/index?dataParamInput=' + encodeURIComponent(JSON.stringify(
						dataParamInput))
				})
			},
			videoAdClick() {
				var that = this
				uni.showLoading({
					title: '加载中'
				});

				//激励视频已经关闭,失效了
				if (videoAd) {
					videoAd.show().then(() => {
						uni.hideLoading()
					}).catch(err => {
						// 失败重试
						videoAd.load().then(() => {
							uni.hideLoading()
							videoAd.show()
						}).catch(err => {
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: '访问人数过多，请稍后再试',
								duration: 3000
							});
							console.log('激励视频 广告显示失败')
						})
					})
				} else {
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '系统',
						duration: 3000
					});
				}
			},
			videoAdLoad() {
				var that = this
				if (wx.createRewardedVideoAd) {
					// 加载激励视频广告
					videoAd = wx.createRewardedVideoAd({
						adUnitId: "adunit-d2d7b511afea2339"
					});
					//捕捉错误
					videoAd.onError(err => {
						// 进行适当的提示
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: '访问人数过多，请稍后再试',
							duration: 3000
						});
						console.log('videoAd onError', err);
					});
					// 监听关闭
					videoAd.onClose(status => {
						uni.hideLoading()
						if ((status && status.isEnded) || status === undefined) {
							// 正常播放结束，下发奖励
							that.onSubmitGPT()
						} else {
							// 播放中途退出，进行提示
							console.log('中途退出')
						}
					});
				}
			},
			interstitialAdClick() {
				// 在适合的场景显示插屏广告
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			},
			interstitialAdLoad() {
				if (wx.createInterstitialAd) {
					interstitialAd = wx.createInterstitialAd({
						adUnitId: 'adunit-42f2e4d677e3b37c'
					})
					interstitialAd.onLoad(() => {
						console.log('onLoad')
					})
					interstitialAd.onError((err) => {
						console.log('err')
					})
					interstitialAd.onClose(() => {
						console.log('关闭')
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.share {
		position: fixed;
		right: 40rpx;
		bottom: 40rpx;
		width: 40%;

		.u-button {
			box-shadow: 0rpx 10rpx 10rpx #eee !important;
		}
	}

	.ad-box {
		width: 90%;
		margin: 15rpx auto;
	}

	.tool {
		width: 90%;
		margin: 15rpx auto;
		padding-bottom: 50rpx;

		.header {
			.title {
				margin-bottom: 30rpx;
			}
		}

		.grid {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				width: 30%;
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: #F0FAF8;
				margin: 15rpx 0rpx;
				padding: 30rpx 0rpx;
				border-radius: 10rpx;

				.title {
					color: #1B2B20;
					margin-top: 15rpx;
				}

				.desc {
					color: #67776C;
					font-size: 24rpx;
				}
			}
		}
	}

	.alert {
		width: 90%;
		margin: 30rpx auto;
	}

	.form {
		width: 90%;
		margin: 0 auto;
		z-index: 999;

		.header {
			margin-bottom: 30rpx;

			.title {
				text-align: center;
				color: #fff;
				margin: 30rpx 0rpx;
			}
		}

		.panel {
			padding: 30rpx;
			background-color: #fff;
			border-radius: 15rpx;
			box-shadow: 0rpx 10rpx 10rpx #eee;

			.head {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.tips {
					color: #dd6161;
				}
			}

			.textarea {
				margin-top: 30rpx;
			}

			.btn-group {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-top: 30rpx;

				.paste {
					width: 40%;
				}

				.get {
					width: 56%;
				}
			}
		}
	}

	.bg {
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		width: 100%;
		background-color: #26B3A0;
		min-height: 200rpx;
		border-radius: 0rpx 0rpx 140rpx 140rpx;
		z-index: -1;
	}
</style>
