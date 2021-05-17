auto.waitFor();
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
    // var img = captureScreen();
    // var iconForjudge1 = images.clip(img, 566,754, 795-566,807-754);
    // var iconForjudge2 = images.clip(img, 1257,171, 1493-1257,259-171);
    // images.saveImage(img, "/sdcard/hhmfile/PT-传送2.png");
    // images.saveImage(iconForjudge2, "/sdcard/hhmfile/button-on-行囊2.png");
        // src = images.read("/sdcard/hhmfile/长安坐标.png");
        // clip = images.clip(src, 1780,74, 1827-1780,121-74);
        // images.saveImage(clip, "/sdcard/hhmfile/forjudge/mapKeyborad/close.png");
        // src.recycle();
        // clip.recycle();
    // var logOcr= Baidu_ocr(src);
    // log(logOcr);
    // var wordResult=logOcr.words_result;
    // var count=0;
    // wordResult.forEach(element => {
    //     count++;
    //     log(count+":"+element.words);
    // });
    // iconForjudge1.recycle();
    // iconForjudge2.recycle();
    // img.recycle();
    log("end");
}



function compare() {
    src = images.read("/sdcard/hhmfile/摊位宝图识别.png");
    img1 = images.clip(src, 575, 308, 91, 80);
    img2 = images.clip(src, 1069, 308, 91, 80);
    sleep(1000);
    images.saveImage(img1, "/sdcard/hhmfile/forjudge/摊位宝图1-1.png");
    sleep(1000);
    images.saveImage(img2, "/sdcard/hhmfile/forjudge/摊位宝图1-2.png");
    sleep(1000);
    images.saveImage(img1, "/sdcard/hhmfile/forjudge/摊位宝图1-3.png");
    sleep(1000);
    log(images.getSimilarity(img1, img2, {
        "type": "MSSIM"
    }));
    src.recycle();
    img1.recycle();
    img2.recycle();
}
function findIndex(number_X,number_Y) {
    //打开小地图
    //点击X输入框
    src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/x-input.png");
    var p = findImage(captureScreen(), src);
    log(p);
    //分解
    str = number_X.toString();
    for (var i=0; i<str.length; i++) {
        //确认键
        if (i == str.length-1) {

        }
    }
    src.recycle();
}
function keyboard(nubmer) {
    switch (nubmer) {
        case 1:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 2:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 3:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 4:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 5:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 6:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 7:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 8:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 9:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 0:
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/1-numberButton.png");
            break;
        case 255://确认
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/确定-Button.png");
            break;
        case 254://前往
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/前往-button.png");
            break;
        case 253://x坐标
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/x-input.png");
            break;
        case 252://y坐标
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/y-input.png");
            break;
        case 251://close
            src = images.read("/sdcard/hhmfile/forjudge/mapKeyborad/close.png");
            break;
    }
    var p = findImage(captureScreen(), src);
    click()
}
// compare();
screencapture();
findIndex(111,211);
log("finsh;");