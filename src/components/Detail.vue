<template>
  <div class="detail-container">
    <md-toolbar id="md-toolbar">
      <md-button class="md-icon-button"><!-- @click.native="back">-->
        <router-link :to="{path: backUrl}">
          <md-icon>arrow_back</md-icon>
        </router-link>
      </md-button>
      <h2 class="md-title">话题</h2>
    </md-toolbar>
    <side-nav ref="sidenav"></side-nav>
    <div class="topic" v-show="showDetail">
      <div class="topic-header">
        <h3>{{obj.title}}</h3>
        <div class="user">
          <div class="user-l">
            <!--<img :src="obj.author.avatar_url" alt="">-->
            <!--此处如果不使用新定义的author对象报错avatar_url未定义，原因未知-->
            <router-link :to="'/user/' + author.loginname">
              <img :src="author.avatar_url" alt="" @click>
            </router-link>
            <div class="user-name">
              <p>
                <span class="type type-top" v-if="obj.top">置顶</span>
                <span class="type type-top" v-else-if="obj.good">精华</span>
                <span v-else-if="obj.tab == 'share'">分享</span>
                <span class="type" v-else-if="obj.tab == 'ask'">问答</span>
                <span class="type" v-else-if="obj.tab == 'job'">招聘</span>
                <span v-else>分享</span>
                <!--此处如果不使用新定义的author对象报错loginname未定义-->
                <span class="name">{{author.loginname}}</span></p>
              <p><span class="create-time">{{obj.create_at | time}}创建</span>
                <span class="views">{{obj.visit_count}}次浏览</span></p>
            </div>
          </div>
          <div class="user-r">
            <md-icon v-if="collect" :class="{liked: collect}" @click.native="de_collectTopic">favorite</md-icon>
            <md-icon v-else @click.native="collectTopic('login-dialog')">favorite_border</md-icon>
          </div>
        </div>
      </div>
      <div class="topic-reply" v-html="obj.content">
      </div>
      <div class="reply-list">
        <h3 class="no-reply" v-if="obj.reply_count == 0">暂无回复</h3>
        <h3 v-else>{{obj.reply_count}}条回复</h3>
        <div class="cell" v-for="(item,index) in obj.replies">
          <div class="user">
            <div class="user-l">
              <!--<img :src="item.author.avatar_url" alt="">-->
              <router-link :to="'/user/' + item.author.loginname">
                <img :src="item.author.avatar_url" alt="" @click="userJump">
              </router-link>
              <div class="user-name">
                <p><span class="name">{{item.author.loginname}}</span></p>
                <p><span class="count">{{index + 1}}楼</span><span
                  class="reply-time">{{item.create_at | time}}</span></p>
              </div>
            </div>
            <div class="user-r">
              <md-icon @click.native="likeUp(item, 'login-dialog')" :class="{'active': item.is_uped}">thumb_up</md-icon>
              <span class="thumb_up_count">{{item.ups.length}}</span>
              <md-icon>reply</md-icon>
            </div>
          </div>
          <div class="reply-content" v-html="item.content">
          </div>
        </div>
      </div>
    </div>
    <div class="editer-wrap">
      <transition name="markdown-body">
        <mavon-editor v-model="edit_content" v-show="markdown_show" :toolbars="toolbars" @keydown=""></mavon-editor>
      </transition>
      <transition  name="markdown-cover">
        <div class="edit-cover" v-show="markdown_show" @click="markdown_show = false"></div>
      </transition>
      <transition name="markdown-btn">
        <md-icon class="reply" v-show="markdown_show" @click.native="reply">send</md-icon>
      </transition>
    </div>
    <md-spinner md-indeterminate class="loading" v-show="loading"></md-spinner>
    <button-icon :icon="'reply'" v-show="edit_show" @click.native="showMarkdown('login-dialog')"></button-icon>
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
  import scroll from '../assets/js/scroll'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1/',
        obj: {},
        author: {},
        loading: true,
        showDetail: false,
        collect: false,
        de_collect: true,
        edit_show: true,
        collectList: [],
        backUrl: '',
        markdown_show: false,
        edit_content: '',
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          mark: true, // 标记
          superscript: true, // 上角标
          quote: true, // 引用
          ol: true, // 有序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          help: true, // 帮助
          code: true, // code
          subfield: true, // 是否需要分栏
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          /* 1.3.5 */
          undo: true, // 上一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true // 导航目录
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getDetail(this.$route.query.id)
        this.getCollect()
        this.backUrl = this.detail_jump
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
      getDetail(id) {
        axios.get(`${this.url}topic/${id}`).then(res => {
          this.obj = res.data.data
//        不用本地变量保存会提示author下的属性为undefined
          this.author = res.data.data.author
          this.is_uped(this.obj.replies)
          this.loading = false
          this.showDetail = true
        })
      },
//      获取用户收藏主题，再判断当前主题是否已收藏
      getCollect(ref) {
        if (!this.loginStatus) {
          return
        }
        axios.get(this.url + 'topic_collect/' + this.loginInfo.loginname).then(res => {
          res.data.data.forEach(val => {
            this.collectList.push(val.id)
            this.collect = this.collectList.some(val => {
//              console.log(`${val}---${this.topicDetail}`)
              return val === this.topicDetail
            })
          })
        })
      },
//      收藏主题
      collectTopic(ref) {
        if (!this.loginStatus) {
          this.openDialog(ref)
          return
        }
        axios.post(`${this.url}topic_collect/collect`, {
          accesstoken: this.loginInfo.accesstoken,
          topic_id: this.$route.query.id
        }).then(res => {
          this.collect = true
        })
      },
//      取消收藏主题
      de_collectTopic() {
        axios.post(`${this.url}topic_collect/de_collect`, {
          accesstoken: this.loginInfo.accesstoken,
          topic_id: this.$route.query.id
        }).then(res => {
          this.collect = false
        })
      },
//      加载时点赞变色
      is_uped(replies) {
        replies.forEach((item) => {
          item.is_uped = item.ups.some(up => {
            return up === this.loginInfo.id
          })
        })
      },
      arrRemoveItem(arr, item) {
        return arr.slice(0, arr.indexOf(item)).concat(arr.slice(arr.indexOf(item) + 1, arr.length))
      },
//      回复点赞或取消点赞
      likeUp(item,ref) {
        if (!this.loginStatus) {
          this.openDialog(ref)
          return
        }
        axios.post(`${this.url}reply/${item.id}/ups`, {
          accesstoken: this.loginInfo.accesstoken
        }).then(res => {
          if (res.data.action === 'up') {
            item.is_uped = true
            item.ups.push(this.loginInfo.id)
          } else {
            item.is_uped = false
            item.ups = this.arrRemoveItem(item.ups, this.loginInfo.id)
          }
        })
      },
      back() {
        this.$router.back(-1)
      },
      //跳转到用户中心，保存跳转前url
      userJump() {
        const url = window.location.href.split('#')[1]
        this.$store.dispatch('userJump', url)
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
//      显示markdown编辑器
      showMarkdown(ref) {
        if (!this.loginStatus) {
          this.openDialog(ref)
          return
        }
        this.markdown_show = true
      },
//      回复当前主题
      reply() {
        axios.post(`${this.url}topic/${this.$route.query.id}/replies`, {
          accesstoken: this.loginInfo.accesstoken,
          content: this.edit_content
        }).then(res => {
          this.markdown_show = false
          this.getDetail(this.$route.query.id)
          this.edit_content = ''
        })
      }
    },
    components: {
      SideNav,
      ButtonIcon
    },
    filters: {
      time(value) {
        return format.formatMsgTime(format.getTimeStamp(value))
      },
      likeorno(value) {
        value.some(item => {
          return item === this.loginInfo.id
        })
      }
    },
    computed: {
      ...mapState([
        'topicDetail', 'loginInfo', 'loginStatus','detail_jump'
      ])
    },
    /*watch: {
     topicDetail(val, oldVal) {
     this.getDetail(val)
     }
     }*/
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  #md-toolbar {
    min-height: pr(56);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
  }

  .detail-container {
    background-color: #eee;
  }

  .topic-header {
    margin-top: pr(56);
    padding: pr(15);
    background-color: #fff;
    h3 {
      font-size: pr(18);
      font-weight: 700;
      margin-bottom: pr(20);
      line-height: 1.3;
      //      @include ell;
    }
    .user {
      display: flex;
      justify-content: space-between;
      .user-l {
        display: flex;
        a {
          display: inline-block;
          margin-right: pr(10);
          width: pr(44);
          height: pr(44);
          border-radius: pr(22);
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
          margin-left: pr(5);
          padding: pr(8) 0;
          font-size: pr(12);
          .type {
            margin-right: pr(5);
            padding: pr(3) pr(5);
            background-color: #ddd;
            color: #555;
            font-size: pr(10);
            border-radius: 3px;
          }
          .type-top {
            color: #fff;
            background-color: $baseColor;
          }
          .name {
            color: #000;
            font-size: pr(12);
          }
          .create-time {
            font-size: pr(12);
            color: #555;
            margin-right: pr(5);
            &:before {
              content: '•';
            }
          }
          .views {
            font-size: pr(12);
            color: #555;
            &:before {
              content: '•';
            }
          }
        }
      }
      .user-r {
        color: #888;
        .liked {
          color: $baseColor;
        }
      }
    }
  }

  .topic-reply {
    padding: pr(15);
    padding-top: 0;
    background-color: #fff;
    border-bottom: 2px solid #ddd;
    margin-bottom: 8px;
    h1, h2, h3, h4 {
      font-weight: bold;
    }
    h1 {
      font-size: pr(22);
      padding: pr(15) 0;
      &:first-of-type {
        font-size: pr(24);
        margin-bottom: pr(15);
        border-bottom: 1px solid #ddd;
      }
    }
    h2 {
      font-size: pr(22);
      line-height: 1.5;
      margin-bottom: pr(5);
    }
    h3 {
      font-size: pr(20);
      line-height: 1.5;
      margin-bottom: pr(5);
    }
    p, li, table {
      font-size: pr(14);
      line-height: 1.5;
      margin-bottom: pr(10);
    }
    li {
      list-style-type: disc;
      margin-left: pr(20);
    }
    code, a {
      color: dodgerblue !important;
    }
    code {
      font-size: pr(14);
      background-color: rgba(128, 186, 255, 0.2) !important;
    }
  }

  .reply-list {
    background-color: #fff;
    h3 {
      padding: pr(15);
      font-size: pr(16);
    }
    .no-reply {
      text-align: center;
    }
    .cell {
      border-top: 1px solid #eee;
      padding: pr(15);
      .user {
        display: flex;
        justify-content: space-between;
        .user-l {
          display: flex;
          a {
            display: inline-block;
            margin-right: pr(10);
            width: pr(44);
            height: pr(44);
            border-radius: pr(22);
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
            margin-left: pr(5);
            padding: pr(8) 0;
            font-size: pr(12);
            .name {
              color: #000;
              font-size: pr(12);
            }
            .count {
              font-size: pr(12);
              color: $baseColor;
              margin-right: pr(5);
            }
            .reply-time {
              font-size: pr(12);
              color: #555;
            }
          }
        }
        .user-r {
          color: #888;
          .material-icons.active {
            color: $baseColor;
          }
          .thumb_up_count {
            font-size: pr(12);
            position: relative;
            top: pr(-8);
          }
        }
      }
      .reply-content {
        padding-top: pr(5);
        font-size: pr(14px);
        line-height: 1.5;
      }
    }
  }

  .md-spinner.loading {
    position: fixed;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
  }

  .md-dialog-container.login {
    .md-dialog {
      min-width: pr(300);
      .md-dialog-title {
        font-size: pr(14);
        margin-bottom: pr(10);
        padding: pr(18) pr(24) 0;
      }
    }
  }

  .editer-wrap {
    position: relative;
    z-index: 20;
    .markdown-body {
      position: fixed;
      left:0;
      bottom:0;
      right:0;
    }
    .edit-cover {
      position: fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background-color: rgba(0,0,0, .5);
      z-index:1499;
    }
    .markdown-cover-enter-active, .markdown-cover-leave-active {
      transition: opacity .3s;
    }
    .markdown-cover-enter, .markdown-cover-leave {
      opacity: 0;
    }
    .markdown-body-enter-active, .markdown-body-leave-active {
      transition: bottom .3s;
    }
    .markdown-body-enter, .markdown-body-leave {
      bottom: -300px;
    }
    .markdown-btn-enter-active {
      transition: opacity .8s;
    }
    .markdown-btn-leave-active {
      transition: opacity .5s;
    }
    .markdown-btn-enter, .markdown-btn-leave {
      opacity: 0;
    }
    .reply {
      position: fixed;
      right:38px;
      bottom:227px;
      z-index:1501;
      color: #757575;
      font-size:20px;
    }
  }
</style>
