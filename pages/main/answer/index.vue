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
	export default {
		data() {
			return {
				inputContent: '',
				bootAns: 'AI正在整理答案,请稍等...',
				is_open_api:'',
				ai_chat_api:'',
				open_api_key:'',
				reading:0,
				websock: null,
				lockReconnect:false,
			};
		},
		onLoad(option) {
			this.initWebSocket()
			let data = JSON.parse(decodeURIComponent(option.dataParamInput))
			this.inputContent = data.inputContent
		},
		onUnload(option){
			this.lockReconnect=true;
			this.websock.close()
		},
		methods: {
			// 发送websockwt请求
			initWebSocket() {
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
				if (tbAnsweUser) {
					let websocketUrl = 'ws://localhost:8080/chat/' + tbAnsweUser.openId
					// WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
					this.websock = uni.connectSocket({
						url: websocketUrl,
						complete: () => {} // 由于uni封装，必须加个回调才会返回一个SocketTask对象
					})
					this.websock.onOpen(this.websocketonopen)
					this.websock.onMessage(this.websocketonmessage)
					this.websock.onClose(this.websocketclose)
					this.websock.onError(this.websocketonerror)
				}
			},
			websocketonopen() { // 连接建立之后执行send方法发送数据，连接成功
				this.submitAks(this.inputContent)
			},
			websocketonmessage(e) { // 数据接收
				if (e.data == '[NO__AUTH]') {
					uni.clearStorageSync()
					uni.showToast({
						title: '登录已过期,请重新登陆',
						icon: 'none',
						duration: 2000
					})
					uni.navigateBack();
					return;
				}
				if (!this.reading) {
					//取消加载
					this.bootAns=e.data
					this.reading = 1
				}else if ('[DONE]'==e.data){
					this.reading = 0;
				} else {
					this.bootAns+=e.data
				}
			
			
			
			},
			websocketclose(e) { // 关闭
				this.reconnect()
				console.log('关闭了重连');
			},
			websocketonerror() {
				this.reconnect()
				console.log('断开了重连');
			},
			reconnect() {
				if (this.lockReconnect) return;
				this.lockReconnect = true;
				//没连接上会一直重连，设置延迟避免请求过多
				setTimeout(() => {
					this.initWebSocket();
					console.log('重连中');
					this.lockReconnect = false;
				}, 5000); //这里设置重连间隔(ms)
			},
			submitAks(inputContent) {
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
				if (!tbAnsweUser) {
					uni.showToast({
						title: '登录已过期,请重新登陆',
						icon: 'none',
						duration: 2000
					})
				}else{
					console.log(JSON.stringify({
							"openId": tbAnsweUser.openId,
							"prompt": inputContent,
							"isChat": false
						}))
					this.websock.send({
						data: JSON.stringify({
							"openId": tbAnsweUser.openId,
							"prompt": inputContent,
							"isChat": false
						})
					})
				}
				
				
				// let that = this;
				// let urlPost = '/ai/chatBot';
				// if(this.is_open_api ==='1'){
				// 	let data = {
				// 		"prompt": inputContent,
				// 		"key":this.open_api_key
				// 	}
				// 	urlPost = this.ai_chat_api
				// 	requestA('', urlPost, 'POST', data, {}).then(res => {
						
				// 		if (res.code == 200) {
				// 			that.resultContent = "<pre>" + res.msg + "</pre>";
				// 			that.resultContentText = res.msg;
				// 			// that.loadingText(that.resultContent)
				// 			that.bootAns = that.resultContentText;
				// 		} else if (res.code == 500) {
				// 			if(!res.msg){
				// 				uni.showToast({
				// 					title: '请重新请求',
				// 					icon: 'error',
				// 					duration: 2000
				// 				});
				// 			}else{
				// 			uni.showToast({
				// 				title: res.msg,
				// 				icon: 'error',
				// 				duration: 2000
				// 			});
				// 			setTimeout(()=> {
				// 				uni.switchTab({
				// 					//保留当前页面，跳转到应用内的某个页面
				// 				url: '/pages/main/form/index',
				// 				})
				// 			}, 2000)
				// 			}
				// 		}else{
				// 			uni.showToast({
				// 				title: "请填写正确的请求url",
				// 				icon: 'error',
				// 				duration: 2000
				// 			});
				// 			setTimeout(()=> {
				// 				uni.switchTab({
				// 					//保留当前页面，跳转到应用内的某个页面
				// 				url: '/pages/main/form/index',
				// 				})
				// 			}, 2000)
				// 		}
				// 		// uni.hideLoading();
				// 	})
				// }else{
				// 	let data = {
				// 		"prompt": inputContent
				// 	}
				// 	request('', '/ai/chat', 'POST', data, {}).then(res => {
				// 		console.log(res)
				// 		if (res.code == 200) {
				// 			that.resultContent = "<pre>" + res.msg + "</pre>";
				// 			that.resultContentText = res.msg;
				// 			// that.loadingText(that.resultContent)
				// 			that.bootAns = that.resultContentText;
				// 		} else if (res.code == 500) {
				// 			if(!res.msg){
				// 				uni.showToast({
				// 					title: '请重新请求',
				// 					icon: 'error',
				// 					duration: 2000
				// 				});
				// 			}else{
				// 			uni.showToast({
				// 				title: res.msg,
				// 				icon: 'error',
				// 				duration: 2000
				// 			});
				// 			setTimeout(()=> {
				// 				uni.switchTab({
				// 					//保留当前页面，跳转到应用内的某个页面
				// 				url: '/pages/main/form/index',
				// 				})
				// 			}, 2000)
				// 			}
				// 		}
				// 		// uni.hideLoading();
				// 	})
				// }
				

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
				if (that.bootAns == undefined || that.bootAns === null || that.bootAns ===
					'') {
					uni.showToast({ //提示
						title: `暂无数据或信息正在查询`,
						icon: 'error'
					})
					return;
				} else {
					uni.setClipboardData({
						data: that.bootAns, //要被复制的内容
						success: () => { //复制成功的回调函数
							uni.showToast({ //提示
								title: `复制成功`,
								icon: 'success'
							})
						}
					}, true);
				}
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
