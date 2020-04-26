class indexDB{
    constructor(){
        this.db = "";
    }
    /**
     * 打开数据库创建表
     * @param {dbName} 数据库名称
     * @param {dbVersion} 数据库版本
     * @param {tableName} 表名称
     * @param {mainKey} 主键id
     * @param {dataList} 表list
     * @return 是否有表
     * */
    openDB(dbMes){
        const self = this;
        return new Promise((res,ref)=>{
            const request = window.indexedDB.open(dbMes.dbName, dbMes.dbVersion);
            // 当打开数据库连接失败调用方法
            request.onerror = function (event) {
                ref("数据库打开报错");
            };
            // 打开数据库连接成功调用方法
            request.onsuccess = function (event) {
                // 给db数据库赋值
                self.db = request.result;
                // console.log(event.target.result === request.result); // 从event中取数据库和从request中取数据库相同
                res("数据库打开成功");
            };
            // 升级数据库或者新建连接数据库（如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件）
            request.onupgradeneeded = function (event) {
                // 给db数据库赋值
                self.db = request.result;
                // 定义一个表
                let objectStore;
                if (!self.db.objectStoreNames.contains(dbMes.tableName)){
                    // 创建表（新增一张叫做该name的表格，主键是id）
                    const objectStore = self.db.createObjectStore(dbMes.tableName, {keyPath: dbMes.mainKey});
                    // 创建索引（索引名称、索引所在的属性、配置对象——该属性是否包含重复的值）
                    dbMes.dataList.forEach((item, index) => {
                        objectStore.createIndex(item.indexName, item.indexType, {unique: item.unique});
                    });
                }
                // res("数据升级成功");
            };
        });
    }

    /**
     * 添加数据
     * @param {tableName} 表名称
     * @param {data} 数据
     * @return 添加成功
     * */
    addData(data) {
        const self = this;
        return new Promise((res,ref)=>{
            // 新建一个事务,指定表格名称和操作模式（"只读"或"读写"）
            let request = self.db.transaction([data.tableName], "readwrite")
            // 拿到 IDBObjectStore 对象
                .objectStore(data.tableName)
                // 表格对象的add()方法，向表格写入一条记录
                .add(data.data);
            // 插入成功触发方法
            request.onsuccess = function (event) {
                res("数据写入成功");
            };
            // 插入失败触发方法
            request.onerror = function (event) {
                res("数据写入失败");
            };
        });
    }

    /**
     * 读取数据库
     * @param {tableName} 表名称
     * @param {id} id
     * @return 读取成功
     * */
    readData(read) {
        const self = this;
        return new Promise((res,ref)=>{
        // 创建一个db表person的事务
            let transaction = self.db.transaction([read.tableName]);
            // 拿到 IDBObjectStore 对象
            let objectStore = transaction.objectStore(read.tableName);
            // 读取id为1的数据
            let request = objectStore.get(read.id);
            request.onerror = function(event) {
                console.log("事务失败");
            };
            request.onsuccess = function(event) {
                if (request.result) {
                    res(request.result);
                } else {
                    res("读取失败");
                }
            };
        });
    }
    /**
     * 删除存储空间全部记录
     * @param {tableName} 表名称
     * @return 读取成功
     * */
    clearData(tableName){
        const self = this;
        return new Promise((res,ref)=>{
            self.db.transaction(tableName,"readwrite").objectStore(tableName).clear();
            res("已删除存储空间"+tableName+"全部记录");
        });
    }

    /**
     * 根据索引查询
     * @param {tableName} 表名称
     * @param {key} 要查询的字段
     * @param {value} 字段是多少
     * @return 读取成功
     * */
    suoyin(read) {
        const self = this;
        return new Promise((res,ref)=>{
            let transaction = self.db.transaction([read.tableName], "readonly");
            let store = transaction.objectStore(read.tableName);
            // 根据name查询
            let index = store.index(read.key);
            // 查询叫李四的
            let request = index.get(read.value);
            request.onsuccess = function (e) {
                let result = e.target.result;
                if (result) {
                    res(result);
                } else {
                    res("读取失败");
                }
            };
        });
    }

}

export default indexDB;