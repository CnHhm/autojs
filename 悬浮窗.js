var execution = null;
//记录按键被按下时的触摸坐标
var x = 0,
y = 0;
//记录按键被按下时的悬浮窗位置
var windowX, windowY;
//记录按键被按下的时间以便判断长按等动作
var downTime;

var window = floaty.window(
    <frame>
        <button id="action" text="开始运行" w="90" h="40" bg="#77ffffff"/>
        <button id="action1" alpha="0.5" marginTop="40" gravity="bottom" text="运行" w="90" h="40" bg="#77ffffff"/>
    </frame>
);

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
                onClick();
            }
            return true;
    }
    return true;
});

var flag = false;
var thread = threads.start(function(){
    toastLog("进入线程");
    while(1){
        if (flag) toastLog("hallo!");
        sleep(3000);
    }
});

function onClick() {
    if (window.action.getText() == '开始运行') {
        toastLog("onClick");
        window.action1.attr("visibility", "gone");
        flag = true;
        window.action.setText('停止运行');
    } else {
        window.action1.attr("visibility", "visible");
        flag = false;
        window.action.setText('开始运行');
    }
}
function myfunc() {
    toastLog("hallo!");
}
while(1){};