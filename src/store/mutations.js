/**
 * Created by 12 on 2017/5/21.
 */
import * as types from './mutations-types'

export default {
  [types.SWITCH_TAB](state, tab) {
    state.tab = tab
  },
  [types.LOAD_PAGE](state, num) {
    if (num) {
      state.page = num
    } else {
      state.page++
    }
  },
  [types.SHOW_TOPIC](state, bool) {
    state.showTopic = bool
  },
  [types.TOPIC_DETAIL](state, id) {
    state.topicDetail = id || '5433d5e4e737cbe96dcef312'
  },
  [types.LOGIN_INFO](state, obj) {
    state.loginInfo = obj
  },
  [types.LOGIN_STATUS](state, status) {
    state.loginStatus = status
  },
  [types.LOGIN_TIP](state, bool) {
    //登陆成功提示，三秒后消失
    state.loginTip = bool
    setTimeout(() => {
        state.loginTip= false
    },3000)
  },
  [types.USER_ITEM](state, type) {
    state.userItem = type
  },
  [types.USER_JUMP](state, url) {
    state.user_jump = url
  },
  [types.DETAIL_JUMP](state,url) {
    state.detail_jump = url
  }
}
