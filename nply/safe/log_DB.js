src2 = "/sdcard/脚本/DB/nply_data.db"
let db = sqlite.open(src2);

console.show();

log("数据库版本: ", db.version);
log("数据库页大小: ", db.pageSize);
log("数据库最大大小: ", db.maximumSize);
log("数据库路径: ", db.path);

log("数据库所有表的信息: ", db.rawQuery("SELECT * FROM sqlite_master WHERE type='table'", null).all());
