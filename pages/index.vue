<template>
	<view
		class="page-session"
		:style="{
			height,
		}"
		 @touchmove="onTouchMove" 
	>
<!-- 		<view class="header">
			<cl-topbar>
				<view class="cl-topbar__text" @tap="toDetail">
					<text class="cl-topbar__title">神仙都没用</text>
				</view>

				<!-- #ifndef MP -->
				<template slot="append">
					<view class="cl-topbar__icon" @tap="toDetail">
						<cl-icon name="more"></cl-icon>
					</view>
				</template>
				<!-- #endif -->
			</cl-topbar>
		</view> -->

		<!-- 消息列表 -->
		<view class="message-list" @tap="onRetract">
			<scroll-view
				class="scroller"
				scroll-y
				scroll-with-animation
				:scroll-top="scroller.top"
				:scroll-into-view="scroller.intoView"
				:upper-threshold="20"
			>
				<!-- 加载更多 -->
				<view class="loadmore" v-if="loading">
					<cl-loadmore text="" finish-text="" loading :divider="false"></cl-loadmore>
				</view>

				<!-- 内容块 -->
				<chat-message ref="message" :list="list" :userInfo="userInfo"></chat-message>
			</scroll-view>

			<!-- 录音弹窗 -->
			<cl-popup
				:visible.sync="voice.visible"
				direction="center"
				padding="0"
				border-radius="10rpx"
			>
				<view
					class="popup-voice"
					:class="[
						{
							'is-cancel': voiceIsCancel,
						},
					]"
				>
					<text class="popup-voice__time">{{ voice.duration | voice_duration }}</text>
					<text class="popup-voice__desc">松开发送，上滑取消</text>
				</view>
			</cl-popup>
		</view>

		<!-- 操作栏 -->
		<view class="opbar">
			<view class="main">
				<!-- 麦克风 -->
				<!-- #ifndef H5 -->
				<!-- <view class="icon">
					<text
						class="chat-iconfont icon-microphone"
						v-if="!op.isMicrophone"
						@tap="showMicrophone"
					></text>
					<text class="chat-iconfont icon-keyboard" @tap="hideMicrophone" v-else></text>
				</view> -->
				<!-- #endif -->

				<!-- 输入框 -->
				<view class="input" @click="getUserProfile">
					<button
						v-if="op.isMicrophone"
						class="press-btn"
						@longpress="onLongPress"
						@touchend="onRelease"
					>
						{{ voice.visible ? "松开结束" : "按住说话" }}
					</button>
					<cl-input
						v-else
						v-model="value"
						confirm-type="send"
						confirm-hold
						fill
						:cursor-spacing="10"
						:adjust-position="false"
						@focus="onFocus"
						@blur="onBlur"
						@confirm="onTextSend"
						@keyboardheightchange="onKeyBoardHeightChange"
					></cl-input>
				</view>

				<view @tap="onTextSend">
					<!-- <text
						class="chat-iconfont cl-icon-enter"
						@tap="onTextSend"
					></text> -->
					<cl-icon name="cl-icon-enter" :size="60"></cl-icon>
				</view>
				<!-- 工具栏图标 -->
<!-- 				<view class="icon">
					<text
						class="chat-iconfont icon-add-circle"
						v-if="!op.isTools"
						@tap="showTools"
					></text>
					<text class="chat-iconfont icon-subtract-circle" @tap="hideTools" v-else></text>
				</view> -->

				<!-- 表情图标 -->
<!-- 				<view class="icon">
					<text 
						class="chat-iconfont icon-emoji"
						v-if="!op.isEmoji"
						@tap="showEmoji"
					></text>
					<text class="chat-iconfont icon-keyboard" v-else @tap="hideEmoji"></text>
				</view> -->
			</view>

			<view class="append">
				<!-- 工具栏 -->
				<chat-tools :visible="op.isTools"></chat-tools>

				<!-- 表情 -->
				<chat-emoji :visible="op.isEmoji" @select="onEmojiSelect"></chat-emoji>
			</view>
		</view>
	</view>
</template>

<script>
import { debounce } from "cl-uni/utils";
import ChatTools from "../components/tools";
import ChatMessage from "../components/message";
import ChatEmoji from "../components/emoji";
import request from "../request/request.js";
// 录音设备
const recorderManager = uni.getRecorderManager();

// 平台
const { platform } = uni.getSystemInfoSync();

export default {
	components: {
		ChatTools,
		ChatMessage,
		ChatEmoji,
	},

	data() {
		return {
			iscome:false,
			resultContent:'',
			resultContentText:'',
			bootAns:'',
			js_code: '',
			// 登录的用户信息
			userInfo: [{
				id: 1,
				name: "COOL",
				avatarUrl:
					"https://upageui.cool-js.com/show/comm/logo.png?x-oss-process=image/resize,w_200"
			}],
			hasUserInfo: false,
			canIUseGetUserProfile: false,
			// 平台
			platform,
			// 输入框文本
			value: "",
			// 键盘高度
			keyBoardHeight: 0,
			// 聊天记录数据
			list: [
				{
					contentType: 0, //这个不同类型代表不同的含义
					fromId: 2,
					name: "人工AI",
					avatarUrl:"",
					content: {
						text: "你好我是智能机器人,有什么您可以问我。",
					},
				}
			],
			// 底部操作栏配置
			op: {
				isMicrophone: false,
				isEmoji: false,
				isTools: false,
			},
			// 滚动条配置
			scroller: {
				top: 0,
				intoView: "",
			},
			// 视频配置
			video: {
				visible: false,
			},
			// 音频配置
			voice: {
				visible: false,
				duration: 0,
				timer: null,
				down: 0,
				move: 0,
			},
			// 加载进度
			loading: false,
		};
	},
	onLoad() {
		
		// this.getUserProfile();
		
		
	},
	computed: {
		// 计算屏幕高度
		height() {
			return this.keyBoardHeight > 0
				? `calc(100% - ${this.keyBoardHeight}px + env(safe-area-inset-bottom))`
				: "100%";
		},

		// 录音滑动是否取消
		voiceIsCancel() {
			return this.voice.move ? this.voice.down - this.voice.move > 50 : false;
		},
	},

	filters: {
		voice_duration(t) {
			return `00:${t < 10 ? `0${t}` : t}`;
		},
	},

	methods: {
		// 监听键盘高度
		onKeyBoardHeightChange(e) {
			this.keyBoardHeight = e.detail.height;
		},
		// 滑动监听
		onTouchMove(e) {
			if (this.voice.visible) {
				// 记录移动的位置
				this.voice.move = e.changedTouches[0].clientY;
			}
		},

		// 长按说话
		onLongPress(e) {
			// 关闭已存在播放声音
			this.$refs["message"].voicePause();
			// console.log(e)
			this.$nextTick(() => {
				// 记录按下位置
				this.voice.down = e.detail.y;
				// 清空移动位置
				this.voice.move = 0;
				// 显示弹窗
				this.voice.visible = true;
				// 开始录音
				recorderManager.start({
					duration: 60000,
					format: "mp3",
					frameSize: 50,
				});
				// 计数器
				this.voice.timer = setInterval(() => {
					if (this.voice.duration >= 60) {
						this.onRelease(e);
					} else {
						this.voice.duration += 1;
					}
				}, 1000);
			});
		},

		// 松开
		onRelease(e) {
			// 记录移动位置
			this.voice.move = e.changedTouches[0].clientY;

			// 暂停事件
			recorderManager.onStop(async (res) => {
				// 判断是否取消
				if (!this.voiceIsCancel) {
					console.log(e)
				}
			});
			// 清除计时器
			clearInterval(this.voice.timer);
			// 暂停录音
			recorderManager.stop();
			// 关闭弹窗
			this.voice.visible = false;
			// 清空时常
			this.voice.duration = 0;
		},

		// 显示麦克风
		showMicrophone() {
			this.op.isMicrophone = true;
			this.hideTools();
			this.hideEmoji();
			this.hideKeyBoard();
		},

		// 隐藏麦克风
		hideMicrophone() {
			this.op.isMicrophone = false;
		},

		// 显示表情
		showEmoji() {
			this.op.isEmoji = true;
			this.hideTools();
			this.hideMicrophone();
			this.scrollToBottom();
		},

		// 隐藏表情
		hideEmoji() {
			this.op.isEmoji = false;
		},

		// 显示工具栏
		showTools() {
			this.op.isTools = true;
			this.hideEmoji();
			this.hideMicrophone();
			this.scrollToBottom();
		},

		// 隐藏工具栏
		hideTools() {
			this.op.isTools = false;
		},

		// 隐藏键盘
		hideKeyBoard() {
			this.keyBoardHeight = 0;
		},

		// 滑动到底部
		scrollToBottom: debounce(function () {
			this.$nextTick(() => {
				this.scroller.top = 1000000 + parseInt(Math.random() * 100);
			});
		}, 300),

		// 收起
		onRetract() {
			this.hideTools();
			this.hideEmoji();
		},

		// 聚焦
		onFocus() {
			this.hideEmoji();
			this.hideTools();
			this.scrollToBottom();
		},

		// 失焦
		onBlur() {
			this.hideKeyBoard();
		},

		// 发送消息
		onTextSend() {
			let that = this;
			if (this.value) {
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser');
				let checkData ={
					"answeUserOpenid": tbAnsweUser.answeUserOpenid,
				}
				request('', '/ai/checkIsIng', 'GET', checkData, {}).then(res => {

					if (res == true) {
						//如果返回的是true,提示,正在查询请稍后重试
						uni.showToast({
							title: "正在回复",
							icon: 'error',
							duration: 2000
						});
						return;
					}else{
						console.log("这块不应该运行")
						that.sendMessage(
							{
								contentType: 0,
								content: {
									text: that.value,
								},
							},
							true
						);
						
						that.value = "";
					}
				})
				
				

			}
		},
		

		// 表情选择
		onEmojiSelect(url) {
			this.sendMessage(
				{
					contentType: 2,
					content: {
						imageUrl: url,
					},
				},
				true
			);
		},

		// 发送语音
		onVoiceSend({ url, duration }) {
			this.sendMessage(
				{
					contentType: 3,
					content: {
						voiceUrl: url,
						duration,
					},
				},
				true
			);
		},

		// 发送消息
		sendMessage(data, isAppend) {			
			// socket.send
			data.fromId = 1;
			data.content.text = data.content.text.trim();
			
			if(!data.content.text|| data.content.text == undefined || data.content.text === null || data.content.text ===''){
				
					uni.showToast({
						title: '发送内容不可为空',
						icon: 'error',
						duration: 2000
					});
					return;
			}	
			
			if (isAppend) {
				this.append(data);
				// console.log(data)
				this.requestChatApi(data.content.text);
			}
			
		},
		requestChatApi(prompt){
			let that = this;
			let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
			let data = {
				"answeUserOpenid": tbAnsweUser.answeUserOpenid,
				"answeUserPhone": tbAnsweUser.answeUserPhone,
				"answeUserName": tbAnsweUser.answeUserName,
				"answeUserAvatar": tbAnsweUser.answeUserAvatar,
				"answeUserJson": tbAnsweUser.answeUserJson,
				"prompt":prompt,
			}
			request('', '/ai/chatBot', 'POST', data, {}).then(res => {
				if (res.code == 200) {
					this.append(res.data);
					let data1 = {
						"answeUserOpenid": tbAnsweUser.answeUserOpenid,
						"answeUserPhone": tbAnsweUser.answeUserPhone,
						"answeUserName": tbAnsweUser.answeUserName,
						"answeUserAvatar": tbAnsweUser.answeUserAvatar,
						"answeUserJson":JSON.stringify(that.list),
					}
					this.saveChat(data1);
				} else if (res.code == 500) {
					uni.showToast({
						title: '回复失败,请重新提问',
						icon: 'error',
						duration: 2000
					});
				}
				// uni.hideLoading();
			})
		},
		saveChat(data1){
			//进行存储
			request('', '/ai/chatSave', 'POST', data1, {}).then(res => {
				if (res.code != 200) {
					console.log(1111);
				}
			})
		},

		// 追加数据到开头
		prepend(...data) {
			this.list.unshift(...data.filter(Boolean).reverse());
		},

		// 追加数据到结尾
		append(...data) {
			this.list.push(
				...data
					.map((e) => {
						e.animation = true;
						return e;
					})
					.filter(Boolean)
			);
			this.scrollToBottom();
		},

		// 关闭视频弹窗
		onVideoClose() {
			const video = uni.createVideoContext("video");
			video.pause();
		},

		// 聊天详情
		toDetail() {
			uni.navigateTo({
				url: "/pages/chat/detail",
			});
		},
		
		//微信登陆
		wxLogo(){
			let that  = this;
				wx.login({
				  success (res) {
				    if (res.code) {
						that.js_code = res.code;
						// console.log("js_code为:",that.js_code)
				    } else {
				      console.log('登录失败！' + res.errMsg)
				    }
				  }
				})
		},
		//插入openid以及另一个信息,初始化个人信息   
		InsertOpinID(userInfo){
			let that  = this;
			let data =  {
				'answeUserName': userInfo.nickName,
				'answeUserAvatar': userInfo.avatarUrl,
				'js_code': that.js_code,
				
			}
			// console.log(data)
			request('', '/ai/insertOpinID', 'POST', data, {}).then(res => {
				// console.log(res)
				if (res.code == 200) {
					
				console.log("从接口获取数据",res.data)
				uni.setStorageSync('tbAnsweUser',res.data );
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
		getUserProfile(e) {
			//首先判断缓存是否存在
			let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
			let that = this
			if (!tbAnsweUser) {
				that.wxLogo();
				uni.getUserProfile({
						desc: '用户登录',
						success: res => {
							that.InsertOpinID(res.userInfo);
						}
					})
				tbAnsweUser = uni.getStorageSync('tbAnsweUser');	
			}else{
				// console.log("从缓存获取数据",uni.getStorageSync('tbAnsweUser'))
			}
			that.userInfo[0].name = tbAnsweUser.answeUserName
			that.userInfo[0].avatarUrl = tbAnsweUser.answeUserAvatar
			that.$set(that.userInfo[0], 'name', tbAnsweUser.answeUserName);
			// 	console.log(tbAnsweUser.answeUserJson)
			// that.list = JSON.parse(tbAnsweUser.answeUserJson)
			// console.log(that.list)
		  },
		
		
	},
};
</script>

<style lang="scss">
@import "../static/css/iconfont.scss";
page {
	height: 100%;
	overflow: hidden;
	background-color: #fff;
}
</style>

<style lang="scss" scoped>
.page-session {
	display: flex;
	flex-direction: column;
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: border-box;
	height: 100%;

	.message-list {
		flex: 1;
		overflow: hidden;
		background-color: #f7f7f7;
		position: relative;

		.loadmore {
			margin: 10rpx 0;
		}

		.scroller {
			height: 100%;
		}

		/deep/.cl-popup {
			&__wrapper {
				position: absolute;
			}
		}
	}

	.opbar {
		flex-shrink: 0;
		z-index: 9;
		background-color: #fff;
		border-top: 1rpx solid #f7f7f7;

		.main {
			display: flex;
			align-items: center;
			height: 100rpx;

			.icon {
				height: 80rpx;
				width: 80rpx;
				line-height: 80rpx;
				text-align: center;
				flex-shrink: 0;

				.chat-iconfont {
					font-size: 60rpx;
				}
			}

			.input {
				flex: 1;
				margin: 0 10rpx;
				height: 70rpx;
				line-height: 70rpx;

				.press-btn {
					display: inline-block;
					height: 70rpx;
					width: 100%;
					line-height: 70rpx;
					color: #666;
					border: 1rpx solid #dcdfe6;
					font-size: 24rpx;
					background-color: #fff;
					margin: 0;
					border-radius: 70rpx;
					box-sizing: border-box;

					&::after {
						border: 0;
					}

					&:active {
						background-color: #f7f7f7;
					}
				}
			}
		}
	}

	.popup-voice {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;

		&.is-cancel {
			background-color: red;
			color: #fff;
		}

		&__time {
			font-size: 28rpx;
			margin-bottom: 20rpx;
			letter-spacing: 1rpx;
		}

		&__desc {
			font-size: 24rpx;
		}
	}
}
</style>
