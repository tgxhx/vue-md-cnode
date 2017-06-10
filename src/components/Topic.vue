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
      <div class="cell" v-for="(item,index) in list" :data-href="item.id" @click="openDetail(item.id)">
        <!--<router-link :to="{path:'detail',query:{id:item.id}}" @click.native="openDetail(item.id)">-->
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
              <img :src="item.author.avatar_url" alt="" @click.stop="userJump">
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
        <!--</router-link>-->
      </div>
    </div>
    <!--加载时圆圈-->
    <md-spinner md-indeterminate class="loading" v-show="loading"></md-spinner>
    <mugen-scroll class="bottom-loading" :handler="fetchMoreData" :should-handle="!mugen_loading">
      <!--到底部时加载圆圈-->
      <md-spinner v-show="bottom_loading" :md-size="30" md-indeterminate class="bottom"></md-spinner>
    </mugen-scroll>
    <transition name="fade-btn">
      <!--底部新增主题按钮-->
      <button-icon :icon="'edit'" v-show="edit_show" @click.native="newTopic('login-dialog')"
                   ref="edit_btn"></button-icon>
    </transition>
    <!--登录成功提示，三秒后消失-->
    <div class="login-info" v-if="loginTip">登录成功</div>
    <md-dialog md-open-from="#custom" md-close-to="#custom" ref="login-dialog" class="login">
      <md-dialog-title>该操作需要登录账户，是否现在登录？</md-dialog-title>
      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('login-dialog','cancel')">取消</md-button>
        <md-button class="md-primary" @click.native="closeDialog('login-dialog','ok')">登录</md-button>
      </md-dialog-actions>
    </md-dialog>
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
  import MugenScroll from 'vue-mugen-scroll'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1/topics',
        list: [],
        loading: true,
        login_tip: false,
        edit_show: true,
        mugen_loading: false,
        bottom_loading: false,
      }
    },
    computed: {
      ...mapState([
        'tab', 'page', 'showTopic', 'loginStatus', 'loginTip'
      ])
    },
    created() {
      console.log(this.$route.query)
    },
    mounted() {
      this.$nextTick(() => {
        this.getData(this.$route.query.tab || 'all')
//        window.addEventListener('scroll', this.more)

        //设置初始页数
        this.$store.dispatch('loadPage', 1)

        if (local.get('loginInfo') != null) {
          this.$store.dispatch('loginInfo', local.get('loginInfo'))
          this.$store.dispatch('loginStatus', true)
        }
        document.body.scrollTop = 0

//        判断滚动方向
        scroll((direction) => {
          if (direction === 'down') {
            setTimeout(() => {
              this.edit_show = false
            }, 200)
          } else {
            setTimeout(() => {
              this.edit_show = true
            }, 200)
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
//          防止数据未加载完时显示底部圈
          this.bottom_loading = true
          this.$store.dispatch('showTopic', true)
        })
      },
      openDetail(id) {
        this.$store.dispatch('topicDetail', id)
        const url = window.location.href.split('#')[1]
        this.$store.dispatch('detailJump', url)

        this.$router.push({path: 'detail', query: {id: id}})
      },
      /*more() {
       let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
       if (scrolled + window.screen.height >= (document.body.scrollHeight)) {
       this.$store.dispatch('loadPage')
       }
       if (document.body.scrollTop >= 1000) {
       this.b_loading = true
       }
       },*/
      fetchMoreData() {
        this.mugen_loading = true
        //滚动到底获取新一页
        this.$store.dispatch('loadPage')
        //
        this.mugen_loading = false
      },
      //子组件sideNave的自定义事件
      showLoading(val) {
        this.loading = val
        console.log(1)
      },
      //跳转到用户中心，保存跳转前url
      userJump() {
        const url = window.location.href.split('#')[1]
        this.$store.dispatch('userJump', url)
      },
      //打开新增主题组件
      newTopic(ref) {
        if (!this.loginStatus) {
          this.openDialog(ref)
          return
        }
        this.$router.push('new')
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref, type) {
        this.$refs[ref].close();
        if (type === 'ok') {
          this.$router.push('/Login')
        }
      },
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
          case 'dev':
            return '测试'
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
      ButtonIcon,
      MugenScroll
    },
    watch: {
      tab(val, oldVal) {
        this.getData(val)
        console.log(this.$route)
//        this.$store.dispatch('showTopic', true)
      },
      page(val, oldVal) {
        if (val === 1) {
          return
        }
//       页面加载是会获取两次是因为滚动组件的问题，自动提交action让page加1
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
      transition: all 0s;
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

  .fade-btn-enter-active, .fade-btn-leave-active {
    transition: all .5s;
  }

  .fade-btn-enter, .fade-btn-leave-active {
    /*opacity: 0;*/
    opacity: 0;
  }

</style>
