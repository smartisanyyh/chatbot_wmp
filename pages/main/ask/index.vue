<template>
	<view class="container">
		<view class="bg"></view>
		<view class="form">
			<view class="header">
				<view class="title">人工智能回答你需要的问题</view>
			</view>
			<block v-for="(item,index) in qList">
				<view class="panel" :class="'panel'+index">
					<view class="head">
						<view class="title">问：{{item.title}}</view>
					</view>
					<view class="content" :class="[{'example':cIndex===index}]" @click="onClickContent(index)">
						<rich-text :nodes="item.content"></rich-text>
					</view>
					<view class="bottom">
						官方回答时间：{{item.answerTime}}
					</view>
				</view>
<!-- 				<view v-if="index===0" class="ad-box">
					<ad unit-id="adunit-512f87e547fb53d5"></ad>
				</view>
				<view v-if="index===4" class="ad-box">
					<ad-custom unit-id="adunit-debc1c1f6bfaf529"></ad-custom>
					</ad>
				</view>
				<view v-if="index===9" class="ad-box">
					<ad unit-id="adunit-eacac3d02a9631ba" ad-type="video" ad-theme="white"></ad>
					</ad-custom>
					</ad>
				</view> -->

			</block>
		</view>
	</view>
</template>

<script>
	import request from "../../../request/request.js";
	import requestA from "../../../request/requestA.js";
	// 在页面中定义插屏广告
	let interstitialAd = null
	export default {
		data() {
			return {
				cIndex: '',
				pageScrollTop: 0,
				qList: [{
					title: "问答收录是什么?",
					content: "问答收录为其他人资讯的问题,由本系统收集起来综合展现在此地。同时也说明此系统的强大。",
					answerTime: '2023-02-9 12:00:00'
				}],
				isUseOffical:'',
				useOfficalUrl:''
			};
		},
		async onLoad() {
			// this.interstitialAdLoad()
			// setTimeout(()=>{
			// 	this.interstitialAdClick()
			// },2*1000)
			this.getListDatas();
		},
		onPageScroll(e) {
			this.pageScrollTop = e.scrollTop;
		},
		methods: {
			onSubmit() {
				uni.navigateTo({
					url: '/pages/main/answer/index'
				})
			},
			onClickContent(index) {
				if (this.cIndex === index) {
					this.cIndex = ''
				} else {
					this.cIndex = index
				}
				this.$nextTick(() => {
					this.getElementScollTop(index)
				})
			},
			getElementScollTop(index) {
				const query = uni.createSelectorQuery()
				query.select(`.panel${index}`).boundingClientRect((data) => {
					console.log(data, 'data')
					this.pageScrollTop = this.pageScrollTop + Math.round(data.top)
					uni.pageScrollTo({
						scrollTop: this.pageScrollTop, //滚动的距离
						duration: 500, //过渡时间
					})
				}).exec()

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
						adUnitId: 'adunit-7fd77039475e7d2d'
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
			getListDatas(){
				request('', '/answers/all', 'GET', null, {}).then(res => {
					console.log(res)
					if (res.code == 0) {
						for (var i of res.data){
							this.qList=res.data
						}
					} else{
						uni.showToast({
							title: '请求错误',
							icon: 'error',
							duration: 2000
						});
					}
					// uni.hideLoading();
				})
			},
			/**
			   * 用户点击右上角分享
			   */
			onShareAppMessage: function () {
			
			},
			onShareTimeline: function () {
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 动画代码 */
	@keyframes example {
		0% {
			height: 100rpx;
		}

		100% {
			height: auto;
		}
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
			margin-bottom: 15rpx;

			.bottom {
				font-size: 24rpx;
			}

			.head {
				border-bottom: 1rpx solid #eee;
				padding-bottom: 30rpx;

				.title {
					font-weight: bolder;
					font-size: 30rpx;
				}
			}

			.content {
				margin: 30rpx 0rpx;
				height: 118rpx;
				display: -webkit-box;
				overflow: hidden;
				white-space: normal !important;
				text-overflow: ellipsis;
				word-wrap: break-word;
				-webkit-line-clamp: 3;
				line-clamp: 3;
				-webkit-box-orient: vertical;
			}

			.example {
				animation-name: example;
				animation-duration: 1s;
				position: relative;
				overflow: auto;
				text-overflow: inherit;
				-webkit-line-clamp: inherit;
				line-clamp: inherit;
				height: auto;
			}

			.bottom {
				background-color: #F0FAF8;
				color: #26B3A0;
				padding: 15rpx;
				border-radius: 10rpx;
			}
		}

		.ad-box {
			margin: 20rpx 0;
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
