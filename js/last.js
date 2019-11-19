$(function () {
    let openid = "{$userinfo['openid']}";
    console.log(openid);
    let min=0;
    let sec=0;
    let ms=0;
    let timer=null;
    let minText='';//分钟数
    let secText='';//秒数
    let msText='';//毫秒数
    let isShare=false;//是否需要分享
    let canWinStatus=1;//1表示可以中奖，2表示不能中奖，3表示已经获奖
    let realyScore='';//用户获得的成绩
    let winScoreStart;//中奖最小区间
    let winScoreEnd;//中奖最大区间
    let isWinner=0;//1表示中奖，0表示未中奖
    let orderId='';//订单号如果有订单就可以填写地址
    let playNum=1;//1表示可以继续玩，2表示次数到上限了
    let nickName=['A  萌宝妈','AAA刂龍爺','AAA*勇往直前*','白酒瘾','白衣煮茶（熊熊）','~つ棒棒糖甜到忧伤','宝g-','宝贤阁_贤','Beatrice','卞心砚','别惹我','不会哭的Zero','不瘦到130不改网名','不同的美少女🍭','不再三岁了','灿若星辰','宠Ta吧          ฅ','刺青师~丹秀','Crazy for you','Daisy77799','大柳树','大楠²⁰¹⁹','都说我萌萌哒','欠我江山，总要归还','飞翔的斑马','奋斗'];
    let goodsList=['获得华为P30一台','获得精品中和月饼一盒','获得中秋育儿大礼包一份','获得中秋育儿大礼包一份','获得中秋育儿大礼包一份','获得中秋育儿大礼包一份','获得精品中和月饼一盒','获得中秋育儿大礼包一份','获得中秋育儿大礼包一份'];
    let newNickName=[];
    let str='';
    let list =nickName.sort(randomsort);
    for(let i=0;i<10;i++){
        newNickName.push(list[i])
    }
    //<span class="b-num">天,gundongList</span>
    for(let i=0;i<newNickName.length;i++){

        newNickName[i]=newNickName[i].substr(0,1)+'****'+newNickName[i].substr(-1, 1);


    }
    for(let i=0;i<newNickName.length;i++){
        str+='<span class="b-num">'+newNickName[i]+'   '+goodsList[i]+'</span><span></span>';
    }

    $(".gundongList").append(str);
    console.log(newNickName);
    function randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1; //通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
    }

    //查看用户是否能中奖
    checkUserQualification();//查看用户是否能中奖
    function checkUserQualification(){
        $.ajax({
            url: '/WinsMS/maldcheck',
            type: 'get',
            data: {
                openid:openid,
            },
            dataType: 'json',
            async: false,
            success: function (res) {
                console.log(res);
                if(res.code==1001){
                    canWinStatus=res.canwinstatus;//1表示可以中奖，2表示不能中奖，3表示已经获奖
                    winScoreStart=10-(res.winnin_time_interval/2);
                    winScoreEnd=10+(res.winnin_time_interval/2);
                }else if(res.code==1004){
                    playNum=2;//次数已到上限
                    /* $(".shareBox").css('display','flex');
                     $(".shareBox .share_bg").addClass('active');
                     $(".shareBox .share_icon").hide();*/
                }
                if(res.code==1005){
                    isShare=true;//需要分享获得次数
                }else{
                    isShare=false;
                }
            }
        });
    };

    //开始计时
    $('.startBtn').click(function(){
        checkUserQualification();//查看用户是否能中奖
        reset();//把时间清0
        if(playNum==2){
            //已到上限不能分享了
            $(".shareBox").css('display','flex');
            $(".shareBox .share_bg").addClass('active');
            $(".shareBox .share_icon").hide();
            $('.shareBox').click(function () {
                window.location.href="https://www.win-east.cn/WinsMS/maldview";
            });
            return;
        }
        if(isShare){
            //如果isShare为true的话，就是需要分享才能再继续玩儿
            $('.shareBox').css('display','flex');//分享弹窗显示
            $(".maskBox").hide();//中没中奖弹窗隐藏
            reset();//把时间清0
            return;
        }
        if(!$(this).hasClass('stop')){
            $(this).addClass('stop');
            $(this).removeClass('one_more');
            clearInterval(timer);
            timer=setInterval(show,10);
        }else{
            $(this).removeClass('stop');
            $(this).addClass('one_more');
            clearInterval(timer);
            console.log('分钟数'+minText);
            console.log('秒数'+secText);
            console.log('毫秒数'+msText);
            let minArr=minText.toString().split('');
            let secArr=secText.toString().split('');
            let msArr=msText.toString().split('');
            realyScore=Number(minText+secText).toString()+'.'+msText;
            console.log(realyScore);
            console.log('最小区间',winScoreStart);
            console.log('最大区间',winScoreEnd);
            if(canWinStatus==1){
                if(realyScore>=winScoreStart&&realyScore<=winScoreEnd){
                    console.log('中奖');
                    $(".loadingBox").css('display','flex');
                    isWinner=1;
                    let formData = new FormData();
                    formData.append('openid', openid)
                    formData.append('score', realyScore);//分数
                    formData.append('iswinner', isWinner);//是否中奖
                    $.ajax({
                        url: '/WinsMS/maldlog',
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        async: false,
                        success: function (res) {
                            console.log(res);
                            if(res.code==1001){
                                $(".loadingBox").css('display','none');
                                orderId=res.orderid;
                                $(".maskBox").css('display','flex');
                                $(".maskBox .closeBtn").hide();
                                $(".maskBox .img").removeClass('active');
                                $(".maskBox .addressBtn").removeClass('active');
                                //如果分钟为0时不显示分钟数
                                if(minArr[0]==0&&minArr[1]==0){
                                    $(".showtime .min1").hide();
                                    $(".showtime .min2").hide();
                                    $(".showtime .s_bg1").hide();
                                }else{
                                    $(".showtime .s_bg1").show();
                                    $(".showtime .min1").html(minArr[0]);
                                    $(".showtime .min2").html(minArr[1]);
                                }
                                $(".showtime .sec1").html('1');
                                $(".showtime .sec2").html('0');
                                $(".showtime .ms1").html('0');
                                $(".showtime .ms2").html('0');
                            }else {
                                console.log('身份验证失败')
                                alert(res.msg);
                            }
                        }
                    });
                }else{
                    console.log('未中奖')
                    $(".maskBox").css('display','flex');
                    $(".maskBox .img").addClass('active');
                    $(".maskBox .addressBtn").addClass('active');
                    isWinner=0;
                    isWinFun();//是否中奖
                    //如果分钟为0时不显示分钟数
                    if(minArr[0]==0&&minArr[1]==0){
                        $(".showtime .min1").hide();
                        $(".showtime .min2").hide();
                        $(".showtime .s_bg1").hide();
                    }else{
                        $(".showtime .s_bg1").show();
                        $(".showtime .min1").html(minArr[0]);
                        $(".showtime .min2").html(minArr[1]);
                    }
                    $(".showtime .sec1").html(secArr[0]);
                    $(".showtime .sec2").html(secArr[1]);
                    $(".showtime .ms1").html(msArr[0]);
                    $(".showtime .ms2").html(msArr[1]);
                }

            }else{
                isWinFun();//是否中奖
                if(realyScore=='10.00'){
                    console.log('中奖');
                    //如果分钟为0时不显示分钟数
                    if(minArr[0]==0&&minArr[1]==0){
                        $(".showtime .min1").hide();
                        $(".showtime .min2").hide();
                        $(".showtime .s_bg1").hide();
                    }else{
                        $(".showtime .s_bg1").show();
                        $(".showtime .min1").html(minArr[0]);
                        $(".showtime .min2").html(minArr[1]);
                    }
                    $(".showtime .s_min1").html(minArr[0]);
                    $(".showtime .s_min2").html(minArr[1]);
                    $(".showtime .sec1").html(secArr[0]);
                    $(".showtime .sec2").html(secArr[1]);
                    $(".showtime .ms1").html(msArr[0]);
                    $(".showtime .ms2").html(2);
                    //如果没有中奖资格，用户又拍到10.00，就把10.00显示成10.02为未中奖（显示未中奖弹窗）
                    $(".maskBox").css('display','flex');
                    $(".maskBox .img").addClass('active');
                    $(".maskBox .addressBtn").addClass('active');
                }else{
                    console.log('未中奖')
                    $(".maskBox").css('display','flex');
                    $(".maskBox .img").addClass('active');
                    $(".maskBox .addressBtn").addClass('active');
                    if(minArr[0]==0&&minArr[1]==0){
                        $(".showtime .min1").hide();
                        $(".showtime .min2").hide();
                        $(".showtime .s_bg1").hide();
                    }else{
                        $(".showtime .s_bg1").show();
                        $(".showtime .min1").html(minArr[0]);
                        $(".showtime .min2").html(minArr[1]);
                    }
                    $(".showtime .s_min1").html(minArr[0]);
                    $(".showtime .s_min2").html(minArr[1]);
                    $(".showtime .sec1").html(secArr[0]);
                    $(".showtime .sec2").html(secArr[1]);
                    $(".showtime .ms1").html(msArr[0]);
                    $(".showtime .ms2").html(msArr[1]);
                }

            }


        }
    });
    //判断是否中奖
    function isWinFun() {
        let formData = new FormData();
        formData.append('openid', openid)
        formData.append('score', realyScore);//分数
        formData.append('iswinner', isWinner);//是否中奖
        $.ajax({
            url: '/WinsMS/maldlog',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            async: false,
            success: function (res) {
                console.log(res);
                if(res.code==1001){
                    orderId=res.orderid;
                }else {
                    console.log('身份验证失败')
                    alert(res.msg);
                }
            }
        });
    }
    //生成时间
    function show(){
        ms++;
        if(sec==60){
            min++;sec=0;
        }
        if(ms==100){
            sec++;ms=0;
        }
        let msStr=ms;
        if(ms<10){
            msStr="0"+ms;
        }
        let secStr=sec;
        if(sec<10){
            secStr="0"+sec;
        }
        let minStr=min;
        if(min<10){
            minStr="0"+min;
        }
        minText=minStr;//分钟数
        secText=secStr;//秒数
        msText=msStr;//毫秒数
        let minArr=minStr.toString().split('');
        let secArr=secStr.toString().split('');
        let msArr=msStr.toString().split('');
        $(".showtime .s_min1").html(minArr[0]);
        $(".showtime .s_min2").html(minArr[1]);
        $(".showtime .min1").html(minArr[0]);
        $(".showtime .min2").html(minArr[1]);
        $(".showtime .sec1").html(secArr[0]);
        $(".showtime .sec2").html(secArr[1]);
        $(".showtime .ms1").html(msArr[0]);
        $(".showtime .ms2").html(msArr[1]);
        /*$('#showtime span:eq(0)').html(minStr);
        $('#showtime span:eq(2)').html(secStr);
        $('#showtime span:eq(4)').html(msStr);*/
    };

    //再拍一次
    $('.addressBtn').click(function () {
        if($(this).hasClass('active')){
            $(".maskBox").hide();//未中奖弹窗隐藏
        }else{
            $(".maskBox").hide();//中奖弹窗隐藏
            $(".addressBox").css('display','flex');
        }

    });
    //活动说明
    $(".tiShi").click(function () {
        $(".explainBox").css('display','flex');
    });
    //关闭弹窗
    $(".closeBtn").click(function () {
        $(".explainBox").hide();
        $(".maskBox").hide();
    });
    $(".explainBox").click(function () {
        $(".explainBox").hide();
    });
    //点击遮罩弹窗隐藏
    $(".picker-mask").click(function () {
        $(".picker").hide();

    })
    //添加地址
    $(".addBtn").click(function () {
        console.log($('#myAddrs').val())
        let addArr=$('#myAddrs').val().split(' ');
        console.log(addArr)
        let formData = new FormData();
        formData.append('orderid', orderId);
        formData.append('nickname', $("#nameVal").val());//test
        formData.append('phonenumber', $("#telNum").val());//test
        formData.append('address', $("#address").val());//test
        formData.append('city',addArr[1]);//test
        formData.append('province', addArr[0]);//test
        formData.append('country', "中国");//test
        $.ajax({
            url: '/WinsMS/maldaddress',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            async: false,
            success: function (res) {
                console.log(res);
                if(res.code==1001){
                    $(".mBox").css('display','flex');
                    setTimeout(function () {
                        window.location.href="https://www.win-east.cn/WinsMS/maldview";
                        //提交地址成功后回首页
                    },1500);
                }
            }
        });
    });


    function reset(){
        min=0;//把分钟清0
        sec=0;//把秒钟清0
        ms=0;//把毫秒清0
        $(".showtime .min1").show();
        $(".showtime .min2").show();
        $(".showtime .s_bg1").show();
        $(".showtime .min1").html(0);
        $(".showtime .min2").html(0);
        $(".showtime .sec1").html(0);
        $(".showtime .sec2").html(0);
        $(".showtime .ms1").html(0);
        $(".showtime .ms2").html(0);
    }


});
