<template>
	<view>

		<!-- 空盒子用来防止消息过少时 拉起键盘会遮盖消息 -->
		<view  :animation="anData"  style="height:0;"></view>
		<u-sticky>		
			<view  class="top-new">
				<view @click="historyChat()" class="top-reset">历史对话</view>
				<view @click="resetChat()" class="top-reset">重置对话</view>
			</view>
		</u-sticky>
		<!-- 消息体 -->
		<scroll-view scroll-with-animation scroll-y="true"  @touchmove="hideKey"
		style="width: 750rpx;" :style="{'height':srcollHeight}" :scroll-top="go" >
			<!-- 用来获取消息体高度 -->
		<view id="okk" scroll-with-animation >
			<!-- 消息 -->
			<view  class="flex-column-start" v-for="(x,i) in msgList" :key="i">

				<!-- 用户消息 头像可选加入-->
				<view v-if="x.my" class="flex justify-end padding-right one-show  align-start  padding-top" >
				<!-- 	<image v-if="!x.my" class="chat-img" src="../../static/..." mode="aspectFill" ></image> -->	
					<view class="flex justify-end"  style="width: 400rpx;">
						<view class="margin-left padding-chat bg-cyan" style="border-radius: 35rpx;">
							<text   style="word-break: break-all;">{{x.msg}}</text>
							
							<view style="margin-top: 10px;">
								<u-icon @click="copyContent(x.msg)" name="order" color="#cfcfd1" size="22"></u-icon>
							</view>
						</view>
					</view>
				<image  style="height: 75rpx;width: 75rpx;"  class="chat-img margin-left" :src="userInfo.avatarUrl" mode="aspectFill" ></image>
				</view>
				<!-- 机器人消息 -->
				<view v-if="!x.my" class="flex-row-start margin-left margin-top one-show" >
					<view class="chat-img flex-row-center">
						<image style="height: 75rpx;width: 75rpx;" src="../../../static/wxlogo.png" mode="aspectFit"></image>
					</view>
					<view  class="flex"  style="width: 500rpx;">
						<view class="margin-left padding-chat flex-column-start" style="border-radius: 35rpx;background-color: #f9f9f9;">
							<text  style="word-break: break-all;" >{{x.msg}}</text>
							
							
							<!-- 消息模板 =>初次问候 -->
							<view class="flex-column-start" v-if="x.type==1" style="color: #2fa39b;">
								<text style="color: #838383;font-size: 22rpx;margin-top: 15rpx;">请详细描述您要问的问题，例如:</text>
								<text @click="answer(item)" style="margin-top: 30rpx;" 
								v-for="(item,index) in x.questionList" :key="index" >{{item}}</text>
								<view v-if="!isLoginStatus" class="flex-row-start  padding-top-sm">
									<text class="my-neirong-sm">您暂时还未登陆,请先进行登录。</text>
									<text class="padding-left"   @click="getUserProfile" style="color: #007AFF;">登录</text>
								</view>
								
							</view>
							<view style="margin-top: 10px;">
								<u-icon @click="copyContent(x.msg)" name="order" color="#cfcfd1" size="22"></u-icon>
							</view>
							
							
							<!-- 消息模板 =>多个答案 -->
							<view class="flex-column-start" v-if="x.type==2" style="color: #2fa39b;">
								<text style="color: #838383;font-size: 22rpx;margin-top: 15rpx;">猜你想问:</text>
								<!-- 连接服务器应该用item.id -->
								<text @click="answer(index)" style="margin-top: 30rpx;" 
								v-for="(item,index) in x.questionList" :key="index" >{{item}}</text>
							</view>
							
							
							<!-- 消息模板 => 无法回答-->
							<view class="flex-column-start" v-if="x.type==0">
								<text class="padding-top-sm" style="color: #2fa39b;">提交意见与反馈</text>
								<text style="color: #838383;font-size: 22rpx;margin-top: 15rpx;">下面是一些常见问题,您可以点击对应的文字快速获取答案:</text>
								<text @click="answer(index)" style="margin-top: 30rpx;color: #2fa39b;" 
								v-for="(item,index) in x.questionList" :key="index" >{{item}}</text>
								<view class="flex-row-start  padding-top-sm">
									<text class="my-neirong-sm">没有你要的答案?</text>
									<text class="padding-left" style="color: #1396c5;">换一批</text>
								</view>
							</view>
						
						
						</view>
					</view>
				</view>
		</view>
		<!-- loading是显示 -->
		<view v-show="msgLoad" class="flex-row-start margin-left margin-top">
			<view class="chat-img flex-row-center">
				<image style="height: 75rpx;width: 75rpx;" src="../../../static/wxlogo.png" mode="aspectFit"></image>
			</view>
			<view  class="flex"  style="width: 500rpx;">
				<view class="margin-left padding-chat flex-column-start" 
				style="border-radius: 35rpx;background-color: #f9f9f9;">
					<view class="cuIcon-loading turn-load" style="font-size: 35rpx;color: #3e9982;"></view>
				</view>
			</view>	
		</view>
		<!-- 防止消息底部被遮 -->
		<view style="height: 120rpx;"></view>
		</view>	
	
		</scroll-view>		

		<!-- 底部导航栏 -->
		<view  @click="isLogin()"   class="flex-column-center" style="position: fixed;bottom: -180px;"
		:animation="animationData" >		
			<view class="bottom-dh-char flex-row-around" style="font-size: 55rpx;">
				<!-- vue无法使用软键盘"发送" -->
				 
				 
				 <input  v-model="msg"  class="dh-input" :disabled="!isLoginStatus" type="text" style="background-color: #f0f0f0;font-size: 14px;" 
				 @confirm="sendMsg" confirm-type="search" placeholder-class="my-neirong-sm"
				 placeholder="用一句简短的话描述您的问题" /> 
				 
				 
				 
				 <view @click="sendMsg" class="cu-tag bg-cyan round  "style="margin-left: -26rpx;">
				 	发送
				 </view>
				<!-- <text @click="ckAdd" class="cuIcon-roundaddfill text-brown"></text> -->
			</view>		
				<!-- 附加栏(自定义) -->
			<view class="box-normal flex-row-around flex-wrap">
				<view class="tb-text">
					<view class="cuIcon-form"></view>
					<text >问题反馈</text>
				</view>
				<view @click="historyChat" class="tb-text">
					<view class="cuIcon-form"></view>
					<text>历史对话</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../../request/request.js";
	import requestA from "../../../request/requestA.js";
	// rpx和px的比率
	var l
	// 可用窗口高度
	var wh
	// 顶部空盒子的高度
	var mgUpHeight
	export default {	
		onLoad(){
			//获取请求链接
			this.getRequestContent();
			this.initLogin()
			// 如果需要缓存消息缓存msgList即可
			// 监听键盘拉起
			// 因为无法控制键盘拉起的速度,所以这里尽量以慢速处理
			uni.onKeyboardHeightChange(res => {
				const query = uni.createSelectorQuery()
				query.select('#okk').boundingClientRect(data => {
					// 若消息体没有超过2倍的键盘则向下移动差值,防止遮住消息体
					var up=res.height*2-data.height-l*110
					
				  if(up>0){
					  // 动态改变空盒子高度
					 this.msgMove(up,300)
					 // 记录改变的值,若不收回键盘且发送了消息用来防止消息过多被遮盖
					 mgUpHeight=up
				  }
				  // 收回
				  if(res.height==0){
					   this.msgMove(0,0)	
				  }
				}).exec();
			 })
			var query=uni.getSystemInfoSync()
						
			l=query.screenWidth/750		
			wh=query.windowHeight								
			this.srcollHeight=query.windowHeight+"px"
		},
		data() {
			return {
				msgLoad:false,
				anData:{},
				animationData:{},
				showTow:false,
				// 消息体,定义机器人初次的消息(或者自定义出现时机)
				// my->谁发的消息 msg->消息文本 type->客服消息模板类型 questionList->快速获取问题答案的问题列表
				msgList:[
					{my:false,msg:"你好，我是最牛逼的机器人,有什么您可以问我。",
				     type:1,
					 questionList:["我想要写一个50字关于花的诗句","帮我写一个关于催债的律师函","你觉得我帅吗"],
					 }],
				msg:"",
				go:0,
				srcollHeight:0,
				userInfo:{},
				isLoginStatus:false,
				is_open_api:'',
				ai_chat_bot_api:'',
				open_api_key:'',
				websock: null,
				lockReconnect: false,
				reading:0,
				last_recive_time:0
			}
		},
		mounted() {
		   // 调取websocket方法 写在mounted方法中
		   this.initWebSocket()
		},
		methods: {
			
			        // 发送websockwt请求
			initWebSocket() {
			  let websocketUrl = 'ws://localhost:8080/chat/1'
			  // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
			  this.websock =uni.connectSocket({
				url: websocketUrl,
				complete: ()=> {} // 由于uni封装，必须加个回调才会返回一个SocketTask对象
			  })
				this.websock.onOpen(this.websocketonopen)
				this.websock.onMessage(this.websocketonmessage)
				this.websock.onClose(this.websocketclose)
				this.websock.onError(this.websocketonerror)
			},
			  websocketonopen() { // 连接建立之后执行send方法发送数据，连接成功
					// const data = {
					// 	token: this.userInfo.access_token
					// };
					// if (data.token) {
					// 	const result = JSON.stringify(data);
					//     this.websock.send({
					// 		data: result
					// 	})
					// } else {
					// 	this.websock.close()
					// }
				},
				websocketonmessage (e) { // 数据接收
							if(!this.reading){
								//取消加载
								this.msgLoad=false;
								//添加机器人所说的话
								this.msgGo();
								this.msgList.push({my:false,msg:e.data,type:-1});
								this.reading=1
								this.last_recive_time=Date.now()
							}
							else{
								setTimeout(()=>{
									this.msgList[this.msgList.length-1].msg
									=this.msgList[this.msgList.length-1].msg+e.data;
									this.msgList=JSON.parse(JSON.stringify(this.msgList))
								},(Date.now()-this.last_recive_time)*8)
							}
							
							

							
				},
				websocketclose (e) {  // 关闭
					console.log('断开了重连');
					this.reconnect()
			    },
				websocketonerror () {
						console.log('断开了重连');
						this.reconnect()
				},
			    reconnect() {
			        if(this.lockReconnect) return;
					this.lockReconnect = true;
				    //没连接上会一直重连，设置延迟避免请求过多
			        setTimeout( ()=> { 
						this.initWebSocket();
						console.log('重连中');
						this.lockReconnect = false;
					}, 5000); //这里设置重连间隔(ms)
			    },
			//历史信息
			resetChat(){
								
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
				
				if (tbAnsweUser) {
				let replyData={};
					//进行存储
					request('', '/ai/reSetChat?openId='+tbAnsweUser.answeUserOpenid, 'POST', replyData, {}).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '重置成功',
								duration: 2000
							});
						}
					})
				}else{
					this.getUserProfile();
				}
					
					
			},
			//历史信息
			historyChat(){
				uni.showToast({
					title: '开发中',
					duration: 2000
				});
			},
			//复制
			copyContent(msg){
				uni.setClipboardData({
					data: msg
				});
			},
			//初始化看是否登录
			initLogin(){
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
				if (tbAnsweUser) {
					//此部设置用户信息,
					this.userInfo.name = tbAnsweUser.answeUserName
					this.userInfo.avatarUrl = tbAnsweUser.answeUserAvatar
					this.isLoginStatus = true
				}
			},
			//是否登录
			isLogin(){
				if(!this.isLoginStatus){
					this.getUserProfile();
				}
			},
			// 切换输入法时移动输入框(按照官方的上推页面的原理应该会自动适应不同的键盘高度-->官方bug)
			goPag(kh){	
				this.upTowmn(0,250)
				if(this.keyHeight!=0){					
					if(kh-this.keyHeight>0){
						this.upTowmn(this.keyHeight-kh,250)
					}
					
				}
			},
			// 移动顶部的空盒子
			msgMove(x,t){
				var animation = uni.createAnimation({
				        duration: t,
				          timingFunction: 'linear',
				      })
				  
				      this.animation = animation
				  
				      animation.height(x).step()
				  
				      this.anData = animation.export()
			},
			// 保持消息体可见
			msgGo(){
				const query = uni.createSelectorQuery()
				// 延时100ms保证是最新的高度
				setTimeout(()=>{
					// 获取消息体高度
					query.select('#okk').boundingClientRect(data => {
					   // 如果超过scorll高度就滚动scorll
					   if(data.height-wh>0){
						   this.go=data.height-wh
					   }
					   console.log(this.go)
					   // 保证键盘第一次拉起时消息体能保持可见
					   var moveY=wh-data.height+200
					   // 超出页面则缩回空盒子
					   if(moveY-mgUpHeight<0){
						   // 小于0则视为0
						   if(moveY<0){
							   this.msgMove(0,200)
						   }else{
							   // 否则缩回盒子对应的高度
							  this.msgMove(moveY,200) 
						   }					   
					   }
						
					}).exec();
				},100)
			},
			// 回答问题的业务逻辑
			answer(askItem){
				// 这里应该传入问题的id,模拟就用index代替了
				console.log("问题吗这里是",askItem)
				this.msg = askItem;
				this.sendMsg();
			},
			sendMsg(){
				// 消息为空不做任何操作
				if(this.msg==""){
					return 0;
				}
				// 显示消息 msg消息文本,my鉴别是谁发的消息(不能用俩个消息数组循环,否则消息不会穿插)
				// this.msgList.push({"msg":this.msg,"my":true})				
				// 保证消息可见
				// 回答问题
				this.msgKf(this.msg)
				// 清除消息
				console.log("清楚消息")
				this.msg=""
			},
			msgKf(x){
			// this.msgGo()
			this.onTextSend(x)

				// loading
				// this.msgLoad=true
				// 这里连接服务器获取答案
				// 下面模拟请求
					// 取消loading
					// this.msgLoad=false
					// this.msgList.push({my:false,msg:"娜娜还在学习中,没能明白您的问题,您点击下方提交反馈与问题,我们会尽快人工处理(无法回答模板)",type:0,questionList:["如何注销用户","我想了解业务流程","手机号如何更换"]})
					// this.msgList.push({my:false,msg:"单消息模板",type:-1})
					// this.msgList.push({my:false,msg:"根据您的问题,已为您匹配了下列问题(多个答案模板)",type:2,questionList:["如何注销用户","我想了解业务流程","手机号如何更换"]})
					
				
			},
			//发送消息
			onTextSend(x){
				let that = this;
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser');
				let checkData ={
					"answeUserOpenid": tbAnsweUser.answeUserOpenid,
				}
				request('', '/ai/checkIsIng', 'GET', checkData, {}).then(res => {
					if (res == true) {
						//如果返回的是true,提示,正在查询请稍后重试
						uni.showToast({
							title: "正在回复中",
							icon: 'error',
							duration: 2000
						});
						return;
					}else{
						console.log(x)
						that.sendMessage(x,true);
					}
				})
			},
			// 发送消息
			sendMessage(msg, isAppend) {	
				
				msg = msg.trim();
				
				if(!msg|| msg == undefined || msg === null || msg ===''){
						uni.showToast({
							title: '发送内容不可为空',
							icon: 'error',
							duration: 2000
						});
						return;
				}	
				if (isAppend) {
					//此步进行添加内容
					// 显示消息 msg消息文本,my鉴别是谁发的消息(不能用俩个消息数组循环,否则消息不会穿插)
					this.msgList.push({"msg":msg,"my":true})
					this.msgGo();
					// this.requestChatApi(msg);
					let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); 
					this.websock.send({
						data: JSON.stringify({"openId":tbAnsweUser.answeUserOpenid,"prompt":"say this is test1","isChat":true})
					})
				}
				
			},
			requestChatApi(prompt){
				// loading
				this.msgLoad=true;
				let that = this;
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容

				let urlPost = '/ai/chatBot';
				if(this.is_open_api=='1'){
					urlPost = this.ai_chat_bot_api
					let data = {
						"answeUserOpenid": tbAnsweUser.answeUserOpenid,
						"answeUserPhone": tbAnsweUser.answeUserPhone,
						"answeUserName": tbAnsweUser.answeUserName,
						"answeUserAvatar": tbAnsweUser.answeUserAvatar,
						"answeUserJson": tbAnsweUser.answeUserJson,
						"prompt":prompt,
						"key":this.open_api_key
					}
					requestA('', urlPost, 'POST', data, {}).then(res => {
						if (res.code == 200) {
							//取消加载
							this.msgLoad=false;
							//添加机器人所说的话
							this.msgList.push({my:false,msg:res.data.content.text,type:-1});
							this.msgGo();
							let replyData = {
								"answeUserOpenid": tbAnsweUser.answeUserOpenid,
								"answeUserPhone": tbAnsweUser.answeUserPhone,
								"answeUserName": tbAnsweUser.answeUserName,
								"answeUserAvatar": tbAnsweUser.answeUserAvatar,
								"answeUserJson":JSON.stringify(that.list),
							}
							
							this.saveChat(replyData);
						} else if (res.code == 500) {
							uni.showToast({
								title: res.msg,
								icon: 'error',
								duration: 2000
							});
						}else{
							uni.showToast({
								title: '请填写正确的请求url',
								icon: 'error',
								duration: 2000
							});
						}
					})
				}else{						
					let data = {
							"answeUserOpenid": tbAnsweUser.answeUserOpenid,
							"answeUserPhone": tbAnsweUser.answeUserPhone,
							"answeUserName": tbAnsweUser.answeUserName,
							"answeUserAvatar": tbAnsweUser.answeUserAvatar,
							"answeUserJson": tbAnsweUser.answeUserJson,
							"prompt":prompt,
						}
					request('', urlPost, 'POST', data, {}).then(res => {

						if (res.code == 200) {
							//取消加载
							this.msgLoad=false;
							//添加机器人所说的话
							this.msgList.push({my:false,msg:res.data.content.text,type:-1});
							this.msgGo();
							let replyData = {
								"answeUserOpenid": tbAnsweUser.answeUserOpenid,
								"answeUserPhone": tbAnsweUser.answeUserPhone,
								"answeUserName": tbAnsweUser.answeUserName,
								"answeUserAvatar": tbAnsweUser.answeUserAvatar,
								"answeUserJson":JSON.stringify(that.list),
							}
							
							this.saveChat(replyData);
						} else if (res.code == 500) {
							uni.showToast({
								title: res.msg,
								icon: 'error',
								duration: 2000
							});
						}
					})
				}

			},
			saveChat(replyData){
				//进行存储
				request('', '/ai/chatSave', 'POST', replyData, {}).then(res => {
					if (res.code != 200) {
						console.log(1111);
					}
				})
			},
			// 不建议输入框聚焦时操作此动画
			ckAdd(){
				if(!this.showTow){
					this.upTowmn(-180,350)
				}else{
					this.upTowmn(0,200)
				}
				this.showTow=!this.showTow
			},
			hideKey(){
				uni.hideKeyboard()
			},
			// 拉起/收回附加栏
			upTowmn(x,t){
				
				 var animation = uni.createAnimation({
				      duration: t,
				        timingFunction: 'ease',
				    })
				 				
				    this.animation = animation
				 				
				    animation.translateY(x).step()
				 				
				    this.animationData = animation.export()
			},
			//登录用户,获取用户的信息
			getUserProfile(e) {
				//首先判断缓存是否存在
				let tbAnsweUser = uni.getStorageSync('tbAnsweUser'); //获取缓存内容
				let that = this
				if (!tbAnsweUser) {
					that.wxLogo();
					uni.getUserProfile({
							desc: '用户登录',
							success: res => {
								console.log("getUser",res)
								uni.showLoading({
								    title: '登陆中...',
									mask:true
								});
								that.InsertOpinID(res.userInfo);
							},
							fail: res => {
								uni.hideLoading();
							}
						})
				}
			  },
				//微信登陆
				wxLogo(){
					let that  = this;
						wx.login({
						  success (res) {
							if (res.code) {
								that.js_code = res.code;
							} else {
							  console.log('登录失败！' + res.errMsg)
							}
						  }
						})
				},		
				//插入openid以及另一个信息,初始化个人信息  - 将这些信息实例化到数据库
				InsertOpinID(userInfo){
					console.log("userinfo",userInfo)
					
					
					let that  = this;
					let data =  {
						'answeUserName': userInfo.nickName,
						'answeUserAvatar': userInfo.avatarUrl,
						'js_code': that.js_code,
						
					}
					request('', '/ai/insertOpinID', 'POST', data, {}).then(res => {
						console.log("首次请求返回结果",res.data)
						if (res.code == 200) {
						
						//此部设置用户信息,
						that.userInfo.name = res.data.answeUserName
						that.userInfo.avatarUrl = res.data.answeUserAvatar
						
						//设置已经登陆的标志
						that.isLoginStatus = true;
						uni.setStorageSync('tbAnsweUser',res.data );
						} else{
							uni.showToast({
								title: '请求错误',
								icon: 'error',
								duration: 2000
							});
						}
						uni.hideLoading();
					})	
				},
				getRequestContent(){
					
					request('', '/ai/configInfo', 'POST', {}, {}).then(res => {
						
						if (res.code == 200) {
							this.is_open_api = res.data.is_open_api;
							this.ai_chat_bot_api = res.data.ai_chat_bot_api;
							this.open_api_key = res.data.open_api_key; 
						}
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

<style lang="scss">

.bottom-dh-char{
	 	background-color: #f9f9f9;
	 	width: 750rpx;
	 	height: 110rpx;
	 }
.center-box{
	width: 720rpx;
	padding-left: 25rpx;
}
.hui-box{
	width: 750rpx;
	height: 100%;
	
}
.dh-input{
	width: 500rpx;
	height: 65rpx;
	border-radius: 30rpx;
	padding-left: 15rpx;
	background-color: #FFFFFF;
}
.box-normal{
	width: 750rpx;
	height: 180px;
	background-color: #FFFFFF;
}
.tb-text view{
	font-size: 65rpx;
}
.tb-text text{
	font-size: 25rpx;
	color: #737373;
}
.chat-img{
	border-radius: 50%;
	width: 100rpx;
	height: 100rpx;
	background-color: #f7f7f7;
}

.padding-chat{
	padding: 17rpx 20rpx;
}
.tb-nv{
	width: 50rpx;
	height: 50rpx;
}
.top-new{
	background-color: #26B3A0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	align-items: center;
}
.top-reset{
	    width: 40%;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    margin: 7px 15px;
	    background-color: #fff;
	    padding: 3px;
	    border-radius: 5px;
	    position: relative;
}
</style>
