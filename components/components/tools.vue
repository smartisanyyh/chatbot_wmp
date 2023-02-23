<template>
	<view
		class="chat-tools"
		:class="[
			{
				'is-show': visible
			}
		]"
	>
		<swiper>
			<swiper-item>
				<cl-row>
					<cl-col :span="6">
						<view class="block" @tap="onImage">
							<view class="icon">
								<text class="chat-iconfont icon-tool-image"></text>
							</view>
							<text class="label">照片</text>
						</view>
					</cl-col>

					<cl-col :span="6">
						<view class="block" @tap="onVideo">
							<view class="icon">
								<text class="chat-iconfont icon-tool-video"></text>
							</view>
							<text class="label">视频</text>
						</view>
					</cl-col>

					<cl-col :span="6">
						<view class="block" @tap="onShoot">
							<view class="icon">
								<text class="chat-iconfont icon-tool-shoot"></text>
							</view>
							<text class="label">拍摄</text>
						</view>
					</cl-col>
				</cl-row>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	props: {
		visible: Boolean
	},

	methods: {
		upload(file, { contentType }) {
			let key = "";

			switch (contentType) {
				case 1:
					key = "imageUrl";
					break;
				case 4:
					key = "videoUrl";
					break;
			}

			const data = {
				fromId: 1, // 实际使用登录者id
				contentType,
				loading: true,
				progress: 0,
				content: {
					[key]: file.path
				}
			};

			this.$root.append(data);

			setTimeout(() => {
				data.progress = 100;
				data.loading = false;
			}, 300);
		},

		onImage() {
			uni.chooseImage({
				sourceType: ["album"],
				success: res => {
					res.tempFiles.forEach(file => {
						this.upload(file, {
							contentType: 1
						});
					});
				}
			});
		},

		onVideo() {
			uni.chooseVideo({
				count: 1,
				sourceType: ["album"],
				success: res => {
					this.upload(
						{
							path: res.tempFilePath
						},
						{
							contentType: 4
						}
					);
				}
			});
		},

		onShoot() {
			uni.chooseImage({
				sourceType: ["camera"],
				success: res => {
					this.upload(res.tempFiles[0], {
						contentType: 1
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../static/css/iconfont.scss";
.chat-tools {
	background-color: #f6f7f9;
	height: 0;
	transition: height 0.3s;

	&.is-show {
		height: 400rpx;
	}

	swiper {
		height: 100%;
	}

	.block {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200rpx;

		.icon {
			height: 100rpx;
			width: 100rpx;
			border-radius: 10rpx;
			background-color: #fff;
			text-align: center;
			line-height: 100rpx;

			.chat-iconfont {
				font-size: 60rpx;
				color: #d9dbde;
			}
		}

		.label {
			margin-top: 15rpx;
			font-size: 24rpx;
			color: #333;
		}

		&:active {
			.chat-iconfont {
				color: #999;
			}
		}
	}
}
</style>
