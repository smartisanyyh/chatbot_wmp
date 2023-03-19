/**
 * 
 * @param {*} urlType 
 * @param {接口请求地址} url 
 * @param {接口请求类型} type 
 * @param {接口请求参数} date 
 * @param {接口请求头的携带信息，如不自定将某人携带token为请求头部} header 
 * @param (status === 0 为接口请求失败返回失败原因，并弹框展示) 
 * @param (status === 1 为接口请求成功返回成功响应数据) 
 * @param (status === 2 为接口请求成功，但是需要token校验，没有token返回登录页面重新授权登录回去token)
 *
 *
 */
// 未获取token跳转的授权页面
const loginPage = '/pages/login/index'
 
// 接口请求提示语句
const msg = '获取中...'
export const baseURL = 'http://localhost:8080' //此处改成自己的域名
export const wsUrl= 'ws://localhost:8080' 
const request = (urlType= '', url = '', type = '', data = {}, header = {
}) => {
	var that = this
	if(JSON.stringify(header)=='{}'){
		header={
			'Content-type': 'application/json',
			// 'token': uni.getStorageSync('token')			
		}
	}
    return new Promise((resolve, reject) => {
        uni.request({
            method: type,
            url: baseURL + url,
            data: data,
            header: header,
            dataType: 'json'         
        }).then((response) => {
			console.log(response)
			// uni.hideLoading();
			if (response[1].data.code != 0) {
				uni.showToast({
				    title: response[1].data.message,
					icon: 'error',
				    duration: 2000
				});
				let [error, res] = response;
				resolve(res.data);
			} else if (response[1].data.code == 2) {
				uni.showToast({
				    title: '请先登录',
					icon: 'error',
				    duration: 2000,
					success: () => {
					}
				});
			} else {
				let [error, res] = response;
				resolve(res.data);
			}
        }).catch(error => {
            let [err, res] = error;
            reject(err)
			console.log(error[1].data)
			uni.showToast({
			    title: error,
				icon: 'none',
			    duration: 2000
			});
        })
    });
	
}
export default request

