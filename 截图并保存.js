// if (!requestScreenCapture()) {
//     toast("请求截图失败");
//     exit();
// }

// var img = captureScreen();
//images.saveImage(img, "/sdcard/hhmfile/物品栏3.png");

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
for (var m = 0; m < 5; m++) {
    for (var n = 0; n < 4; n++) {
        click(x_touch,y_touch);
        log("x:"+x_touch+";"+"y:"+y_touch);
        sleep(500);
        y_touch+=130;
    }
    y_touch = y + 65;
    x_touch+=130;
}

// //图片相似度比较
// var img1 = images.read("/sdcard/hhmfile/clip1050-655.png");
// var img2 = images.read("/sdcard/hhmfile/clip1050-655.png");
// log(images.getSimilarity(img1, img2, {
//     "type": "PNSR"
// }));
// img1.recycle();
// img2.recycle();

log("finsh;");