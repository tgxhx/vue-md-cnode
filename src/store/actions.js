import * as types from './mutations-types'

export default {
  switchTab({commit}, tab) {
    commit(types.SWITCH_TAB, tab)
  },
  loadPage({commit}, num) {
    commit(types.LOAD_PAGE, num)
  },
  showTopic({commit}, bool) {
    commit(types.SHOW_TOPIC, bool)
  },
  topicDetail({commit}, id) {
    commit(types.TOPIC_DETAIL, id)
  },
  loginInfo({commit}, obj) {
    commit(types.LOGIN_INFO, obj)
  },
  loginStatus({commit}, status) {
    commit(types.LOGIN_STATUS, status)
  },
  loginTip({commit}, bool) {
    commit(types.LOGIN_TIP, bool)
  },
  userItem({commit}, type) {
    commit(types.USER_ITEM, type)
  },
  userJump({commit}, url) {
    commit(types.USER_JUMP, url)
  }
}
