<template>
  <div class="user-info">
    <div class="user-header">
      <md-toolbar id="md-toolbar">
        <router-link :to="{path: backUrl}">
          <md-button class="md-icon-button"> <!--@click.native="back">-->
            <md-icon>arrow_back</md-icon>
          </md-button>
        </router-link>
      </md-toolbar>
      <div class="user-avatar">
        <div class="avatar">
          <img :src="user.avatar_url" alt="">
        </div>
      </div>
      <div class="user-name">
        {{user.loginname}}
      </div>
      <div class="user-mail">
        <a :href="'https:/\/github.com/' + user.loginname" target="_blank">{{user.loginname}}@github.com</a>
      </div>
      <div class="reg-info">
        <span class="reg-time">注册时间：{{user.create_at | regTime}}</span>
        <span class="score">积分：{{user.score}}</span>
      </div>
    </div>
    <div class="user-nav">
      <div class="nav-title" @click="userItem('reply')">
        <router-link :to="'/user/' + user.loginname + '/reply'">
          最新回复
        </router-link>
      </div>
      <div class="nav-title" @click="userItem('publish')">
        <router-link :to="'/user/' + user.loginname + '/publish'">
          最新发布
        </router-link>
      </div>
      <div class="nav-title" @click="userItem('collect')">
        <router-link :to="'/user/' + user.loginname + '/collect'">
          话题收藏
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1/user/',
        user: {},
        backUrl: ''
      }
    },
    mounted() {
      this.getData(this.$route.params.id)
      this.backUrl = this.user_jump
    },
    filters: {
      regTime(value) {
//          return value.substr(0,10)
      }
    },
    methods: {
      back() {
        this.$router.back(-1)
      },
      getData(name) {
        axios.get(this.url + name).then(res => {
          this.user = res.data.data
        })
      },
      userItem(type) {
        this.$store.dispatch('userItem', type)
      }
    },
    computed: {
      ...mapState([
        'user_jump'
      ])
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  .user-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: pr(15) 0 pr(10);
    height: pr(200);
    background-image: url("../assets/images/user_bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    color: #fff;
    .md-toolbar {
      background: transparent !important;
      a:not(.md-button) {
        color: #fff;
      }
    }
    .avatar {
      /*margin-top:pr(25);*/
      width: pr(80);
      height: pr(80);
      border-radius: pr(40);
      overflow: hidden;
      img {
        display: block;
        vertical-align: bottom;
        width: 100%;
        height: 100%;
      }
    }
    .user-name {
      font-size: pr(16);
      text-align: center;
      /*margin-top:pr(8);*/
    }
    .user-mail {
      font-size: pr(14);
      /*margin-top:pr(8);*/
      a {
        color: #eee !important;
        text-decoration: underline;
      }
    }
    .reg-info {
      width: 90%;
      /*margin-top:pr(15);*/
      display: flex;
      justify-content: space-between;
      span {
        font-size: pr(12);
        &.score {
          color: $baseColor;
        }
      }
    }
  }

  .user-nav {
    display: flex;
    height: pr(35);
    background-color: #333;
    .nav-title {
      flex: 1;
      font-size: pr(14);
      color: #ddd;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: pr(12);
        box-sizing: border-box;
        color: #ddd !important;
        &:hover {
          color: #fff !important;
          border-bottom: pr(2) solid $baseColor;
        }
      }
    }
  }
</style>
