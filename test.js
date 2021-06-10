// eatTime = new Date().getTime();
// var add = (function () {
//     var counter = 0;
//     return function () {return counter += 1;}
// })();
// log(add());
// log(add());
// log(add());

// var add = (function () {
//     var eatTime = new Object(true);
//     // var eatTime = new Date().getTime();
//     eatTime.new =  new Date().getTime();
//     return function () {
//         eatTime.old = eatTime.new;
//         eatTime.new = new Date().getTime();
//         return eatTime;
//     }
// })();
// var test1 = add();
// log(test1.old+";"+test1.new);

// sleep(1000);

// var test2 = add();
// log(test2.old+";"+test2.new);

var useIncense = (function () {
    var Time = new Object(true);
    Time.new =  new Date().getTime();
    return function () {
        Time.old = Time.new;
        Time.new = new Date().getTime();
        if( (Time.new-Time.old) > 3000 ) {
            log("timeup");
        } else {
            log("not now");
        }
        return Time;
    }
})();

useIncense();
sleep(2500);
useIncense();
sleep(3500);
useIncense();