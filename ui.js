var w1 = floaty.window(
    <frame gravity="center">
        <text id="text" color = "white">悬浮文字</text>
    </frame>
);
w1.setPosition(500, 500)
var w2 = floaty.window(
    <frame gravity="center">
        <text id="text" color = "white">悬浮文字</text>
    </frame>
);
w2.setPosition(500, 800)
setTimeout(()=>{
    w1.close();
}, 2000);
setTimeout(()=>{
    w2.close();
}, 2000);