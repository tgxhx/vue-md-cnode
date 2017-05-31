/**
 * Created by 12 on 2017/5/21.
 */
const format = {
  getTimeStamp: function (dataArr) {
    return new Date(dataArr).getTime()
  },
  formatMsgTime: function (timespan) {
    let min = 1000 * 60,
      hour = min * 60,
      day = hour * 24,
      month = day * 30,
      year = month * 12

    let now = Date.now()
    let diff = now - timespan

    let yearC = diff /year,
      monthC = diff / month,
      dayC = diff / day,
      hourC = diff / hour,
      minC = diff / min

    let result = ''
    if(yearC >=1) {
      result = `${parseInt(yearC)}年前`
    }else if (monthC >= 1) {
      result = `${parseInt(monthC)}个月前`
    } else if (dayC >= 1) {
      result = `${parseInt(dayC)}天前`
    } else if (hourC >= 1) {
      result = `${parseInt(hourC)}小时前`
    } else if (minC >= 1) {
      result = `${parseInt(minC)}分钟前`
    } else {
      result = '刚刚'
    }
    return result
  }
}

export default format
