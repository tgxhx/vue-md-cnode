<template>
  <div class="new-topic">
    <md-toolbar id="md-toolbar">
      <md-button class="md-icon-button"> <!--@click.native="back">-->
        <router-link :to="'Topic'">
          <md-icon>arrow_back</md-icon>
        </router-link>
      </md-button>
      <h2 class="md-title" style="flex: 1;">发布话题</h2>
      <md-button class="md-icon-button">
        <md-icon @click.native="newTopic">send</md-icon>
      </md-button>
    </md-toolbar>
    <div class="send-cate">
      <span>发布到分类</span>
      <select name="" v-model="category">
        <option value="share">分享</option>
        <option value="ask">问答</option>
        <option value="job">招聘</option>
        <option value="dev">测试</option>
      </select>
    </div>
    <div class="send-title">
      <input type="text" v-model="title" placeholder="标题，字数10字以上">
    </div>
    <div class="send-wrap">
      <mavon-editor v-model="send_content" :toolbars="toolbars" @keydown=""></mavon-editor>
    </div>
    <md-dialog-alert
      :md-content="alert.content"
      :md-ok-text="alert.ok"
      ref="blank"
      id="blank">
    </md-dialog-alert>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1',
        category: 'dev',
        title: '',
        send_content: '',
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
        },
        alert: {
          content: '内容不能为空',
          ok: '确定'
        }
      }
    },
    methods: {
      newTopic() {
        console.log(this.loginInfo)
        if (this.title === '') {
          this.alert = {
            content: '标题不能为空',
            ok: '确定'
          }
          this.openDialog('blank')
          return
        } else if (this.send_content === '') {
          this.alert = {
            content: '内容不能为空',
            ok: '确定'
          }
          this.openDialog('blank')
          return
        }
        axios.post(`${this.url}/topics`, {
          accesstoken: this.loginInfo.accesstoken,
          tab: this.category,
          title: this.title,
          content: this.send_content
        }).then(res => {
          this.$router.push({path: 'topic', query: {tab: 'dev'}})
        })
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
    },
    computed: {
      ...mapState([
        'loginInfo'
      ])
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  body {
  }

  .send-cate {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: pr(0) pr(15);
    margin-top: pr(56);
    height: pr(56);
    font-size: pr(16);
    border-bottom: 1px solid #c0c0c0;
    background-color: #fff;
    span {
      width: pr(120);
    }
    select {
      flex: 1;
      border: none;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
      padding-right: 14px;
      &:focus {
        border: none;
        outline: none;
      }
      option {
        height: 30px;
        line-height: 1.5;
      }
    }
  }

  .send-title {
    display: flex;
    align-items: center;
    padding: pr(15);
    height: pr(56);
    border-bottom: 1px solid #c0c0c0;
    background-color: #fff;
    input {
      flex: 1;
      height: 30px;
      border: none;
      &:focus {
        border: none;
        outline: none;
      }
    }
  }

  #blank {
    z-index: 1505;
    .md-dialog {
      min-width: 6rem;
    }
    .md-dialog-content {
      font-size: pr(14);
      padding-bottom: pr(3);
      /*margin-bottom:0.2rem;
      padding:0.36rem 0.48rem 0;
      background: #fff;*/
    }
  }
</style>
