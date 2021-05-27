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
    if (json.error_code) {
        log("error["+json.error_code+"]:"+json.error_msg);
    }
    return json;
}
//截图并调用识图
function screencapture(){
    var img = captureScreen();
    var imgClip = images.clip(img, 440, 266, 518, 632);
    var logOcr= Baidu_ocr(imgClip);
    var wordResult=logOcr.words_result;
    wordResult.forEach(element => {
    log(element.words); //百度ocrlog
    });
    images.saveImage(img, "/sdcard/脚本/test/物品栏.png");
    imgClip.recycle();
    img.recycle();
}

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
Ca:17,          //长安
Ca_hotel:18,    //长安酒店
Ca_cargo:19,    //长安杂货店
Cs:20,          //长寿
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
var click_index = floaty.window(
    <frame gravity="center">
        {/* 中心图标 */}
        <img
        w="10" h="10"
        id="index" 
        src="file:///sdcard/hhmfile/icon/圆点.png"
        />
    </frame>
);
click_index.setPosition(10,1050);
var window = floaty.window(
    <horizontal>
        {/* 中心图标 */}
        <img
        w="30" h="30"
        margin = "5"
        circle = "true"
        alpha = "0.5"
        id="action" 
        src="file:///sdcard/hhmfile/icon/开始.png"
        />
        {/* 自动/手动 */}
        <img
        w="30" h="30"
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="auto" 
        src="file:///sdcard/hhmfile/icon/自动.png"
        />
        {/* 买图 */}
        <img
        w="30" h="30"
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="purchase" 
        src="file:///sdcard/hhmfile/icon/买.png"
        />
        {/* 分类 */}
        <img
        w="30" h="30"
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="sort" 
        src="file:///sdcard/hhmfile/icon/排序.png"
        />
        {/* 挖图 */}
        <img
        w="30" h="30"
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="dig" 
        src="file:///sdcard/hhmfile/icon/铲子.png"
        />
        {/* 停止 */}
        <img
        w="30" h="30"
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="exit" 
        src="file:///sdcard/hhmfile/icon/退出.png"
        />
    </horizontal>
);
window.setPosition(216,980);
var execution = null;
//记录按键被按下时的触摸坐标
var x = 0,
y = 0;
//记录按键被按下时的悬浮窗位置
var windowX, windowY;
//记录按键被按下的时间以便判断长按等动作
var downTime;
window.action.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            //如果按下的时间超过1.5秒判断为长按，退出脚本
            if (new Date().getTime() - downTime > 1500) {
                // exit();
            }
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                action_onClick();
            }
            return true;
    }
    return true;
});

var stateType = {
    Init: 1,
    Start: 2,
    Purchase: 3,
    Sort: 4,
    Dig: 5,
    Stop: 6,
    Exit: 7,
  };
var workModeType = {
    Auto: 1,
    manual: 2,
};

var State = stateType.Stop;
var workMode = workModeType.manual;
threads.start(function stateMachine() {
    while(1) {
        switch (State) {
            case stateType.Init:
                // toastLog("in Init");
                Init();
                break;
            case stateType.Start:
                Start();
                break;
            case stateType.Purchase:
                Purchase();
                break;
            case stateType.Sort:
                Sort();
                break;
            case stateType.Dig:
                Dig();
                break;
            case stateType.Stop:
                break;            
            case stateType.Exit:
                exit();
                break;
            default:
                toastLog("error");
                sleep(10000);
                exit();
                break;
        }
    }
});
var stopFlag = 0;
threads.start(function stopThread() {
    while(1) {
        if (stopFlag) {
            exit();
        }
    }
});
/**
 * 图标旋转的代码
 * 注：该定时器会被ui线程阻塞
 */
// var ro = 0;
// var id = setInterval(function(){
//     window.auto.attr("rotation",ro+=2);
//     if (ro == 360) ro = 0;
// }, 30);

/**
 * 显示点击位置
 * 加了随机延时
 */
function click_andshow(x,y,doubleClick) {
    doubleClick = typeof doubleClick !== 'undefined' ?  doubleClick : 0;
    click(x,y);
    click_index.setPosition(x,y);
    //这个延时为了显示的
    if (doubleClick) {
        sleep(random(80,100));
    } else {
        sleep(random(1300,200));
    }
    //悬浮窗会遮挡点击
    click_index.setPosition(16,950);
    if (doubleClick) {
        sleep(random(80,100));
    } else {
        sleep(random(130,200));
    }
    
}

/**
 * 查询背包空余位置
 * 
 */
function countEmpty_Bag() {
    var img0 = captureScreen();
    var packageX = 1048;
    var packageY = 270;
    var countEmpty = 0;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            var clip0 = images.clip(img0, packageX, packageY, 128, 128);
            var src = images.read("/sdcard/hhmfile/forjudge/package/"+i+"-"+j+".png");
            // images.saveImage(clip0, "/sdcard/hhmfile/forjudge/package/"+i+"-"+j+".png");
            compareResult = images.getSimilarity(clip0, src, {
                "type": "MSSIM"
            });
            if (compareResult > 2.8 && compareResult < 3) {
                countEmpty++;
            }
            clip0.recycle();
            src.recycle();
            packageY+=131;
        }
        packageY = 270;
        packageX+=131;
        if (i==1) {
            packageX++;
        }
    }
    return countEmpty;
}

/**
 * 查询仓库空余位置Repository
 * 
 */
var countEmpty_Rep_min = 20;
function countEmpty_Rep() {
    var img0 = captureScreen();
    var packageX = 383;
    var packageY = 313;
    var countEmpty = 0;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            var clip0 = images.clip(img0, packageX, packageY, 127, 127);
            var src = images.read("/sdcard/hhmfile/forjudge/repEmpty/"+i+"-"+j+".png");
            // images.saveImage(clip0, "/sdcard/hhmfile/forjudge/repEmpty/"+i+"-"+j+".png");
            compareResult = images.getSimilarity(clip0, src, {
                "type": "MSSIM"
            });
            if (compareResult > 2.8 && compareResult < 3) {
                countEmpty++;
            }
            clip0.recycle();
            src.recycle();
            packageY+=131;
        }
        packageY = 313;
        packageX+=131;
    }
    return countEmpty;
}

/**
 * 在仓库整背包
 * 
 */
function bagCleanRep() {
    
    var packageX = 1088;
    var packageY = 313;
    for (var i = 0; i < 5; i++) {//i是列
        for (var j = 0; j < 4; j++) {//j是行
            var img0 = captureScreen();
            var clip0 = images.clip(img0, packageX, packageY+39, 127, 127-39);
            var src = images.read("/sdcard/hhmfile/forjudge/repBag/"+i+"-"+j+".png");
            // images.saveImage(clip0, "/sdcard/hhmfile/forjudge/repBag/"+i+"-"+j+".png");
            compareResult = images.getSimilarity(clip0, src, {
                "type": "MSSIM"
            });
            // log(i+"-"+j+":"+compareResult);
            if (compareResult < 2.8 || compareResult > 3) {
                //双击存入
                clickItem(j+1,i+1,0,1);
                clickItem(j+1,i+1,0,1);
                // result = findButton(buttonType.save);
                // if (result) {
                //     //推算数量框的位置，并点击
                //     click_andshow(random(result.x+391,result.x+391+71),random(result.y,result.y+53));
                //     log("result.x:"+result.x+",result.y:"+result.y);
                //     // click_andshow(random(result.x,result.x+229),random(result.y,result.y+53));
                // }
            }
            clip0.recycle();
            src.recycle();
            packageY+=131;
        }
        packageY = 313;
        packageX+=131;
    }
    return;
}


/**
 * 找到按钮的位置
 * 
 */
var buttonType = {
    use: 1,
    move: 2,
    more: 3,
    save: 4,
  };

function findButton(button) {
    switch (button) {
        case buttonType.use:
            var img = captureScreen();
            var clip = images.clip(img, 440,264, 957-440,860-264);
            src = images.read("/sdcard/hhmfile/forjudge/button-使用.png");
            var result = images.findImage(clip, src); //找使用的位置
            if (result) {
                result.x+= 440;
                result.y+= 264;
            }
            clip.recycle();
            src.recycle();
            return result;
            break;
        case buttonType.move:
            break;
        case buttonType.more:
            var img = captureScreen();
            var clip = images.clip(img, 0,200, 360,422-200);
            src = images.read("/sdcard/hhmfile/forjudge/更多摊位-button.png");
            var result = images.findImage(clip, src); //找使用的位置
            if (result) {
                result.x+= 0;
                result.y+= 200;
            }
            clip.recycle();
            src.recycle();
            return result;
            break;
        case buttonType.save:
            var img = captureScreen();
            var clip = images.clip(img, 542,315, 1044-542,827-315);
            src = images.read("/sdcard/hhmfile/forjudge/button-存入仓库.png");
            var result = images.findImage(clip, src); //找使用的位置
            if (result) {
                result.x+= 542;
                result.y+= 315;
            }
            clip.recycle();
            src.recycle();
            return result;
        default:
            break;
    }
}

/**
 * 点击道具栏
 * 
 */
function clickItem(row,column,isPackage,doubleClick) {
    doubleClick = typeof doubleClick !== 'undefined' ?  doubleClick : 0;
    if (isPackage == 1) {//道具栏
        var deta =131; 
        var verticesX = 1048-deta;
        var verticesY = 270-deta;
    } else if (isPackage == 0) {//仓库右
        var deta =131; 
        var verticesX = 1095-deta;
        var verticesY = 315-deta;
    } else if (isPackage == 2) {//仓库左
        var deta =131; 
        var verticesX = 383-deta;
        var verticesY = 313-deta;
    }
    click_andshow(random(verticesX+column*deta+11,verticesX+column*deta+100),random(verticesY+row*deta+11,verticesY+row*deta+100),doubleClick);
}

/**
 * 点击仓库页数
 * 
 */
function clickPage(page) {
    var row = 5;
    var colum = 5;
    if (page <= row*colum) {
        var rowClick = Math.floor((page-1)/colum);
        var columClick = (page-1)%colum;
        // log("row:"+rowClick+";colum:"+columClick);
        var verticesX = 419;
        var verticesY = 187;
        click_andshow(random(verticesX+columClick*133+30,verticesX+columClick*133+119-30),random(verticesY+rowClick*131+30,verticesY+rowClick*131+119-30));
    } else {
        log("page error");
    }
}

function Init() {
//Init all state flag
    auto.waitFor();//等待开启无障碍模式
    var instanceRequestScreenCap = new RequestScreenCap();// 请求屏幕截图权限
    AutochangeState(stateType.Start);
}
function Start() {
    AutochangeState(stateType.Purchase);
}
function Purchase() {
    log("买宝图");
    //去买宝图的地方 1.点击道具栏 2.点击长安飞行旗子 3.点击使用 4.到轿夫处 5.关闭道具栏 6.打开小地图 7.输入坐标(493,149)点击前往 
    //8.等待10-15秒关闭地图 9.点击系统->基础->常用设置->查看附近摊位->第一个摊位->更多摊位
    //一共7个摊位，截图后用百度识图分析含有图、T、杂货摊位的点进去
    //
    // 1.1点击道具栏
    click_andshow(random(1976, 1976+56),random(981, 981+70));
    // 1.2遍历背包，计算剩余空位
    log("有"+countEmpty_Bag()+"个空位");
    var remainPosition = countEmpty_Bag();
    // 2.点击长安飞行旗子
    // 3.点击使用
    // 4.到轿夫处
    // 5.关闭道具栏
    flyFlag(PlaceEnum.Ca,PlaceEnum.Ca_cargo);
    //6.打开小地图 7. 8.
    findIndex(PlaceEnum.Ca,493,149);
    //9.点击系统->基础->常用设置->查看附近摊位->第一个摊位->更多摊位
    click_andshow(random(990, 1041),random(992, 1035));
    click_andshow(random(1775, 1852),random(183, 348));
    click_andshow(random(506, 668),random(195, 245));
    sleep(random(5000,8000));//等人物跑到指定地点
    click_andshow(random(1314, 1542),random(696, 744));//附近的摊位
    click_andshow(random(432, 722),random(188, 278));//点第一个摊位
    result = findButton(buttonType.more);
    if (result) {
        click_andshow(random(Number(result.x), Number(result.x)+48),random(Number(result.y), +Number(result.y)+170));//更多摊位,这里摊位会跑，要用找图来点击
    } else {
        toastLog("error:找不到更多摊位按钮");
        sleep(3000);
    }
    
    // 识别 error:被别人抢走以后无法恢复正常的购图流程
    while (remainPosition) {
        for (var i = 0; i < 7; i++) {
            if (remainPosition == 0) {
                break;
            }
            var img = captureScreen();
            // images.saveImage(img, "/sdcard/hhmfile/temp/img.png");
            // img = images.read("/sdcard/hhmfile/temp/img.png");
            //根据摊主ID来区分是否点击过PS：左侧摊位在点击后会发生变化
            var Forjudge = images.clip(img, 260, 231+i*87, 211, 74);
            // images.saveImage(Forjudge, "/sdcard/hhmfile/摊位"+i+".png");
            var logOcr= Baidu_ocr(Forjudge);
            var wordResult=logOcr.words_result;
            Forjudge.recycle();
            if (wordResult) {
                // var count=0; //百度ocr是按每行来划分的，这里就一行就不划分行号了
                wordResult.forEach(element => {
                    // count++;
                    log(element.words+"search-T:"+element.words.search("T"));
                    if ( (element.words.search("T") != -1) || (element.words.search("图") != -1) || (element.words.search("杂货摊位") != -1) ) {
                        click_andshow(random(260,260+211),random(231+i*87,231+i*87+74));
                        sleep(random(300,500));
                        while (remainPosition) { //背包有空位的时候
                            var img2 = captureScreen();
                            obj = images.clip(img2, 575, 308, 91, 80);
                            src = images.read("/sdcard/hhmfile/forjudge/摊位宝图1-1.png");
                            compareResult = images.getSimilarity(obj, src, {
                                "type": "MSSIM"
                            });
                            src.recycle();
                            obj.recycle();
                            if (compareResult < 3.0 && compareResult >2.8) {
                                click_andshow(random(575,666),random(308,388));
                                sleep(2000);
                                var img3 = captureScreen();
                                obj = images.clip(img3, 1221,847, 1501-1221,887-847);
                                images.saveImage(obj, "/sdcard/hhmfile/价格"+i+".png");
                                logOcr= Baidu_ocr(obj);
                                wordResult=logOcr.words_result;
                                obj.recycle();
                                if (wordResult[0].words <= 28000 ) {
                                    click_andshow(random(1673,1863),random(881,948));//中间延时太久了，图容易被抢，被抢后任然记为购买
                                    remainPosition--;
                                    log("还剩："+remainPosition);
                                } else {
                                    //价格不行换一家
                                    log("太贵");
                                    break;
                                }
                            } else {
                                //卖的不是宝图换一家
                                log("不是宝图");
                                break;
                            }
                        }
                    }
                });
            }
            // sleep(1000);
        }
        click_andshow(random(279,464),random(889,930));//这边点不到，记得查一下 error
    }
    //关闭各个界面
    click_andshow(random(1930,1983),random(70,126));//关闭摊位
    click_andshow(random(1710,1761),random(77,128));//关闭系统
    log("purchase end.");
    AutochangeState(stateType.Sort);
}

var repRemain = new Object;
function Sort() {
    log("分类");
    //1.打开道具栏
    click_andshow(random(1976, 1976+56),random(981, 981+70));
    //2.把所有宝图打开
    var packageX = 1048;
    var packageY = 270;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            var img = captureScreen();
            var clip0 = images.clip(img, packageX, packageY, 128, 128);
            // images.saveImage(clip0, "/sdcard/hhmfile/forjudge/package-treasure/"+i+"-"+j+".png");
            var src = images.read("/sdcard/hhmfile/forjudge/package-treasure/"+i+"-"+j+".png");
            compareResult = images.getSimilarity(clip0, src, {
                "type": "MSSIM"
            });
            // log(i+"-"+j+"result:"+compareResult);
            src.recycle();
            clip0.recycle();            
            if (compareResult > 2.8 && compareResult < 3) {
                //是宝图；
                click_andshow(random(packageX,packageX+128),random(packageY,packageY+128));
                sleep(random(300,500));
                result = findButton(buttonType.use);
                if (result) {
                    click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
                    click_andshow(random(1191,1570),random(511,535));//点掉弹出提示，测试时有出现延时
                }
            }
            packageY+=131;
        }
        packageY = 270;
        packageX+=131;
        if (i==1) {
            packageX++;
        }
    }
    //3.飞到XL
    clickItem(1,2,1);
    sleep(random(300,500));
    result = findButton(buttonType.use);
    click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
    click_andshow(random(886,936),random(417,459));
    //4.关闭道具栏
    click_andshow(random(1703, 1703+59),random(71, 71+55));
    //5.点击仓库管理员->我要进行仓库操作
    click_andshow(random(1091, 1136),random(176, 263));
    click_andshow(random(1727, 2139),random(612, 699));
    //6.遍历道具栏的宝图，并记录下位置->暂时不用
    // for(var i = 0;i<5;i++) {
    //     for (var j = 0; j<4;j++) {
    //         clickItem(j+1,i+1,0);
    //         var img2 = captureScreen();
    //         var clip2 = images.clip(img2, 566, 329, 1022-566, 832-329);
    //         var logOcr= Baidu_ocr(clip2);
    //         var wordResult=logOcr.words_result;
    //         for (k=0;k<wordResult.length;k++){
    //             log("wordResult[k].words:"+wordResult[k].words);
    //         }
    //         clip2.recycle();
    //     }
    // }
    //7.转到地2页遍历第六步记下的位置，如果宝图位置为相应仓库的宝图，则存入仓库
    //   PS：第一个仓库为耗材存放仓库，宝图仓库为2-18，排序见PlaceEnum
    repRemain.count = 20;
    repRemain.page = 0;
    packageX = 1095;
    packageY = 314;

    for(var i = 0;i<5;i++) {
        for (var j = 0; j<4;j++) {
            var img2 = captureScreen();
            var clip2 = images.clip(img2, packageX, packageY, 128, 128);
            var src2 = images.read("/sdcard/hhmfile/forjudge/rep-treasure-right/"+i+"-"+j+".png");
            images.saveImage(clip2, "/sdcard/hhmfile/forjudge/temp/"+i+"-"+j+".png");
            compareResult2 = images.getSimilarity(clip2, src2, {
                "type": "MSSIM"
            });
            src2.recycle();
            clip2.recycle(); 
            log("**************"+i+"-"+j+"**************");
            log("compareResult2:"+compareResult2);
            if (compareResult2 > 2.7 && compareResult2 < 3) {//这里用找图加一个识别能加快很多
                clickItem(j+1,i+1,0);
                sleep(random(300,500));
                var img2 = captureScreen();
                var clip2 = images.clip(img2, 566, 329, 1022-566, 832-329);
                var logOcr= Baidu_ocr(clip2);//没有超时处理
                clip2.recycle();
                var wordResult=logOcr.words_result;
                //wordResult[0].words用于判断是不是宝图
                //wordResult[3].words记录了地点和坐标
                log("number:"+logOcr.words_result_num);
                if (logOcr.words_result_num) {
                    if (wordResult[0].words.search("藏宝图") != -1) {
                        if (wordResult[3].words.search("建邺城") != -1) {
                            log("建邺城");
                            var page = 2;
                        } else if (wordResult[3].words.search("东海湾") != -1) {
                            log("东海湾");
                            var page = 3;
                        } else if (wordResult[3].words.search("江南野外") != -1) {
                            log("江南野外");
                            var page = 4;
                        } else if (wordResult[3].words.search("傲来国") != -1) {
                            log("傲来国");
                            var page = 5;
                        } else if (wordResult[3].words.search("女儿村") != -1) {
                            log("女儿村");
                            var page = 6;
                        } else if (wordResult[3].words.search("花果山") != -1) {
                            log("花果山");
                            var page = 7;
                        } else if (wordResult[3].words.search("大唐国境") != -1) {
                            log("大唐国境");
                            var page = 8;
                        } else if (wordResult[3].words.search("普陀山") != -1) {
                            log("普陀山");
                            var page = 9;
                        } else if (wordResult[3].words.search("长寿郊外") != -1) {
                            log("长寿郊外");
                            var page = 10;
                        } else if (wordResult[3].words.search("北俱芦洲") != -1) {
                            log("北俱芦洲");
                            var page = 11;
                        } else if (wordResult[3].words.search("朱紫国") != -1) {
                            log("朱紫国");
                            var page = 12;
                        }  else if (wordResult[3].words.search("狮驼岭") != -1) {
                            log("狮驼岭");
                            var page = 13;
                        } else if (wordResult[3].words.search("墨家村") != -1) {
                            log("墨家村");
                            var page = 14;
                        } else if (wordResult[3].words.search("五庄观") != -1) {
                            log("五庄观");
                            var page = 15;
                        } else if (wordResult[3].words.search("大唐境外") != -1) {
                            log("大唐境外");
                            var page = 16;
                        } else if (wordResult[3].words.search("麒麟山") != -1) {
                            log("麒麟山");
                            var page = 17;
                        } else {
                            log("未识别");
                            var page = 18;
                        }
                        result = findButton(buttonType.save);
                        click_andshow(random(512,628),random(904,944));
                        clickPage(page);
                        clickItem(j+1,i+1,0);
                        click_andshow(random(result.x,result.x+229),random(result.y,result.y+53));
                        var countEmpty = countEmpty_Rep();
                        if (countEmpty < repRemain) {
                            repRemain.count = countEmpty;
                            repRemain.page = page;
                        }
                    }
                }
            }
            packageY+=131;
        }
        packageY = 314;
        packageX+=131;
    }
    click_andshow(random(1710,1766),random(72,122));
    //8.存完再去买宝图或者挖图
    var threshold = 6;//留X个空位
    if (repRemain.count < threshold) {
        AutochangeState(stateType.Dig);
        repRemain.count = 20;
    } else {
        AutochangeState(stateType.Purchase);
    }
    // 判断使用/移动按钮位置的
    // var img = captureScreen();
    // var obj = images.clip(img, 440,264, 957-440,860-264);
    // src = images.read("/sdcard/hhmfile/forjudge/button-移动.png");//button-使用.png
    // var result = images.findImage(obj, src);
    // log(result);
    // log("type:"+typeof(result));//440+40 264+350
    // var keys= Object.keys(result);
    // log("key:"+keys);
    // obj.recycle();
    // src.recycle();
}
function flyFlag(Place,location) {
    switch (Place) {
        case PlaceEnum.Ca:
            clickItem(1,1,1);
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            sleep(500);
            switch(location) {
                case PlaceEnum.DTGJ:
                    var img = captureScreen();
                    var clip = images.clip(img, 435,804, 553-435,918-804);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(435+result.x,435+result.x+33),random(804+result.y,804+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
                case PlaceEnum.JN:
                    var img = captureScreen();
                    var clip = images.clip(img, 1657,846, 1794-1657,918-846);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(1657+result.x,1657+result.x+33),random(846+result.y,846+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
                case PlaceEnum.Ca_hotel:
                    var img = captureScreen();
                    var clip = images.clip(img, 1510,453, 1636-1510,523-453);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(1510+result.x,1510+result.x+33),random(453+result.y,453+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
                case PlaceEnum.Ca_cargo:
                    var img = captureScreen();
                    var clip = images.clip(img, 1636,519, 1776-1636,631-519);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(1636+result.x,1636+result.x+33),random(519+result.y,519+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
            }
            break;
        case PlaceEnum.AL:
            clickItem(1,3,1);
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            sleep(500);
            switch(location) {
                case PlaceEnum.NE:
                    var img = captureScreen();
                    var clip = images.clip(img, 596,210, 740-596,318-210);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(596+result.x,596+result.x+33),random(210+result.y,210+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
                case PlaceEnum.HG:
                    var img = captureScreen();
                    var clip = images.clip(img, 1499,210, 1621-1499,318-210);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(1499+result.x,1499+result.x+33),random(210+result.y,210+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
                case PlaceEnum.DHW:
                    var img = captureScreen();
                    var clip = images.clip(img, 1291,778, 1483-1291,892-778);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(1291+result.x,1291+result.x+33),random(778+result.y,778+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
            }
            break;
        case PlaceEnum.Cs:
            clickItem(1,4,1);
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            sleep(500);
            switch(location) {
                case PlaceEnum.CSJW:
                    var img = captureScreen();
                    var clip = images.clip(img, 1236,796, 1398-1236,938-796);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(1236+result.x,1236+result.x+33),random(796+result.y,796+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
            }
            break;
        case PlaceEnum.ZZ:
            clickItem(1,5,1);
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            sleep(500);
            switch(location) {
                case PlaceEnum.DTJW:
                    var img = captureScreen();
                    var clip = images.clip(img, 552,787, 783-552,912-787);
                    src = images.read("/sdcard/hhmfile/forjudge/flagRedPoint.png");
                    var result = images.findImage(clip, src); //找使用的位置
                    clip.recycle();
                    src.recycle();
                    if (result) {
                        click_andshow(random(552+result.x,552+result.x+33),random(787+result.y,787+result.y+29))
                    } else {
                        log("not find redpoint!");
                    }
                    click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
                    break;
            }
            break;
    }
}

function goTo(Place) {
    click_andshow(random(1976, 1976+56),random(981, 981+70));
    switch (Place) {
        case PlaceEnum.JY:
            clickItem(1,2,1);//飞行符
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            click_andshow(random(1326, 1389),random(641, 673));
            click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
            break;
        case PlaceEnum.DHW:
            flyFlag(PlaceEnum.AL,PlaceEnum.DHW);
            findIndex(PlaceEnum.AL,169,16);
            sleep(random(1000,1300));
            click_andshow(random(1049, 1089),random(468, 533));//点驿站
            click_andshow(random(1731, 2142),random(479, 573));//我要去
            break;
        case PlaceEnum.JN:
            flyFlag(PlaceEnum.Ca,PlaceEnum.JN);
            findIndex(PlaceEnum.Ca,541,3);
            sleep(random(500,1000));
            click_andshow(random(2105, 2166),random(973, 1033));//收起扩展
            click_andshow(random(1915, 2045),random(973, 1033));
            click_andshow(random(2105, 2166),random(973, 1033));//打开扩展
            break;
        case PlaceEnum.AL:
            clickItem(1,3,1);//AL
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            click_andshow(random(793, 824),random(772, 802));
            click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
            break;
        case PlaceEnum.NE:
            flyFlag(PlaceEnum.AL,PlaceEnum.NE);
            findIndex(PlaceEnum.AL,7,140);
            sleep(random(500,1000));
            click_andshow(random(139, 247),random(308, 348));
            break;
        case PlaceEnum.HG:
            flyFlag(PlaceEnum.AL,PlaceEnum.HG);
            findIndex(PlaceEnum.AL,213,141);
            sleep(random(500,1000));
            click_andshow(random(1882, 1972),random(172, 210));
            break;
        case PlaceEnum.DTGJ:
            flyFlag(PlaceEnum.Ca,PlaceEnum.DTGJ);
            findIndex(PlaceEnum.Ca,12,3);
            sleep(random(500,1000));
            click_andshow(random(97, 111),random(982, 1001));
            break;
        case PlaceEnum.PT:
            clickItem(1,1,1);//CA
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            click_andshow(random(454, 486),random(876, 905));
            click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
            findIndex(PlaceEnum.Ca,12,3);
            sleep(random(500,1000));
            click_andshow(random(97, 111),random(982, 1001));
            findIndex(PlaceEnum.DTGJ,221,61);
            sleep(random(26000,30000));//26s-30s
            click_andshow(random(1089, 1123),random(448, 563));//点传送
            click_andshow(random(1735, 2073),random(484, 568));
            break;
        case PlaceEnum.CSJW:
            flyFlag(PlaceEnum.Cs,PlaceEnum.CSJW);
            findIndex(PlaceEnum.Cs,142,5);
            sleep(random(500,1000));
            click_andshow(random(1748, 1874),random(850, 926));
            break;
        case PlaceEnum.BJ:
            flyFlag(PlaceEnum.Cs,PlaceEnum.CSJW);
            findIndex(PlaceEnum.Cs,142,5);
            sleep(random(500,1000));
            click_andshow(random(1748, 1874),random(850, 926));
            findIndex(PlaceEnum.CSJW,60,67);
            sleep(random(26000,28000));//26s-28s
            click_andshow(random(1086, 1125),random(417, 520));//点传送
            click_andshow(random(1733, 2084),random(493, 572));
            break;
        case PlaceEnum.ZZ:
            flyFlag(PlaceEnum.ZZ,PlaceEnum.DTJW);
            break;
        case PlaceEnum.STL:
            flyFlag(PlaceEnum.ZZ,PlaceEnum.DTJW);
            sleep(random(300,500));
            findIndex(PlaceEnum.ZZ,8,3);
            sleep(random(500,1000));
            click_andshow(random(97, 111),random(982, 1001));
            findIndex(PlaceEnum.DTJW,8,48);
            sleep(random(3000,5000));//3s-5s
            click_andshow(random(71, 165),random(516, 561));
            break;
        case PlaceEnum.MJ:
            flyFlag(PlaceEnum.ZZ,PlaceEnum.DTJW);
            sleep(random(300,500));
            findIndex(PlaceEnum.ZZ,8,3);
            sleep(random(500,1000));
            click_andshow(random(97, 111),random(982, 1001));
            findIndex(PlaceEnum.DTJW,232,112);
            sleep(random(38000,43000));//38s-43s
            click_andshow(random(1306, 1349),random(213, 288));//土地
            click_andshow(random(1725, 2143),random(349, 445));
            break;
        case PlaceEnum.WZ:
            clickItem(1,1,1);//CA
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            click_andshow(random(454, 486),random(876, 905));
            click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
            findIndex(PlaceEnum.Ca,12,3);
            sleep(random(500,1000));
            click_andshow(random(97, 111),random(982, 1001));
            findIndex(PlaceEnum.DTGJ,5,79);
            sleep(random(66000,70000));//66s-70s
            click_andshow(random(38, 155),random(588, 625));
            findIndex(PlaceEnum.DTJW,635,76);
            sleep(random(36000,40000));//36s-40s
            click_andshow(random(1987, 2091),random(396, 441));
            break;
        case PlaceEnum.QLS:
            clickItem(1,5,1);//ZZ
            result = findButton(buttonType.use);
            if (result) {
                click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
            } else {
                log("find button error!");
            }
            click_andshow(random(566, 594),random(288, 314));
            click_andshow(random(1699, 1761),random(73, 130));//关闭道具栏
            click_andshow(random(8, 123),random(154, 176));
            break;
        default:
            break;
    }
}
// function Dig() {
//     // flyFlag(PlaceEnum.Ca,PlaceEnum.DTGJ);
//     goTo(PlaceEnum.ZZ);
//     sleep(1000);
//     goTo(PlaceEnum.STL);
//     sleep(1000);
//     goTo(PlaceEnum.MJ);
//     AutochangeState(stateType.Stop);
// }
function Dig() {
    log("挖图");
    // 1.飞到XL
    click_andshow(random(1976, 1976+56),random(981, 981+70));
    clickItem(1,2,1);
    sleep(random(300,500));
    result = findButton(buttonType.use);
    click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
    click_andshow(random(886,936),random(417,459));
    // 2.点开仓库
    click_andshow(random(1703, 1703+59),random(71, 71+55));
    click_andshow(random(1091, 1136),random(176, 263));
    click_andshow(random(1727, 2139),random(612, 699));
    // 3.清理背包 (找图是可以调参的)
    bagCleanRep();
    // 4. while(2-16仓库有图) 
    if (repRemain.page) {

    } else {
        repRemain.page = 5;
    }
    click_andshow(random(512,628),random(904,944));
    clickPage(Number(repRemain.page));
    var packageX = 383;
    var packageY = 313;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            var img = captureScreen();
            var clip0 = images.clip(img, packageX, packageY, 128, 128);
            // images.saveImage(clip0, "/sdcard/hhmfile/forjudge/rep-treasure/"+i+"-"+j+".png");
            var src = images.read("/sdcard/hhmfile/forjudge/rep-treasure/"+i+"-"+j+".png");
            compareResult = images.getSimilarity(clip0, src, {
                "type": "MSSIM"
            });
            log(i+"-"+j+"result:"+compareResult);
            src.recycle();
            clip0.recycle();            
            if (compareResult > 2.8 && compareResult < 3) {
                //是宝图；
                clickItem(j+1,i+1,2,1);
                clickItem(j+1,i+1,2,1);
            }
            packageY+=131;
        }
        packageY = 313;
        packageX+=131;
    }
    click_andshow(random(1710,1766),random(72,122));//关闭仓库页面
    // 5. 记下仓库号
    // 6. 取旗子
    // 7. 取图
    // 8. 关仓库
    // 9. 去某地
    switch (repRemain.page) {
        case 2://建邺城
            place = PlaceEnum.JY;
            break;
        case 3://东海湾
            place = PlaceEnum.DHW;
            break;
        case 4://江南野外
            place = PlaceEnum.JN;
            break;
        case 5://傲来国
            place = PlaceEnum.AL;
            break;
        case 6://女儿村
            place = PlaceEnum.NE;
            break;
        case 7://花果山
            place = PlaceEnum.HG;
            break;
        case 8://大唐国境
            place = PlaceEnum.DTJW;
            break;
        case 9://普陀山
            place = PlaceEnum.PT;
            break;
        case 10://长寿郊外
            place = PlaceEnum.CSJW;
            break;
        case 11://北俱芦洲
            place = PlaceEnum.BJ;
            break;
        case 12://朱紫国
            place = PlaceEnum.ZZ;
            break;
        case 13://狮驼岭
            place = PlaceEnum.STL;
            break;
        case 14://墨家村
            place = PlaceEnum.MJ;
            break;
        case 15://五庄观
            place = PlaceEnum.WZ;
            break;
        case 16://大唐境外
            place = PlaceEnum.DTJW;
            break;
        case 17://麒麟山
            place = PlaceEnum.QLS;
            break;
    }
    // findIndex(PlaceEnum.QLS,179,3);
    goTo(place);
    sleep(random(500,800));
    click_andshow(random(1976, 1976+56),random(981, 981+70));
    // 10. 遍历背包，记录坐标
    var packageX = 1048;
    var packageY = 270;
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            var img = captureScreen();
            var clip0 = images.clip(img, packageX, packageY, 128, 128);
            // images.saveImage(clip0, "/sdcard/hhmfile/forjudge/package-treasure/"+i+"-"+j+".png");
            var src = images.read("/sdcard/hhmfile/forjudge/package-treasure/"+i+"-"+j+".png");
            compareResult = images.getSimilarity(clip0, src, {
                "type": "MSSIM"
            });
            // log(i+"-"+j+"result:"+compareResult);
            src.recycle();
            clip0.recycle();            
            if (compareResult > 2.8 && compareResult < 3) {
                //是宝图；
                click_andshow(random(packageX,packageX+128),random(packageY,packageY+128));
                sleep(random(300,500));
                var img2 = captureScreen();
                var clip2 = images.clip(img2, 436, 180, 1002-436, 881-180);
                var logOcr= Baidu_ocr(clip2);//没有超时处理
                clip2.recycle();
                var wordResult=logOcr.words_result;
                //wordResult[0].words用于判断是不是宝图
                //wordResult[3].words记录了地点和坐标
                log("number:"+logOcr.words_result_num);
                log("wordResult3:"+wordResult[3]);
                // result = findButton(buttonType.use);
                // if (result) {
                //     click_andshow(random(result.x,result.x+200),random(result.y,result.y+50));
                //     click_andshow(random(1191,1570),random(511,535));//点掉弹出提示，测试时有出现延时
                // }
            }
            packageY+=131;
        }
        packageY = 270;
        packageX+=131;
        if (i==1) {
            packageX++;
        }
    }
    // 11. 打开小地图输入坐标
    // 12. 到地点->使用宝图

    // var img = captureScreen();
    // var obj = images.clip(img, 1014,171, 1248-1014,259-171);
    // var src = images.read("/sdcard/hhmfile/forjudge/button-on-道具.png");
    // var src2 = images.read("/sdcard/hhmfile/forjudge/button-up-道具.png");
    // compareResult = images.getSimilarity(obj, src, {
    //     "type": "MSSIM"
    // });
    // compareResult2 = images.getSimilarity(obj, src2, {
    //     "type": "MSSIM"
    // });
    // log("result1:"+compareResult);
    // log("result2:"+compareResult2);

    // src.recycle();
    // src2.recycle();
    // obj.recycle();
    // findIndex(PlaceEnum.Ca,111,111);
    AutochangeState(stateType.Stop);
}

function changeState(stateType_input) {
    State = stateType_input;
}
function AutochangeState(stateType_input) {
    if (workMode == workModeType.Auto) {
        State = stateType_input;
    } else if (workMode == workModeType.manual) {
        State = stateType.Stop;
    }
}
function getState() {
    return State;
}

window.auto.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_UP:
            if (window.auto.attr("src") == "file:///sdcard/hhmfile/icon/自动.png") {
                window.auto.attr("src", "file:///sdcard/hhmfile/icon/手动更新.png");
                workMode = workModeType.Auto;
            } else if (window.auto.attr("src") == "file:///sdcard/hhmfile/icon/手动更新.png") {
                window.auto.attr("src", "file:///sdcard/hhmfile/icon/自动.png");
                workMode = workModeType.manual;
            }
            return true;
    }
    return true;
});

window.purchase.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_UP:
            log("purchase");
            changeState(stateType.Purchase);
            return true;
    }
    return true;
});

window.sort.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_UP:
            log("sort");
            changeState(stateType.Sort);
            return true;
    }
    return true;
});

window.dig.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_UP:
            changeState(stateType.Dig);
            return true;
    }
    return true;
});

window.exit.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_UP:
            toastLog("exit");
            changeState(stateType.Exit);
            stopFlag = 1;
            return true;
    }
    return true;
});
// var thread = threads.start(function(){
//     toastLog("进入线程");
//     while(1){
//     }
// });

function action_onClick() {
    if (window.action.attr("alpha") == "0.5") {
        window.action.attr("alpha","1");
        changeState(stateType.Init);
        window.auto.attr("visibility", "visible");
        window.purchase.attr("visibility", "visible");
        window.sort.attr("visibility", "visible");
        window.dig.attr("visibility", "visible");
        window.exit.attr("visibility", "visible");
    } else if (window.action.attr("alpha") == 1) {
        window.action.attr("alpha","0.5");
        window.auto.attr("visibility", "gone");
        window.purchase.attr("visibility", "gone");
        window.purchase.attr("visibility", "gone");
        window.sort.attr("visibility", "gone");
        window.dig.attr("visibility", "gone");
        window.exit.attr("visibility", "gone");
    }
}

/**
 * 小地图以游标推算键盘相对位置 注:现有的找图识别率低
 * 数字一的左上角坐标为：(index_X-119,index_X+52)
 * 数字二的左上角坐标为：(index_X-119+147,index_X+52)
 * 数字三的左上角坐标为：(index_X-119+147+147,index_X+52)
 * 数字四的左上角坐标为：(index_X-119,index_X+52+143)
 * 数字五的左上角坐标为：(index_X-119+147,index_X+52+143)
 * 数字六的左上角坐标为：(index_X-119+147+147,index_X+52+143)
 * 数字零的左上角坐标为：(index_X-119+147+147+147,index_X+52+143)
 * 数字七的左上角坐标为：(index_X-119,index_X+52+143+143)
 * 数字八的左上角坐标为：(index_X-119+147,index_X+52+143+143)
 * 数字九的左上角坐标为：(index_X-119+147+147,index_X+52+143+143)
 * 确定键的左上角坐标为：(index_X-119+147+147+147,index_X+52+143+143)
 */
function keyboard(index_X,index_Y,nubmer) {
    var index = new Object;
    index.x = 0;
    index.y = 0;
    switch(nubmer) {
        case 1:
            index.x = index_X-119;
            index.y = index_Y+52;
            return index;
            break;
        case 2:
            index.x = index_X-119+147;
            index.y = index_Y+52;
            return index;
            break;
        case 3:
            index.x = index_X-119+147+147;
            index.y = index_Y+52;
            return index;
            break;
        case 4:
            index.x = index_X-119;
            index.y = index_Y+52+143;
            return index;
            break;
        case 5:
            index.x = index_X-119+147;
            index.y = index_Y+52+143;
            return index;
            break;
        case 6:
            index.x = index_X-119+147+147;
            index.y = index_Y+52+143;
            return index;
            break;
        case 0:
            index.x = index_X-119+147+147+147;
            index.y = index_Y+52+143;
            return index;
            break;
        case 7:
            index.x = index_X-119;
            index.y = index_Y+52+143+143;
            return index;
            break;
        case 8:
            index.x = index_X-119+147;
            index.y = index_Y+52+143+143;
            return index;
            break;
        case 9:
            index.x = index_X-119+147+147;
            index.y = index_Y+52+143+143;
            return index;
            break;
        case 255://确认键
            index.x = index_X-119+147+147+147;
            index.y = index_Y+52+143+143;
            return index;
            break;
        default:
            toastLog("keyboard error!")
            sleep(2000);
            // exit();
    }
}
// var PlaceEnum = {
//     JY: 1,          //建邺城
//     DHW: 2,         //东海湾
//     JN: 3,          //江南野外
//     AL:4,           //傲来国
//     NE:5,           //女儿村
//     HG:6,           //花果山
//     DTGJ:7,         //大唐国境
//     PT:8,           //普陀山
//     CSJW:9,         //长寿郊外
//     BJ:10,          //北俱芦洲
//     ZZ:11,          //朱紫国
//     STL:12,         //狮驼岭
//     MJ:13,          //墨家村
//     WZ:14,          //五庄观
//     DTJW:15,        //大唐境外
//     QLS:16,         //麒麟山
//     Ca:17,          //长安
// };

/**
 * 根据地点找相对坐标
 * 
 */
function findIndex(Place,number_X,number_Y) {
    switch (Place) {
        case PlaceEnum.JY:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(550,633),random(113,161));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(600,197,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(600,197,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(740,830),random(113,161));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(793,197,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(793,197,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(885,1039),random(113,161));
            //关闭地图
            click_andshow(random(1798,1841),random(72,117));
            break;
        case PlaceEnum.DHW:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(779,858),random(160,199));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(828,237,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(828,237,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(970,1049),random(160,199));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(1021,238,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(1021,238,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1132,1260),random(160,199));
            //关闭地图
            click_andshow(random(1568,1615),random(114,158));
            break;

        case PlaceEnum.JN:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(655,736),random(156,191));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(706,232,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(706,232,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(847,931),random(156,191));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(899,232,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(899,232,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1066,1144),random(156,191));
            //关闭地图
            click_andshow(random(1687,1733),random(107,156));
            break;

        case PlaceEnum.AL:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(724,802),random(119,156));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(774,196,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(774,196,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(916,997),random(119,156));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(967,195,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(967,195,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1059,1219),random(119,156));
            //关闭地图
            click_andshow(random(1621,1667),random(70,117));
            break;

        case PlaceEnum.NE:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(733,811),random(68,102));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(781,143,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(781,143,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(925,1006),random(68,102));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(974,143,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(974,143,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1078,1216),random(68,102));
            //关闭地图
            click_andshow(random(1613,1661),random(18,68));
            break;

        case PlaceEnum.HG:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(666,745),random(162,199));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(715,238,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(715,238,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(858,940),random(162,199));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(909,238,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(909,238,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1000,1160),random(162,199));
            //关闭地图
            click_andshow(random(1679,1724),random(114,162));
            break;

        case PlaceEnum.DTGJ:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(675,761),random(72,124));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(727,158,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(727,158,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(872,958),random(72,124));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(920,158,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(920,158,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1013,1177),random(72,124));
            //关闭地图
            click_andshow(random(1664,1719),random(26,89));
            break;

        case PlaceEnum.PT:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(660,741),random(159,193));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(710,234,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(710,234,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(854,932),random(159,193));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(903,234,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(974,143,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1002,1148),random(159,193));
            //关闭地图
            click_andshow(random(1685,1728),random(110,159));
                break;

            case PlaceEnum.Cs:
                //打开小地图
                click_andshow(random(25,99),random(74,132));
                //点击X输入框
                click_andshow(random(851,929),random(144,185));
                //分解
                str = number_X.toString();
                for (var i=0; i<str.length; i++) {
                    index = keyboard(899,224,Number(str[i]));
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                    //确认键
                    if (i == str.length-1) {
                        index = keyboard(899,224,255);
                        click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                    }
                }
                //点击Y输入框
                click_andshow(random(1047,1118),random(144,185));
                //分解
                str = number_Y.toString();
                for (var i=0; i<str.length; i++) {
                    index = keyboard(1092,224,Number(str[i]));
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                    //点击确认键
                    if (i == str.length-1) {
                        index = keyboard(1092,224,255);
                        click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                    }
                }
                //点击前往
                click_andshow(random(1184,1341),random(144,185));
                //关闭地图
                click_andshow(random(1498,1542),random(101,144));
                break;
        
        case PlaceEnum.CSJW:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(725,812),random(151,206));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(779,237,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(779,237,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(918,1006),random(151,206));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(972,238,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(972,238,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1080,1216),random(151,206));
            //关闭地图
            click_andshow(random(1610,1663),random(109,163));
            break;

        case PlaceEnum.BJ:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(663,743),random(155,193));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(712,232,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(712,232,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(854,934),random(155,193));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(905,232,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(905,232,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1003,1156),random(155,193));
            //关闭地图
            click_andshow(random(1685,1731),random(107,155));
            break;

        case PlaceEnum.ZZ:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(675,756),random(110,151));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(725,189,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(725,189,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(866,950),random(110,151));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(918,189,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(918,189,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(1007,1175),random(110,151));
            //关闭地图
            click_andshow(random(1669,1714),random(66,110));
            break;
        case PlaceEnum.STL:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(656,734),random(153,188));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(706,230,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(706,230,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(848,930),random(153,188));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(899,230,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(899,230,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(992,1154),random(153,188));
            //关闭地图
            click_andshow(random(1669,1714),random(66,110));
            break;

        case PlaceEnum.MJ://1043
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(768,865),random(309,359));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(824,394,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(824,394,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(768,865),random(413,455));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(824,491,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(824,491,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(717,893),random(486,543));
            //关闭地图
            click_andshow(random(1494,1539),random(27,72));
            break;
        case PlaceEnum.WZ:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(662,743),random(155,198));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(710,234,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(710,234,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(853,933),random(155,198));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(903,234,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(903,234,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(998,1156),random(155,198));
            //关闭地图
            click_andshow(random(1684,1732),random(110,155));
            break;
        case PlaceEnum.DTJW:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(493,572),random(314,363));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(542,400,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(542,400,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(685,769),random(314,363));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(735,400,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(735,400,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(823,982),random(314,363));
            //关闭地图
            click_andshow(random(1851,1901),random(272,324));
            break;
        case PlaceEnum.QLS:
                        //打开小地图
                        click_andshow(random(25,99),random(74,132));
                        //点击X输入框
                        click_andshow(random(652,734),random(159,199));
                        //分解
                        str = number_X.toString();
                        for (var i=0; i<str.length; i++) {
                            index = keyboard(702,238,Number(str[i]));
                            click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                            //确认键
                            if (i == str.length-1) {
                                index = keyboard(702,238,255);
                                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                            }
                        }
                        //点击Y输入框
                        click_andshow(random(845,926),random(159,199));
                        //分解
                        str = number_Y.toString();
                        for (var i=0; i<str.length; i++) {
                            index = keyboard(895,238,Number(str[i]));
                            click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                            //点击确认键
                            if (i == str.length-1) {
                                index = keyboard(895,238,255);
                                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                            }
                        }
                        //点击前往
                        click_andshow(random(985,1152),random(159,199));
                        //关闭地图
                        click_andshow(random(1692,1737),random(114,159));
            break;
        case PlaceEnum.Ca:
            //打开小地图
            click_andshow(random(25,99),random(74,132));
            //点击X输入框
            click_andshow(random(560,653),random(110,171));
            //分解
            str = number_X.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(615,198,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //确认键
                if (i == str.length-1) {
                    index = keyboard(615,198,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击Y输入框
            click_andshow(random(754,845),random(110,171));
            //分解
            str = number_Y.toString();
            for (var i=0; i<str.length; i++) {
                index = keyboard(808,198,Number(str[i]));
                click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+100));
                //点击确认键
                if (i == str.length-1) {
                    index = keyboard(808,198,255);
                    click_andshow(random(Number(index.x)+10,Number(index.x)-10+100),random(Number(index.y)+10,Number(index.y)-10+110));
                }
            }
            //点击前往
            click_andshow(random(892,1072),random(110,171));
            //关闭地图
            click_andshow(random(1774,1833),random(66,128));
            break;
        default:
            toastLog("place name error!");
            break;
    }
}
// var PlaceEnum = {
//     JY: 1,          //建邺城
//     DHW: 2,         //东海湾
//     JN: 3,          //江南野外
//     AL:4,           //傲来国
//     NE:5,           //女儿村
//     HG:6,           //花果山
//     DTGJ:7,         //大唐国境
//     PT:8,           //普陀山
//     CSJW:9,         //长寿郊外
//     BJ:10,          //北俱芦洲
//     ZZ:11,          //朱紫国
//     STL:12,         //狮驼岭
//     MJ:13,          //墨家村
//     WZ:14,          //五庄观
//     DTJW:15,        //大唐境外
//     QLS:16,         //麒麟山
//     Ca:17,          //长安
//   };
// floaty.closeAll()
// while(1){};