/**
 *   请求屏幕截图的单例类 begin
 */
var InstanceRequestScreenCapture = function ScreenCapture() {
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    }

};

var RequestScreenCap = (function () { // 匿名自执行函数
    var instance; // 声明一个instance对象
    return function () {
        if (instance) { // 如果已存在 则返回instance
            return instance;
        }
        instance = new InstanceRequestScreenCapture() // 如果不存在 则new一个HeadClass对象
        return instance;
    }
})();
/**
 *   请求屏幕截图的单例类 end
 */

/**
 *   背包道具框类定义 begin
 *      mapTypeEnum     道具的类型：无道具，藏宝图，其它道具
 *      PlaceEnum       地点的类型
 *      axisX           宝图x坐标
 *      axisY           宝图y坐标
 *      position        宝图在背包中的坐标0-19
 */
var mapTypeEnum = {
    Empty: 1,
    TreasureMap: 2,
    Props: 3,
  };

  var PlaceEnum = {
    JY: 1,          //建邺城
    DHW: 2,         //东海湾
    JN: 3,          //江南野外
    AL:4,           //傲来国
    NE:5,           //女儿村
    HG:6,           //花果山
    DTGJ:7,         //大唐国境
    PT:8,           //普陀山
    CSJW:9,         //长寿郊外
    BJ:10,          //北俱芦洲
    ZZ:11,          //朱紫国
    STL:12,         //狮驼岭
    MJ:13,          //墨家村
    WZ:14,          //五庄观
    DTJW:15,        //大唐境外
    QLS:16,         //麒麟山
  };

function popr(mapTypeEnum,PlaceEnum,axisX,axisY,position)
{
    this.type=mapTypeEnum;
    this.PlaceEnum=PlaceEnum;
    this.axisX=axisX;
    this.axisY=axisY;
    this.Postion = position;

    this.changeName=changeName;
    function changeName(name)
    {
        this.lastname=name;
    }
}
/**
 *   背包道具框类定义 end
 */

//遍历道具栏
var x = 1050;
var y = 265;
var x_touch = x + 65;
var y_touch = y + 65;
var arrayX = [1050,1050+65,1050+65*2,1050+65*3,1050+65*4];
var arrayY = [265,265+65,265+65*2,265+65*3,265+65*4];
var items = new Array();
function myFunction()
{
    index = 0;
    for (var m = 0; m < 5; m++) {
        for (var n = 0; n < 4; n++) {
            click(x_touch,y_touch);
            // log("x:"+x_touch+";"+"y:"+y_touch);
            sleep(500);
            screencapture(m,n,index);
            sleep(500);
            y_touch+=130;
            index++;
        }
        y_touch = y + 65;
        x_touch+=130;
    }
}

var instanceRequestScreenCap = new RequestScreenCap();// 请求屏幕截图权限
log("begin");
var imgScreen = captureScreen();//请求截取当前屏幕，captureScreen可以不回收；
images.saveImage(imgScreen, "/sdcard/hhmfile/开屏界面"+".png");
//如果有签到栏关闭签到栏 
// click(1799,73);//签到栏关闭坐标
// click(2013,1013);//打开道具
myFunction();
for (var array_i = 0; array_i < items.length; array_i++) {
    log("w:"+items[array_i].mapTypeEnum);
    if (items[array_i].mapTypeEnum == mapTypeEnum.TreasureMap) {
        log(array_i+":是宝图");
    }
}
// var logOcr= Baidu_ocr(imgScreen);
// log(logOcr);
// var test = new Position(mapTypeEnum.Empty,PlaceEnum.JY,11,2);
// var storage = storages.create("hhm:localStorage");
// storage.put("positionA", test);
// storage.put("positionB", 666);
// log("positionA = "+ storage.get("positionA").Postion);
// storage.clear();

//点开道具栏
log("end");

//截图并调用识图
function screencapture(x,y,index){
    var img = captureScreen();
    var imgClip = images.clip(img, 440, 266, 518, 632);
    var logOcr= Baidu_ocr(imgClip);
    imgClip.recycle();

    var wordResult=logOcr.words_result;
    var count=0;
    var mapTypeEnum0 = mapTypeEnum.Empty;
    var PlaceEnum0 = PlaceEnum.QLS;
    var axisX = 0;
    var axisY = 0;
    var position = 0;
    log("************"+index+"************");
    wordResult.forEach(element => {
        count++;
        if(count == 1) {    //第一行词条
            if (element.words == "藏宝图") {
                mapTypeEnum0 = mapTypeEnum.TreasureMap;
            } else {
                mapTypeEnum0 = mapTypeEnum.Props;
            }
        } else if 
        // if ((count == 1) && (element.words == "藏宝图")) {
        //     mapTypeEnum0 = mapTypeEnum.TreasureMap;
        //     log("是宝图");
        // } else if ((count == 1) && (element.words == "飞行符")) {
        //     log("是飞行符");
        //     mapTypeEnum0 = mapTypeEnum.Empty;
        // } else if (count == 1) {
        //     mapTypeEnum0 = mapTypeEnum.Empty;
        // }
         ((count == 4) && (mapTypeEnum0 == mapTypeEnum.TreasureMap)) {
            if(element.words.match("建邺城")) {
                PlaceEnum0 = PlaceEnum.JY;
                log ("是建邺城的宝图");
            } else if (element.words.match("东海湾")){
                PlaceEnum0 = PlaceEnum.DHW;
                log ("是东海湾的宝图");
            } else if (element.words.match("江南野外")){
                PlaceEnum0 = PlaceEnum.JN;
                log ("是江南野外的宝图");                
            } else if (element.words.match("傲来国")){
                PlaceEnum0 = PlaceEnum.AL;
                log ("是傲来国的宝图");
            } else if (element.words.match("女儿村")){
                PlaceEnum0 = PlaceEnum.NE;
                log ("是女儿村的宝图");
            } else if (element.words.match("花果山")){
                PlaceEnum0 = PlaceEnum.HG;
                log ("是花果山的宝图");
            } else if (element.words.match("大唐国境")){
                PlaceEnum0 = PlaceEnum.DTJW;
                log ("是大唐国境的宝图");
            } else if (element.words.match("长寿郊外")){
                PlaceEnum0 = PlaceEnum.DTGJ;
                log ("是长寿郊外的宝图");
            } else if (element.words.match("北俱芦洲")){
                PlaceEnum0 = PlaceEnum.BJ;
                log ("是北俱芦洲的宝图");
            } else if (element.words.match("朱紫国")){
                PlaceEnum0 = PlaceEnum.ZZ;
                log ("是朱紫国的宝图");
            } else if (element.words.match("狮驼岭")){
                PlaceEnum0 = PlaceEnum.STL;
                log ("是狮驼岭的宝图");
            } else if (element.words.match("墨家村")){
                PlaceEnum0 = PlaceEnum.MJ;
                log ("是墨家村的宝图");
            } else if (element.words.match("五庄观")){
                PlaceEnum0 = PlaceEnum.WZ;
                log ("是五庄观的宝图");
            } else if (element.words.match("大唐境外")){
                PlaceEnum0 = PlaceEnum.DTJW;
                log ("是大唐境外的宝图");
            } else if (element.words.match("麒麟山")){
                PlaceEnum0 = PlaceEnum.QLS;
                log ("是麒麟山的宝图");
            }
            if ((mapTypeEnum0 == mapTypeEnum.TreasureMap)) {
                var front = element.words.indexOf("(");
                var mid = element.words.indexOf(",");
                var raer = element.words.indexOf(")");
                log("yuan:"+element.words);
                log("front:"+front+";mid:"+mid+";raer:"+raer+";");
                log("坐标：("+element.words.slice(front+1,mid)+","+element.words.slice(mid+1,raer)+")")
                switch(element.words){
                    case("1"):
                        ;
                    break;
                }
            }
        }
        // log(count+":"+element.words); //百度ocrlog
    });
    var temp = new popr(mapTypeEnum0,PlaceEnum0,axisX,axisY,position);//popr(mapTypeEnum,PlaceEnum,axisX,axisY,position)
    log("push:"+temp.mapTypeEnum0);
    items.push(temp);
    images.saveImage(img, "/sdcard/hhmfile/物品栏"+index+".png");
    // images.recycle();
    img.recycle();
}

//调用百度文字识别ocr得到当前手机截屏文字
function Baidu_ocr(imgFile){
    // log("调用百度ocr开始识图");
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