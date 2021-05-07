var window = floaty.window(
    <horizontal>
        {/* 中心图标 */}
        <img
        margin = "5"
        circle = "true"
        alpha = "0.5"
        id="action" 
        src="file:///sdcard/hhmfile/bag3.png"
        />
        {/* 买图 */}
        <img
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="purchase" 
        src="file:///sdcard/hhmfile/temp2.png"
        />
        {/* 分类 */}
        <img
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="sort" 
        src="file:///sdcard/hhmfile/temp2.png"
        />
        {/* 挖图 */}
        <img
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="dig" 
        src="file:///sdcard/hhmfile/temp2.png"
        />
        {/* 停止 */}
        <img
        margin = "5"
        visibility = "gone"
        circle = "true"
        alpha = "0.7"
        id="exit" 
        src="file:///sdcard/hhmfile/temp2.png"
        />
    </horizontal>
);

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
                exit();
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

var State = stateType.Stop;
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
                toastLog("default");
        }
    }
});
function Init() {
//Init all state flag
    changeState(stateType.Start);
}
function Start() {
    changeState(stateType.Purchase);
}
function Purchase() {
    toastLog("买宝图");
    //将身上清空
    changeState(stateType.Sort);
}
function Sort() {
    toastLog("分类");
    //将身上清空
    changeState(stateType.Dig);
}
function Dig() {
    toastLog("挖图");
    //将身上清空
    changeState(stateType.Stop);
}

function changeState(stateType) {
    State = stateType;
}
function getState() {
    return State;
}

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
            changeState(stateType.dig);
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
        window.purchase.attr("visibility", "visible");
        window.sort.attr("visibility", "visible");
        window.dig.attr("visibility", "visible");
        window.exit.attr("visibility", "visible");
    } else if (window.action.attr("alpha") == 1) {
        window.action.attr("alpha","0.5");

        window.purchase.attr("visibility", "gone");
        window.purchase.attr("visibility", "gone");
        window.sort.attr("visibility", "gone");
        window.dig.attr("visibility", "gone");
        window.exit.attr("visibility", "gone");
    }
}
function myfunc() {
    toastLog("hallo!");
}
// floaty.closeAll()
while(1){};