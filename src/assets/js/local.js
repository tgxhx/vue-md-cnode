/**
 * Created by 12 on 2017/5/25.
 */
const local = {
  get: function (key) {
    return JSON.parse(localStorage.getItem(key))
  },
  set: function (key, val) {
    return localStorage.setItem(key, JSON.stringify(val))
  }
}

export default local
