// if (!requestScreenCapture()) {
//     toast("请求截图失败");
//     exit();
// }

// var img = captureScreen();
// images.saveImage(img, "/sdcard/hhmfile/道具10.png");
var img1 = images.read("/sdcard/hhmfile/道具6.png");
var img2 = images.read("/sdcard/hhmfile/道具9.png");
var imgClip1 = images.clip(img1, 785, 865, 80, 45);
var imgClip2 = images.clip(img2, 785, 865, 80, 45);
images.saveImage(imgClip1, "/sdcard/hhmfile/imgClip1.png");
images.saveImage(imgClip2, "/sdcard/hhmfile/imgClip2.png");
log("一,二:"+images.getSimilarity(imgClip1, imgClip2, {
    "type": "PNSR"
}));

// //图片相似度比较
// var img1 = images.read("/sdcard/hhmfile/clip1050-655.png");
// var img2 = images.read("/sdcard/hhmfile/clip1050-655.png");
// log(images.getSimilarity(img1, img2, {
//     "type": "PNSR"//MSSIM
// }));
img1.recycle();
img2.recycle();
imgClip1.recycle();
imgClip2.recycle();
log("finsh;");