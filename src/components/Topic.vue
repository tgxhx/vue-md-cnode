<template>
  <div class="topic-container">
    {{$route.params.id}}
    <md-toolbar id="md-toolbar">
      <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title">{{tab | formatTitle}}</h2>
    </md-toolbar>
    <side-nav ref="sidenav" @show-loading="showLoading"></side-nav>
    <div class="topic-list" v-show="showTopic">
      <div class="cell" v-for="(item,index) in list" :data-href="item.id">
        <router-link :to="{path:'detail',query:{id:item.id}}" @click.native="openDetail(item.id)">
          <div class="header">
            <span class="type-top" v-if="item.top">置顶</span>
            <span class="type-top" v-else-if="item.good">精华</span>
            <span v-else-if="item.tab == 'share'">分享</span>
            <span v-else-if="item.tab == 'ask'">问答</span>
            <span v-else-if="item.tab == 'job'">招聘</span>
            <span v-else>分享</span>
            <h3>{{item.title}}</h3>
          </div>
          <div class="content">
            <div class="user-info">
              <!--<router-link :to="{path: 'user', query:{name:item.author.loginname}}">-->
              <router-link :to="'user/' + item.author.loginname">
                <img :src="item.author.avatar_url" alt="" @click="userJump">
              </router-link>
              <div class="user-name">
                <span>{{item.author.loginname}}</span>
                <p>创建于：{{item.create_at | createTime}}</p>
              </div>
            </div>
            <div class="replies">
            <span><span class="reply">{{item.reply_count}}</span> /
              <span class="view">{{item.visit_count}}</span></span>
              <p>{{item.last_reply_at | time}}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <md-spinner md-indeterminate class="loading" v-show="loading"></md-spinner>
    <div class="bottom-loading" v-show="b_loading">
      <md-spinner :md-size="30" md-indeterminate class="bottom"></md-spinner>
    </div>
    <transition name="fade">
      <button-icon :icon="'edit'" v-show="edit_show"></button-icon>
    </transition>
    <div class="login-info" v-if="login_tip">登录成功</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SideNav from './SideNav.vue'
  import ButtonIcon from './ButtonIcon.vue'
  import axios from 'axios'
  import {mapState} from 'vuex'
  import format from '../assets/js/format'
  import local from '../assets/js/local'
  import scroll from '../assets/js/scroll'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1/topics',
        list: [],
        loading: true,
        b_loading: false,
        login_tip: false,
        edit_show: true
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getData('all')
        window.addEventListener('scroll', this.more)
        this.$store.dispatch('loginInfo', local.get('loginInfo'))
        this.login_tip = this.loginStatus
        setTimeout(() => {
          this.login_tip = false
        }, 3000)
        scroll((direction) => {
          if (direction === 'down') {
//            setTimeout(() => {
              this.edit_show = false
//            },200)
          } else {
            setTimeout(() => {
              this.edit_show = true
            },200)
          }
        })
      })
    },
    methods: {
      toggleLeftSidenav() {
        this.$refs.sidenav.$refs.leftSidenav.toggle();
      },
      getData(tab) {
        axios.get(`${this.url}?limit=20&tab=${tab}`).then(res => {
          this.list = res.data.data
          this.loading = false
          this.$store.dispatch('showTopic', true)
        })
      },
      openDetail(id) {
        this.$store.dispatch('topicDetail', id)
      },
      more() {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (scrolled + window.screen.height >= (document.body.scrollHeight)) {
          this.$store.dispatch('loadPage')
        }
        if (document.body.scrollTop >= 1000) {
          this.b_loading = true
        }
      },
      showLoading(val) {
        this.loading = val
//        console.log(1)
      },
      userJump() {
        const url = window.location.href.split('#')[1]
        this.$store.dispatch('userJump', url)
      }
    },
    filters: {
      formatTitle(value) {
        switch (value) {
          case 'all':
            return 'CNode社区'
          case 'good':
            return '精华'
          case 'share':
            return '分享'
          case 'ask':
            return '问答'
          case 'job':
            return '招聘'
          default:
            return 'CNode社区'
        }
      },
      time(value) {
        return format.formatMsgTime(format.getTimeStamp(value))
      },
      createTime(value) {
        return value.substr(0, value.length - 5).replace(/T/g, ' ')
      }
    },
    components: {
      SideNav,
      ButtonIcon
    },
    computed: {
      ...mapState([
        'tab', 'page', 'showTopic', 'loginStatus'
      ])
    },
    watch: {
      tab(val, oldVal) {
        this.getData(val)
//        this.$store.dispatch('showTopic', true)
      },
      page(val, oldVal) {
        axios.get(`${this.url}?limit=20&tab=${this.tab}&page=${val}`).then(res => {
          this.list = this.list.concat(res.data.data)
        })
      }
    }
  };
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  .md-theme-default.md-toolbar {
    background-color: $baseColor !important;
  }

  .md-theme-default a:not(.md-button) {
    &:hover {
      color: #444;
      text-decoration: none;
    }
    .header {
      h3 {
        color: #444;
      }
    }
  }

  .md-sidenav .md-sidenav-content {
    width: pr(304);
    position: fixed;
  }

  #md-toolbar {
    min-height: pr(56);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    > .md-button {
      a {
        color: #fff;
      }
    }
  }

  .topic-list {
    margin-top: pr(56);
    .cell {
      padding: pr(15) pr(10);
      border-bottom: 1px solid #ddd;
      &:last-child {
        border-bottom: none;
      }
      .header {
        display: flex;
        align-items: center;
        margin-bottom: pr(5);
        span {
          margin-right: pr(5);
          padding: pr(5);
          color: #444;
          background-color: #ddd;
          border-radius: pr(3);
          font-size: pr(12);
          &.type-top {
            color: #fff;
            background-color: $baseColor;
          }
        }
        h3 {
          width: 85%;
          line-height: pr(30);
          @include ell;
          font-size: pr(16);
        }
      }
      .content {
        display: flex;
        justify-content: space-between;
        .user-info {
          display: flex;
          a {
            display: inline-block;
            width: pr(40);
            height: pr(40);
            border-radius: pr(20);
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .user-name {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 5px;
            padding: 3px 0;
            span {
              font-size: pr(12);
              color: #333;
            }
            p {
              font-size: pr(14);
              color: #666;
            }
          }
        }
        .replies {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 5px;
          padding: 3px 0;
          > span {
            font-size: pr(12);
            color: #333;
            text-align: right;
            .reply {
              color: $baseColor;
            }
          }
          p {
            font-size: pr(14);
            color: #666;
            text-align: right;
          }
        }
      }
    }
  }

  .md-spinner.loading {
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
  }

  .bottom-loading {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .login-info {
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: pr(100);
    font-size: pr(16);
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    padding: pr(6) pr(10);
    border-radius: pr(20);
    transition: all .5s;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

</style>
