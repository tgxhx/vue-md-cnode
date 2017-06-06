import Vue from 'vue'
import Router from 'vue-router'
import Topic from '../components/Topic'
import Detail from '../components/Detail'
import Login from '../components/Login'
import User from '../components/User'
import UserReply from '../components/UserReply'
import New from '../components/New'

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
      component: Topic
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user/:id',
      redirect: '/user/:id/reply',
      name: 'User',
      component: User,
      children:[
        {
          path: ':type',
          component: UserReply
        }
      ]
    },
    {
      path: '/new',
      name: 'New',
      component: New
    }
  ]
})
