/**
 * set数据
 * @param {key} key
 * @param {value} value
 * @param {overtime} 超时时间
 * @return 成功set值
 * */
export function setLocalStorage(key, value, overtime) {
    const timestamp = Date.parse(new Date());
    const time = overtime + timestamp;
    const token = {
        value,
        overtime: time.toString(),
    };
    this.token = token;
    localStorage.setItem(key, JSON.stringify(token));
}
/**
 * get数据
 * @param {key} key
 * @return 成功get值
 * */
export function getLocalStorage(key) {
    const timestamp = Date.parse(new Date());
    const token = JSON.parse(localStorage.getItem(key));
    let results;
    if (!Object.is(token, null)) {
        if (parseInt(token.overtime, 10) > timestamp) {
            // 证明没过期
            results = token.value;
        }
    }
    this.token = token;
    return results;
}