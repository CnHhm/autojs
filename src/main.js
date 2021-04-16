var HeadClass = function ScreenCapture() {
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    }

};

var Head = (function () { // 匿名自执行函数
    var instance; // 声明一个instance对象
    return function () {
        if (instance) { // 如果已存在 则返回instance
            return instance;
        }
        instance = new HeadClass() // 如果不存在 则new一个HeadClass对象
        return instance;
    }
})();
var a = new Head();
var b = new Head();
console.log(a===b) // true