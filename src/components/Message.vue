<template>
  <div>
    <md-toolbar id="md-toolbar">
      <md-button class="md-icon-button"> <!--@click.native="back">-->
        <router-link :to="'Topic'">
          <md-icon>arrow_back</md-icon>
        </router-link>
      </md-button>
      <h2 class="md-title" style="flex: 1;">消息</h2>
      <md-button class="md-icon-button">
        <md-icon>done_all</md-icon>
      </md-button>
    </md-toolbar>
    <div class="message-list">
      <div class="message-cell" v-for="(item,index) in readMsgList" @click="detailJump(item.topic.id)">
        <div class="msg-title">
          <div class="msg-user">
            <router-link :to="'user/' + item.author.loginname">
              <img :src="item.author.avatar_url" alt="" @click.stop="userJump">
            </router-link>
            <div class="msg-name">
              <p>{{item.author.loginname}}</p>
              <p>在回复中@了您</p>
            </div>
          </div>
          <span class="msg-time">{{item.create_at | time}}</span>
        </div>
        <div class="msg-content" v-html="item.reply.content"></div>
        <div class="msg-topic">
          话题：{{item.topic.title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {mapState} from 'vuex'
  import format from '../assets/js/format'

  export default {
    data() {
      return {
        url: 'https://cnodejs.org/api/v1',
        readMsgList: [],
        notReadMsgList: []
      }
    },
    computed: {
      ...mapState([
        'loginInfo'
      ])
    },
    created() {
      this.getMessage()
    },
    mounted() {
      this.$nextTick(() => {

      })
    },
    methods: {
      getMessage() {
        axios.get(`${this.url}/messages?accesstoken=${this.loginInfo.accesstoken}`).then(res => {
          this.readMsgList = res.data.data.has_read_messages
          this.readMsgList.forEach(v => {
            v.reply.content = v.reply.content.replace(`/user/${this.loginInfo.loginname}`, 'javascript:')
          })
          this.notReadMsgList = res.data.data.hasnot_read_messages
        })
      },
      userJump() {
        this.$store.dispatch('userJump', '/message')
      },
      detailJump(id) {
        const url = window.location.href.split('#')[1]
        this.$store.dispatch('detailJump', url)
        this.$router.push({path: 'detail', query: {id: id}})
      }
    },
    filters: {
      time(value) {
        return format.formatMsgTime(format.getTimeStamp(value))
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  img[src=""] {
    opacity: 0;
  }

  .message-list {
    padding-top: pr(56);
  }

  .message-cell {
    padding: pr(15);
    font-size: pr(16);
    border-bottom: 1px solid #d7d7d7;
    .msg-title {
      display: flex;
      justify-content: space-between;
      .msg-user {
        display: flex;
      }
      a {
        display: inline-block;
        width: pr(44);
        height: pr(44);
        border-radius: pr(22);
        background-color: #ddd;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .msg-name {
        margin-left: pr(15);
        p {
          &:first-of-type {
            margin-top: pr(2);
          }
          &:last-of-type {
            margin-top: pr(8);
            color: #888;
            font-size: pr(12);
          }
        }
      }
      .msg-time {
        margin-top: pr(5);
        font-size: pr(14);
        color: #888;
      }
    }
    .msg-content {
      font-size: pr(14);
      padding: pr(15) 0 pr(15);
      line-height: 1.5;
    }
    .msg-topic {
      padding: pr(10) pr(10);
      font-size: pr(12);
      color: #888;
      background-color: #ddd;
      @include ell;
    }
  }
</style>
