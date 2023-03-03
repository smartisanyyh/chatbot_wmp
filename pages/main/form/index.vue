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
					<view class="textarea">
						<u--textarea height="140" maxlength="-1" v-model="inputContent" placeholder="支持长按粘贴您的问题">
						</u--textarea>
					</view>


					<view class="btn-group">
						<view class="btn paste">
							<u-button icon="file-text" text="粘贴问题"></u-button>
						</view>
						<view class="btn get">
							<u-button @click="isOnSubmit" iconColor="#ffffff" color="#26B3A0" icon="edit-pen"
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
				inputContent: '',
				askNumber: 2
			};
		},
		onLoad() {
			this.initAskNumber();
			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
			  videoAd = wx.createRewardedVideoAd({
			    adUnitId: 'adunit-bb465b5d3b66e8f5'
			  })
			  videoAd.onLoad(() => {console.log("加载了")})
			  videoAd.onError((err) => {console.log("err")})
			  videoAd.onClose((res) => {
				  if(res.isEnded){
					  console.log("加载了",res)
					  let askNumberSync = uni.getStorageSync('askNumberSync');
					  if(askNumberSync){
					  	this.askNumber = this.askNumber+10;
					  }else{
					  	this.askNumber = 10;
					  }
					  uni.setStorageSync('askNumberSync',this.askNumber);
					  console.log(this.askNumber)
				  }
				  })
			}
		},
		onShow() {
			this.initAskNumber();
			console.log("进入页面")
		},
		methods: {
			initAskNumber(){
				console.log("初始值:",uni.getStorageSync('askNumberSync'))
				let askNumberSync = uni.getStorageSync('askNumberSync');
				if(askNumberSync || askNumberSync === 0){
					console.log("初始值:",askNumberSync)
					this.askNumber = askNumberSync;
				}
			},
			isOnSubmit(){
				let that = this
				if(false){
					uni.showModal({
						title: '提示',
						content: '您的免费次数用完,确定后看广告。可得10次机会',
						success: function (res) {
							if (res.confirm) {
								that.onSubmitGPT();
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else{
					that.onSubmitGPT();
				}

			},
			onSubmitGPT() {
				if(false){
					this.videoAdLoad();	
				}else{
				
				let that = this;
				if (that.inputContent === undefined || that.inputContent === null || that.inputContent === '') {
					uni.showToast({ //提示
						title: `咨询问题不可为空`,
						icon: 'error'
					})
					return;
				}
				// this.askNumber = this.askNumber - 1
				// uni.setStorageSync('askNumberSync',this.askNumber);
				let dataParamInput = {
					inputContent: this.inputContent
				}
				uni.navigateTo({
					url: '/pages/main/answer/index?dataParamInput=' + encodeURIComponent(JSON.stringify(
						dataParamInput))
				})
				}
			},
			videoAdLoad() {
				// let rewardedVideoAd = null
				var that = this
				console.log("我来加载数据1")
				if (true) {
					console.log("我来加载数据")
				  videoAd.show().catch(() => {
				    // 失败重试
				    videoAd.load()
				      .then(() => videoAd.show())
				      .catch(err => {
				        console.log('激励视频 广告显示失败')
				      })
				  })
				}
			}
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
