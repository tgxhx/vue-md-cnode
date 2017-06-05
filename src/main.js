// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index'
import VueMaterial from 'vue-material'
import format from './assets/js/format'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Object.defineProperty(Vue.prototype, '$format', {value: format})

Vue.use(mavonEditor)
Vue.use(VueMaterial)
Vue.material.registerTheme({
  default: {
    primary: {
      color: 'green',
      hue: 700
    },
    accent: {
      color: 'red',
      hue: 700
    },
  },
  sidenav: {
    primary: {
      color: 'blue',
      hue: 700
    },
    accent: {
      color: 'red',
      hue: 700
    },
    warn: {
      color: 'orange',
      hue: 700
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
