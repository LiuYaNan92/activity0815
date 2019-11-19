let appId=localStorage.getItem('appid');
let timestamp= localStorage.getItem('timestamp');
let nonceStr=localStorage.getItem('nonceStr');
let signature=localStorage.getItem('signature');
wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp:timestamp, // 必填，生成签名的时间戳
    nonceStr:nonceStr, // 必填，生成签名的随机串
    signature:signature,// 必填，签名，见附录1
    jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'closeWindow',
        'hideAllNonBaseMenuItem',
        'chooseWXPay'
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function () {
    //分享朋友圈
    wx.onMenuShareTimeline({
        title: '六一模拟考', // 分享标题
        link: location.href.split('#')[0], // 分享链接,将当前登录用户转为puid,以便于发展下线
        imgUrl: 'https://www.win-east.cn/WinsMS/application/webapi/view/child/images/share.jpg', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            // alert('分享成功');
            let formData = new FormData();
            formData.append('openid', openid);
            $.ajax({
                url: '/WinsMS/maldshare',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                async: false,
                success: function (res) {
                    console.log(res);
                    if(res.code==1001){
                        checkUserQualification();//查看用户是否能中奖
                        $(".shareBox").css('display','none');
                        $(".shareBox .share_bg").removeClass("active");
                        $(".shareBox .share_icon").show();
                    }
                }
            })
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享朋友
    wx.onMenuShareAppMessage({
        title: '六一模拟考', // 分享标题
        desc: '这些童年的“知识点”，你还记得吗？', // 分享描述
        link: '', // 分享链接
        imgUrl: 'https://www.win-east.cn/WinsMS/application/webapi/view/child/images/share.jpg', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            // alert('分享成功')
            let formData = new FormData();
            formData.append('openid', openid);
            $.ajax({
                url: '/WinsMS/maldshare',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                dataType: 'json',
                async: false,
                success: function (res) {
                    console.log(res);
                    if(res.code==1001){
                        checkUserQualification();//查看用户是否能中奖
                        alert('分享成功');
                        alert(isShare)
                        $(".shareBox").css('display','none');
                        $(".shareBox .share_bg").removeClass("active");
                        $(".shareBox .share_icon").show();
                    }
                }
            })
        },
        cancel: function () {
            //alert('分享取消')
            // 用户取消分享后执行的回调函数
        }
    });
    wx.error(function(res){
        alert(JSON.stringify(res))
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert("errorMSG:"+res);
    });

});
