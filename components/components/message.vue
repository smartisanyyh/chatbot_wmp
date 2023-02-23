<template>
	<view class="chat-message">
		<view
			class="chat-message-item"
			v-for="(item, index) in flist"
			:key="`${item.id}-${index}`"
			:class="[
				`${item._isMy ? 'is-right' : 'is-left'}`,
				`is-${item._mode}`,
				{
					'is-animation': item.animation
				}
			]"
		>
			<!-- 发言时间 -->
			<view class="date" v-if="item._date">
				<text>{{ item._date }}</text>
			</view>

			<!-- 内容 -->
			<view class="main">
				<!-- 头像 -->
				<view class="avatar">
					<image :src="item.avatarUrl" mode="aspectFit" />
				</view>

				<!-- 详细 -->
				<view class="det">
					<!-- 昵称 -->
					<text class="name">{{ item.name }}</text>

					<!-- 内容 -->
					<view class="content" @tap="tapCont(item)" @longpress="longPressItem(item)">
						<!-- 文本 -->
						<template v-if="item._mode === 'text'">{{ item.content.text }}</template>

						<!-- 图片 -->
						<template v-else-if="item._mode === 'image'">
							<cl-loading-mask
								color="#000"
								:loading="item.loading"
								:text="`${item.progress}%`"
							>
								<image mode="widthFix" :src="item.content.imageUrl"></image>
							</cl-loading-mask>
						</template>

						<!-- 表情 -->
						<template v-else-if="item._mode === 'emoji'">
							<image :src="item.content.imageUrl"></image>
						</template>

						<!-- 语音 -->
						<template v-else-if="item._mode === 'voice'">
							<icon-voice
								v-if="item._isMy"
								name="icon-voice-right"
								:play="item.isPlay"
							></icon-voice>
							<text class="duration">{{ item.content.duration | duration }}</text>
							<icon-voice
								v-if="!item._isMy"
								name="icon-voice-left"
								:play="item.isPlay"
							></icon-voice>
						</template>

						<!-- 视频 -->
						<template v-else-if="item._mode === 'video'">
							<cl-loading-mask
								color="#000"
								:loading="item.loading"
								:text="`${item.progress}%`"
							>
								<view class="item">
									<image
										class="cover"
										:src="item.content.videoUrl"
										mode="aspectFill"
									/>
									<text
										v-if="!item.loading"
										class="chat-iconfont icon-play"
									></text>
								</view>
							</cl-loading-mask>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import dayjs from "cl-uni/utils/dayjs";
import IconVoice from "./icon-voice";

// 音频
const innerAudioContext = uni.createInnerAudioContext();

// 模式，对应 contentType
const modes = ["text", "image", "emoji", "voice", "video"];

export default {
	components: {
		IconVoice
	},

	props: {
		/*
		 * text: 文本
		 * duration: 时常
		 * videoUrl: 视频地址
		 * voiceUrl: 语音地址
		 * videoCoverUrl: 视频封面
		 * imageUrl: 图片地址
		 */
		list: Array
	},

	data() {
		return {
			voice: {
				timer: null
			},
			// 登录的用户信息
			userInfo: {
				id: 1,
				name: "COOL",
				avatarUrl:
					"https://upageui.cool-js.com/show/comm/logo.png?x-oss-process=image/resize,w_200"
			}
		};
	},

	computed: {
		flist() {
			let date = "";

			const { avatarUrl, name, id } = this.userInfo;

			return this.list.map(e => {
				// 处理日期
				e._date = date
					? dayjs(e.createTime).isBefore(dayjs(date).add(1, "minute"))
						? ""
						: e.createTime
					: e.createTime;

				date = e.createTime;

				// 是否是自己
				e._isMy = e.fromId == this.userInfo.id;

				if (e._isMy && !e.user) {
					e.user = {
						avatarUrl,
						name,
						id
					};
				}

				// 设置信息
				if (e.user) {
					e.avatarUrl = e.user.avatarUrl;
					e.name = e.user.name;
					e.userId = e.user.id;
				}

				// 消息模型
				e._mode = modes[e.contentType];

				return e;
			});
		}
	},

	filters: {
		duration(val) {
			return Math.ceil((val || 1) / 1000);
		}
	},

	destroyed() {
		this.voicePause();
	},

	methods: {
		// 点击内容
		tapCont(item) {
			console.log(item);
			switch (item._mode) {
				case "image":
					this.previewImage(item);
					break;
				case "video":
					this.videoPlay(item);
					break;
				case "voice":
					this.voicePlay(item);
					break;
			}
		},

		// 长按
		longPressItem(item) {
			switch (item._mode) {
				case "text":
					uni.setClipboardData({
						data: item.content.text
					});
					break;
			}
		},

		// 图片预览
		previewImage(item) {
			uni.previewImage({
				current: item.content.imageUrl,
				urls: this.list.filter(e => e._mode == "image").map(e => e.content.imageUrl)
			});
		},

		// 视频播放
		videoPlay(item) {
			this.$root.video.url = item.content.videoUrl;
			this.$root.video.visible = true;
		},

		// 播放录音
		voicePlay(item) {
			// 设置播放状态
			this.list.map(e => {
				this.$set(e, "isPlay", e.id == item.id ? e.isPlay : false);
			});

			item.isPlay = !item.isPlay;

			if (item.isPlay) {
				// 开始播放
				innerAudioContext.src = item.content.voiceUrl;
				innerAudioContext.play();
			} else {
				// 暂停播放
				this.voicePause();
			}

			// 清除计时器
			clearTimeout(this.voice.timer);

			// x 秒后暂停
			this.voice.timer = setTimeout(() => {
				item.isPlay = false;
			}, item.content.duration || 1000);
		},

		// 暂停播放
		voicePause() {
			innerAudioContext.stop();
			this.list.map(e => {
				e.isPlay = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@keyframes fadeInRight {
	from {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}

@keyframes fadeInLeft {
	from {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}

	to {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}
}

.chat-message {
	&-item {
		font-size: 26rpx;
		padding: 20rpx;

		.date {
			text-align: center;
			margin: 10rpx 0 40rpx 0;

			text {
				background-color: #dadada;
				font-size: 24rpx;
				color: #fff;
				border-radius: 6rpx;
				padding: 4rpx 10rpx;
				letter-spacing: 1rpx;
			}
		}

		.main {
			display: flex;

			.avatar {
				flex-shrink: 0;
				height: 80rpx;

				image {
					height: 80rpx;
					width: 80rpx;
				}
			}

			.det {
				display: flex;
				flex-direction: column;
				max-width: 60%;

				.name {
					margin-bottom: 10rpx;
				}

				.content {
					display: inline-block;
					border-radius: 16rpx;
					box-sizing: border-box;
					position: relative;
				}
			}
		}

		&.is-left {
			.main {
				.det {
					margin-left: 20rpx;
					align-items: flex-start;

					.content {
						border-top-left-radius: 0;
						background-color: #fff;
					}
				}
			}
		}

		&.is-right {
			.main {
				flex-direction: row-reverse;

				.det {
					margin-right: 20rpx;
					align-items: flex-end;

					.content {
						border-top-right-radius: 0;
						background-color: $uni-color-primary;
						color: #fff;
					}
				}
			}

			&.is-voice {
				.content {
					justify-content: flex-end;
				}
			}
		}

		&.is-animation {
			&.is-left {
				animation: fadeInLeft 0.5s ease both;
			}

			&.is-right {
				animation: fadeInRight 0.5s ease both;
			}
		}

		&.is-text {
			.content {
				max-width: 100%;
				min-width: 80rpx;
				word-wrap: break-word;
			}
		}

		&.is-text,
		&.is-voice {
			.content {
				padding: 20rpx;
				line-height: 40rpx;
				letter-spacing: 1rpx;
			}
		}

		&.is-emoji {
			.content {
				padding: 20rpx;

				image {
					height: 40rpx;
					width: 40rpx;
				}
			}
		}

		&.is-voice {
			.det {
				.content {
					display: flex;
					align-items: center;
					width: 130rpx;

					.duration {
						&::after {
							content: '"';
						}
					}
				}
			}
		}

		&.is-video {
			.item {
				height: 300rpx;
				width: 500rpx;
				text-align: center;
				line-height: 300rpx;
				position: relative;
				overflow: hidden;

				.cover {
					height: 100%;
					width: 100%;
					position: absolute;
					left: 0;
					top: 0;
					border-radius: 10rpx;
				}

				.chat-iconfont {
					color: #fff;
					font-size: 100rpx;
					position: relative;
				}
			}
		}

		&.is-image {
			.main {
				.det {
					.content {
						background-color: #fff;

						image {
							display: block;
							max-width: 300rpx;
							border-radius: 16rpx;
						}
					}
				}
			}
		}
	}
}
</style>
