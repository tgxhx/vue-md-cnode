<template>
  <md-sidenav class="md-left" ref="leftSidenav" @touchmove.prevent>
    <md-toolbar class="md-large" v-if="loginStatus">
      <md-avatar class="md-large">
        <router-link :to="'user/' + loginInfo.loginname">
          <img :src="loginInfo.avatar_url" alt="Avatar" @click="userJump">
        </router-link>
      </md-avatar>
      <div class="username">
        {{loginInfo.loginname}}
      </div>
      <div class="intro" @click="openDialog('logout-dialog')">
        注销
      </div>
    </md-toolbar>
    <md-toolbar class="md-large" v-else>
      <md-avatar class="md-large">
        <router-link :to="'Login'">
          <img src="http://freevector.co/wp-content/uploads/2013/01/80889-male-avatar-circle.png" alt="Avatar">
        </router-link>
      </md-avatar>
      <div class="username">
        点击头像登录
      </div>
      <div class="intro">
      </div>
    </md-toolbar>
    <md-list ref="list" @touchmove.prevent>
      <md-list-item @click.native="switchTab('all')">
        <md-icon class="md-primary">move_to_inbox</md-icon>
        <span>全部</span>
      </md-list-item>
      <md-list-item @click.native="switchTab('good')">
        <md-icon class="md-accent">thumb_up</md-icon>
        <span>精华</span>
      </md-list-item>
      <md-list-item @click.native="switchTab('share')">
        <md-icon md-theme="sidenav" class="md-primary">share</md-icon>
        <span>分享</span>
      </md-list-item>
      <md-list-item @click.native="switchTab('ask')">
        <md-icon md-theme="sidenav" class="md-accent">question_answer</md-icon>
        <span>问答</span>
      </md-list-item>
      <md-list-item @click.native="switchTab('job')">
        <md-icon md-theme="sidenav" class="md-warn">people</md-icon>
        <span>招聘</span>
      </md-list-item>
      <md-list-item @click.native="switchTab('dev')">
        <md-icon md-theme="sidenav" class="md-warn">people</md-icon>
        <span>测试</span>
        <md-divider class="md-inset"></md-divider>
      </md-list-item>
      <md-list-item>
        <md-icon class="md-accent">notifications</md-icon>
        <span>消息</span>
      </md-list-item>
      <md-list-item>
        <md-icon md-theme="sidenav" class="md-primary">settings</md-icon>
        <span>设置</span>
      </md-list-item>
      <md-list-item>
        <md-icon md-theme="sidenav" class="md-accent">info</md-icon>
        <span>关于</span>
      </md-list-item>
    </md-list>
    <md-dialog md-open-from="#custom" md-close-to="#custom" ref="logout-dialog" class="logout">
      <md-dialog-title>确定注销吗？</md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('logout-dialog','cancel')">取消</md-button>
        <md-button class="md-primary" @click.native="closeDialog('logout-dialog','ok')">注销</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-sidenav>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {mapState} from 'vuex'
  import local from '../assets/js/local'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1/topics',
        userinfo: {},
        confirm: {
          title: '提示',
          contentHtml: '确定注销吗？',
          ok: '注销',
          cancel: '取消'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.changeBg()
        /*if (local.get('loginInfo') != null) {
         this.$store.dispatch('loginInfo', local.get('loginInfo'))
         }*/

//        this.$store.dispatch('loginStatus', true)
      })
    },
    methods: {
      switchTab(tab) {
        if (tab === this.$store.state.tab) {
          return
        }
        this.$store.dispatch('switchTab', tab)
        this.$store.dispatch('loadPage', 1)
        this.$store.dispatch('showTopic', false)
        this.$emit('show-loading', true)
        this.$refs.leftSidenav.close()
      },
      //当前tab高亮
      changeBg() {
        document.querySelectorAll('.md-list-item').forEach((v, i) => {
          v.addEventListener('click', (e) => {
//            console.log(1)
          }, false)
        })
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref, type) {
        this.$refs[ref].close();
        if (type === 'ok') {
          localStorage.removeItem('loginInfo')
          this.$store.dispatch('loginInfo', {})
          this.$store.dispatch('loginStatus', false)
          console.log('已注销')
        }
      },
      userJump() {
        const url = window.location.href.split('#')[1]
        this.$store.dispatch('userJump', url)
      }
    },
    computed: {
      ...mapState([
        'loginInfo', 'loginStatus'
      ])
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  .md-toolbar.md-large {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 15px;
    background: url("../assets/images/sidenav_bg.png") no-repeat 100%;
    min-height: pr(150);
    .md-avatar {
      margin: pr(10) 0 0 pr(10);
    }
    .username, .intro {
      margin-left: pr(10);
    }
    .username {
      font-size: pr(14);
    }
    .intro {
      max-width: 90%;
      font-size: pr(12);
      @include ell;
    }
  }

  .md-dialog-container.logout {
    .md-dialog {
      min-width: pr(300);
      .md-dialog-title {
        font-size: pr(14);
        margin-bottom: pr(10);
        padding: pr(18) pr(24) 0;
      }
    }
  }
</style>
