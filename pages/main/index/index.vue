<template>
	<view class="container">
		<view  class="notice">
			<u-notice-bar v-if="notice" :text="notice"></u-notice-bar>
		</view>
		<view class="form">
			<view class="logo">
				<u--image src="/static/wxlogo.png" shape="circle" width="200rpx" height="200rpx">
				</u--image>
			</view>
			<u-transition :show="true" mode="slide-left">
				<view class="title">{{weichat_title}}</view>
			</u-transition>
			<u-transition :show="true" mode="slide-right">
				<view class="desc" style="text-align: center;">拥有最权威的解答</view>
				<view class="desc" style="text-align: center;">采用的为官方接口</view>

			</u-transition>
			<u-transition :show="true" mode="slide-right">
				<view class="desc" style="text-align: center;">{{weichat_adv}}</view>
			</u-transition>
			<!-- 			<view class="ad-box">
				<ad unit-id="adunit-4b7965e593733d4e"></ad>
			</view> -->
			<view class="btn-group">
				<view class="btn">
					<u-button open-type="share" shape="circle" color="#26B3A0" :plain="true" icon="share" text="推荐给朋友">
					</u-button>
				</view>
				<view class="btn">
					<u-button @click="gonavigate" shape="circle" color="#26B3A0" :plain="true" icon="play-right-fill"
						text="开始提问"></u-button>
						
				</view>
				<view class="btn">
						
						<u-button @click="gonavigatechat" shape="circle" color="#26B3A0" :plain="true" icon="play-right-fill"
							text="开始对话"></u-button>
						
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../../request/request.js";
	export default {
		data() {
			return {
				notice: "",
				weichat_title: "",
				weichat_adv: ""
			};
		},
		onLoad() {
			this.getCacheContent()
		},
		methods: {
			getVersion(){
				
			},
			onToForm() {
				uni.switchTab({
					url: '/pages/main/form/index'
				})
			},
			toMiniProgram(appId, cUrl) {
				uni.navigateToMiniProgram({
					appId: "wx461ff8f867f3d028",
					path: `${cUrl||""}`,
					extraData: {

					},
					success(res) {
						// 打开成功
					}
				})
			},
			gonavigate() {
				uni.switchTab({
					//保留当前页面，跳转到应用内的某个页面
			 	url: '/pages/main/form/index',
				})
			},
			gonavigatechat() {
				uni.navigateTo({
					//保留当前页面，跳转到应用内的某个页面
			 	url: '/pages/index',
				})
			},
			
			
			getCacheContent() {
				let that = this;
				that.getRequestContent();
				
				// let content = uni.getStorageSync('weichat_content'); //获取缓存内容
				// //如果有内容，则返回内容
				// if (content) {
				// 	console.log("获取的内容",content)
				// 	 // uni.removeStorageSync("weichat_content");
				// 	this.notice = content.weichat_notice;
				// 	this.weichat_title = content.weichat_name;
				// 	this.weichat_adv = content.weichat_adv;
				// } else { 
				// 	//设置缓存
				// that.getRequestContent();
				// }
			},
			getRequestContent(){
				
				request('', '/ai/configInfo', 'POST', {}, {}).then(res => {
					
					if (res.code == 200) {
						// uni.setStorageSync('weichat_content', res.data);
						this.notice = res.data.weichat_notice;
						this.weichat_title = res.data.weichat_name;
						this.weichat_adv = res.data.weichat_adv;
					}
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.notice {
		margin-top: 20%;
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 10%;

		.title {
			font-size: 38rpx;
			font-weight: bolder;
			margin-top: 15rpx;
		}

		.desc {
			margin-top: 15rpx;
			font-size: 28rpx;
			color: #666;
		}

		.ad-box {
			margin-top: 20px;
		}

		.btn-group {
			width: 80%;

			.tips {
				color: red;
			}

			.btn {
				margin: 30rpx 0rpx;

				.u-button {
					height: 100rpx;
				}
			}
		}

		.desc-box {
			margin: 0 30rpx;
			padding-bottom: 50rpx;

			.title {
				text-align: center;
				margin-bottom: 50rpx;
			}

			.cont {
				margin-top: 30rpx;
			}

			.sub-title {
				margin-top: 60rpx;
				font-weight: bolder;
			}

			.sub-cont {
				margin-top: 20rpx;
			}
		}
	}
</style>
