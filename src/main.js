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


// var a = new RequestScreenCap();


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

function Position(mapTypeEnum,PlaceEnum,axisX,axisY)
{
    this.type=mapTypeEnum;
    this.Postion=PostionEnum;
    this.axisX=axisX;
    this.axisY=axisY;

    this.changeName=changeName;
    function changeName(name)
    {
        this.lastname=name;
    }
}
var test = new Position(mapTypeEnum.Empty,PlaceEnum.JY,11,2);
var storage = storages.create("hhm:localStorage");
storage.put("positionA", test);
storage.put("positionB", 666);

log("positionA = "+ storage.get("positionA").Postion);

storage.clear();
log("end");