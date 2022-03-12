/* export function formateDate (time) {
    if (!time) {
        return '';
    }
    let date = new Date (time);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
} */

export function formateDate(time) {//没有用default就代表是 分别暴露的。引入时候要加{}。     default是默认暴露/整体暴露的。         
    //formate是格式化的意思。  向ormateDate函数中传入实参Date.now()。
    if (!time) return ''  //如果没传，返回一个空串。
    let date = new Date(time)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() //老外的月份是从0开始的，所以要加1。
      + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  }