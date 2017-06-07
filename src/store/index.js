/**
 * Created by 12 on 2017/5/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  tab: 'all',
  page: 1,
  showTopic: true,
  topicDetail: '',
  loginInfo: {},
  loginStatus: false,
  loginTip: false,
  userItem: 'reply',
  user_jump: '',
  detail_jump: ''
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
