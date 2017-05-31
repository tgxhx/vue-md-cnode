<template>
  <md-sidenav class="md-left" ref="leftSidenav" @touchmove.prevent>
    <md-toolbar class="md-large" v-if="loginStatus">
      <md-avatar class="md-large">
        <router-link :to="'user/' + loginInfo.loginname">
          <img :src="loginInfo.avatar_url" alt="Avatar">
        </router-link>
      </md-avatar>
      <div class="username">
        {{loginInfo.loginname}}
      </div>
      <div class="intro" @click="logout">
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
  </md-sidenav>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1/topics',
        userinfo: {
          avatar: 'https://avatars0.githubusercontent.com/u/5463739?v=3&s=120',
          name: '张三',
          intro: '“ 这家伙很懒，什么个性签名都没有留下。 ”'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.changeBg()
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
      changeBg() {
        document.querySelectorAll('.md-list-item').forEach((v, i) => {
          v.addEventListener('click', (e) => {
//            console.log(1)
          }, false)
        })
      },
      logout() {
          localStorage.removeItem('loginInfo')
      }
    },
    computed: {
      ...mapState([
        'loginInfo','loginStatus'
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
</style>
