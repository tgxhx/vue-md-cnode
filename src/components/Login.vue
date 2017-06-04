<template>
  <div class="login">
    <div class="login-header">
      <md-toolbar id="md-toolbar">
        <md-button class="md-icon-button" @click.native="back">
          <md-icon>arrow_back</md-icon>
        </md-button>
        <h2 class="md-title">登录</h2>
      </md-toolbar>
    </div>
    <div class="login-panel" :class="{'login-focus': isTop}">
      <label class="login-label" ref="label">Access Token:</label>
      <input class="token" type="text" v-model="access_token" @focus="labelTop(true)" @blur="labelTop(false)">
      <p v-show="!errorInfo.success">{{errorInfo.error_msg}}</p>
      <button class="login-btn" @click="login">登录</button>
      <div class="login-option">
        <div class="qr-login"><i class="iconfont">&#xe698;</i>扫码登录</div>
        <div class="github-logi"><i class="iconfont">&#xe678;</i>GitHub登录</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {mapState} from 'vuex'
  import local from '../assets/js/local'

  export default {
    data() {
      return {
        access_token: '',
        errorInfo: {success: true},
        isTop: false
      }
    },
    methods: {
      back() {
        this.$router.back(-1)
      },
      login(){
        axios.post(`https://cnodejs.org/api/v1/accesstoken?accesstoken=${this.access_token}`).then(res => {
          res.data.accesstoken = this.access_token
          this.$store.dispatch('loginInfo', res.data)
          local.set('loginInfo', res.data)
          this.$store.dispatch('loginStatus', true)
          this.$store.dispatch('loginTip', true)
          this.$router.back(-1)
        }).catch(res => {
          this.errorInfo = res.response.data
        })
      },
      labelTop(bool) {
        bool
          ? this.isTop = true
          : !this.access_token
            ? this.isTop = false
            : ''
        /*if (bool) {
         this.isTop = true
         } else {
         if (!this.access_token) {
         this.isTop = false
         }
         }*/
      },
    },
    computed: {
      ...mapState([
        'loginInfo'
      ])
    },
    watch: {
      access_token(val, oldVal) {
        this.errorInfo.success = true
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  body {
    background-color: #f8f8f8 !important;
  }

  .login-header {
    height: pr(220);
    background-image: url("../assets/images/login_bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    .md-toolbar {
      background: transparent !important;
    }
  }

  .login-panel {
    width: 90%;
    /*height:pr(200);*/
    margin: 0 auto;
    position: relative;
    top: pr(-50);
    padding: pr(30) pr(20);
    font-size: pr(16);
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px #ccc, 0 0 1px #ccc, 0 0 1px #ccc;
    &.login-focus {
      .login-label {
        color: $baseColor;
        transform: scale(0.85, 0.85) translateY(-(pr(20)));
      }
    }
    .login-label {
      position: absolute;
      font-size: pr(14);
      top: pr(35);
      z-index: 0;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      transition-duration: .3s;
      -webkit-transition-property: color, -webkit-transform;
      transition-property: color, -webkit-transform;
      transition-property: color, transform;
      transition-property: color, transform, -webkit-transform;
      transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    }
    .token {
      display: block;
      width: 100%;
      border: none;
      padding: pr(5) 0;
      border-bottom: 2px solid $baseColor;
      z-index: 1;
      &:focus {
        outline: none;
      }
    }
    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: pr(35);
      font-size: pr(14);
      background-color: $baseColor;
      color: #fff;
      border: none;
      margin-top: pr(20);
      border-radius: pr(2);
    }
    .login-option {
      display: flex;
      justify-content: space-between;
      margin-top: pr(20);
      padding: 0 pr(10);
      font-size: pr(14);
      .iconfont {
        font-family: "iconfont";
        font-size: pr(14);
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
        margin-right: pr(10);
      }
    }
  }
</style>
