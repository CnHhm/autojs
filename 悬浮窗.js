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
    //log(json);
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
click_index.setPosition(16,950);
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
window.setPosition(116,950);
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
threads.start(function stateMachine(){
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
/**
 * 图标旋转的代码
 * 注：该定时器会被ui线程阻塞
 */
// var ro = 0;
// var id = setInterval(function(){
//     window.auto.attr("rotation",ro+=2);
//     if (ro == 360) ro = 0;
// }, 30);
function click_andshow(x,y) {
    click(x,y);
    click_index.setPosition(x,y);
    sleep(random(300,800));
    //悬浮窗会遮挡点击
    click_index.setPosition(16,950);
    sleep(random(300,800));
    
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
    toastLog("买宝图");
    //去买宝图的地方 1.点击道具栏 2.点击长安飞行旗子 3.点击使用 4.到轿夫处 5.关闭道具栏 6.打开小地图 7.输入坐标(493,149)点击前往 
    //8.等待10-15秒关闭地图 9.点击系统->基础->常用设置->查看附近摊位->第一个摊位->更多摊位
    //一共7个摊位，截图后用百度识图分析含有图、T、杂货摊位的点进去
    //
    // // 1.点击道具栏
    // click_andshow(random(1976, 1976+56),random(981, 981+70));
    // // 2.点击长安飞行旗子
    // click_andshow(random(1068, 1154),random(291, 375));
    // // 3.点击使用
    // click_andshow(random(725, 725+209),random(605, 605+61));
    // // 4.到轿夫处
    // click_andshow(random(1693, 1693+39),random(565, 565+33));
    // //5.关闭道具栏
    // click_andshow(random(1703, 1703+59),random(71, 71+55));
    // //6.打开小地图 7. 8.
    // findIndex(PlaceEnum.Ca,493,149);
    //9.点击系统->基础->常用设置->查看附近摊位->第一个摊位->更多摊位
    click_andshow(random(990, 1041),random(992, 1035));
    click_andshow(random(1775, 1852),random(183, 348));
    click_andshow(random(506, 668),random(195, 245));
    // sleep(random(5000,8000));//等人物跑到指定地点
    click_andshow(random(1314, 1542),random(696, 744));//附近的摊位
    click_andshow(random(432, 722),random(188, 278));//点第一个摊位
    click_andshow(random(18, 79),random(209, 401));//更多摊位
    //识别
    var img = captureScreen();
    for (var i = 0; i < 7; i++) {
        //根据摊主ID来区分是否点击过PS：左侧摊位在点击后会发生变化
        var Forjudge = images.clip(img, 260, 231, 211, 74);
    }
    
    AutochangeState(stateType.Sort);
}
function Sort() {
    toastLog("分类");
    AutochangeState(stateType.Dig);
}
function Dig() {
    toastLog("挖图");
    findIndex(PlaceEnum.Ca,111,111);
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
            toastLog("purchase");
            changeState(stateType.Purchase);
            return true;
    }
    return true;
});

window.sort.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_UP:
            toastLog("sort");
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
 * 小地图以游标推算键盘相对位置
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
/**
 * 根据地点找相对坐标
 * 
 */
function findIndex(Place,number_X,number_Y) {
    switch (Place) {
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