// 创建或打开一个数据库文件，在当前目录的data.db文件
src1 = "/sdcard/脚本/DB/nply_safeExam.db"
src2 = "/sdcard/脚本/DB/nply_data.db"

let db = sqlite.open("src1", {
    version: 1
}, {
    onOpen: function(db) {
        // 数据库打开时，执行创建数据库表的语句
        // 我们设计的表名为QUESTIONE(题目)，字段如下:
        // id: 整数，自增，键
        // title: 题目，文本，非空
        // optionsA: 选项A，文本，非空
        // optionsB: 选项B，文本，非空
        // optionsC: 选项C，文本，非空
        // optionsD: 选项D，文本，非空
        // answer: 答案，文本，非空
        db.execSQL("CREATE TABLE IF NOT EXISTS QUESTION2(" +
            "`id` INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "`titleNumber` INTEGER NOT NULL, " +
            "`title` TEXT NOT NULL, " +
            "`optionsA` TEXT NOT NULL, " +
            "`optionsB` TEXT NOT NULL, " +
            "`optionsC` TEXT NOT NULL, " +
            "`optionsD` TEXT NOT NULL, " +
            "`answer` TEXT NOT NULL " +
            ")");
    }
});

// // 插入一个数据
// log("插入第一题: ", db.insert("QUESTION2", {
//     title: "张三",
//     optionsA: "a",
//     optionsB: "b",
//     optionsC: "c",
//     optionsD: "d",
//     answer: "答案是a"
// }));


// 查询数据
log("所有数据: ", db.rawQuery("SELECT * FROM QUESTION2", null).all());
log("第一个数据: ", db.rawQuery("SELECT * FROM QUESTION2", null).single());

// // 修改数据
// log("修改李四分数: ", db.update("STUDENT", {
//     score: 70
// }, "name = ?", ["李四"]));
// log("修改后李四: ", db.rawQuery("SELECT * FROM STUDENT WHERE name = ?", ["李四"]).single());

// // 删除数据
// log("删除分数>80的学生: ", db.delete("STUDENT", "score > 80", null));
// // 删除后遍历数据
// log("删除后:");
let cursor = db.rawQuery("SELECT * FROM QUESTION2", null);
while (cursor.moveToNext()) {
    log(cursor.pick());
}
// 记得关闭cursor
cursor.close();

// 还要关闭数据库
db.close();