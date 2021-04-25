//调用百度文字识别ocr得到当前手机截屏文字
function Baidu_ocr(imgFile){
    log("调用百度ocr开始识图");
    // var imag64 = images.toBase64(imgFile);//转换截屏图片
    var imag64 = images.toBase64(imgFile, "png", 100);//转换截屏图片
    //log(imag64.string());
    //该APIKey和Secret为"这是谁的爽歪歪"所有
    var API_Key="BQO1kCyXefpCt3RW2YXj1Bzf";
    var Secret_Key="haLVFkP3HWe1LULSO1ihZGdaTRw15mAY";
    //access_token获取地址。
    var getTokenUrl="https://aip.baidubce.com/oauth/2.0/token";
    var token_Res = http.post(getTokenUrl, {
        grant_type: "client_credentials",
        client_id: API_Key,
        client_secret: Secret_Key,
    });
    log("调用百度ocr开始识图");
    var access_token=token_Res.body.json().access_token;
    //通用文字识别，50000次/天免费
    var ocrUrl = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
    var ocr_Res = http.post(ocrUrl, {
        headers: {
            "Content - Type": "application/x-www-form-urlencoded"
        },
        access_token: access_token,
        image: imag64,
        language_type:"CHN_ENG"
    });
    var json = ocr_Res.body.json();
    //log(json);
    return json;
}

// var logOcr= Baidu_ocr(imgClip);
// log(logOcr);
// var wordResult=logOcr.words_result;
// var count=0;
// wordResult.forEach(element => {
//     count++;
//     log(count+":"+element.words);
// });


var flag = 1;
function screencapture(){
    if (flag) {
        if (!requestScreenCapture()) {
            toast("请求截图失败");
            exit();
        } else {
            flag = 0;
        }
    }
    var img = captureScreen();
    images.saveImage(img, "/sdcard/hhmfile/飞行符open2"+".png");
    // var imgClip = images.clip(img, 440, 266, 518, 632);
    // var logOcr= Baidu_ocr(imgClip);
    // log(logOcr);
    // var wordResult=logOcr.words_result;
    // var count=0;
    // wordResult.forEach(element => {
    //     count++;
    //     log(count+":"+element.words);
    // });
    
    // images.saveImage(img, "/sdcard/hhmfile/物品栏"+x+"-"+y+".png");
    // imgClip.recycle();
    img.recycle();
}

// //拆分20个道具栏
// var src = images.read("/sdcard/hhmfile/物品栏3.png");
var x = 1050;
var y = 265;
// for (var i = x; i < 1700; i = i + 130 ) {
//     for (var j = y; j < 785; j+=130 ) {
//         var imgClip = images.clip(src, Number(i), Number(j), 130, 130);
//         log(i+"-"+j);
//         images.saveImage(imgClip, "/sdcard/hhmfile/clip"+i+"-"+j+".png");
//         // imgClip.recycle();
//     }
// }

// src.recycle();

var x_touch = x + 65;
var y_touch = y + 65;
function myFunction()
{
    for (var m = 0; m < 5; m++) {
        for (var n = 0; n < 4; n++) {
            click(x_touch,y_touch);
            log("x:"+x_touch+";"+"y:"+y_touch);
            sleep(500);
            screencapture(m,n);
            sleep(500);
            y_touch+=130;
        }
        y_touch = y + 65;
        x_touch+=130;
    }
}
// sleep(20000);
// myFunction();
screencapture();
// //图片相似度比较
// var img1 = images.read("/sdcard/hhmfile/clip1050-655.png");
// var img2 = images.read("/sdcard/hhmfile/clip1050-655.png");
// log(images.getSimilarity(img1, img2, {
//     "type": "PNSR"
// }));
// img1.recycle();
// img2.recycle();

log("finsh;");