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
    sleep(5000);
    var img = captureScreen();
    // var iconForjudge = images.clip(img, 1050, 400, 125, 125);
    images.saveImage(img, "/sdcard/hhmfile/更多摊位2.png");
    // iconForjudge.recycle();
    img.recycle();
}
screencapture();
log("finsh;");