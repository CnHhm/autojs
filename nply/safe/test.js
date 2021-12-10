toast("start");
while (1) {
//判断题型
//如果是单选题
//如果是判断题
//如果是多选题
}
if(className("android.widget.Button").text("下一题").exists()){
    toast("find one");
    sleep(1000);
    className("android.widget.Button").text("下一题").findOne().click()
}
toast("end");