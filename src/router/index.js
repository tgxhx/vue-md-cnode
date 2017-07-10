import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/topic'
    },
    {
      path: '/topic',
      name: 'Topic',
      component: resolve => require(['../components/Topic.vue'], resolve)
    },
    {
      path: '/detail',
      name: 'Detail',
      component: resolve => require(['../components/Detail.vue'], resolve)
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['../components/Login.vue'], resolve)
    },
    {
      path: '/user/:id',
      redirect: '/user/:id/reply',
      name: 'User',
      component: resolve => require(['../components/User.vue'], resolve),
      children: [
        {
          path: ':type',
          component: resolve => require(['../components/UserReply.vue'], resolve)
        }
      ]
    },
    {
      path: '/new',
      name: 'New',
      component: resolve => require(['../components/New.vue'], resolve)
    },
    {
      path: '/message',
      name: 'Message',
      component: resolve => require(['../components/Message.vue'], resolve)
    }
  ]
})
