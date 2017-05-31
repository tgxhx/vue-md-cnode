<template>
  <div class="user-reply">
    <div class="user-reply-cell" v-for="(item,index) in list">
      <router-link :to="{path: '/detail',query:{id:item.id}}" @click.native="openDetail(item.id)">
        <a class="user-reply-avatar">
          <img :src="item.author.avatar_url" alt="">
        </a>
        <div class="user-reply-content">
          <h3>{{item.title}}</h3>
          <div class="user-reply-name">
            <span class="user-reply-left">{{item.author.loginname}}</span>
            <span class="user-reply-right">{{item.last_reply_at | time}}</span>
          </div>
        </div>
      </router-link>
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
        msg: '111',
        list: [],
        url: 'https://cnodejs.org/api/v1/'
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.userItem !== 'collect') {
          this.getData(this.$route.params.id, this.userItem)
        } else {
            this.getCollect(this.$route.params.id)
        }
      })
    },
    filters: {
      time(value) {
        return format.formatMsgTime(format.getTimeStamp(value))
      }
    },
    methods: {
      getData(id, type) {
        axios.get(this.url + 'user/' + id).then(res => {
          if (type === 'reply') {
            this.list = res.data.data.recent_replies
          } else if (type === 'publish') {
            this.list = res.data.data.recent_topics
          }
        })
      },
      getCollect(id) {
        axios.get(this.url + 'topic_collect/' + id).then(res => {
          this.list = res.data.data
        })
      },
      openDetail(id) {
        this.$store.dispatch('topicDetail', id)
      }
    },
    computed: {
      ...mapState([
        'userItem'
      ])
    },
    watch: {
      $route(to, from) {
        this.msg = to.params.type
        if (to.params.type === 'reply') {
          this.getData(to.params.id, 'reply')
//          console.log('route reply')
        } else if (to.params.type === 'publish') {
          this.getData(to.params.id, 'publish')
//          console.log('route publish')
        } else {
          this.getCollect(to.params.id)
//          console.log('route collect')
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";

  .user-reply {
    .user-reply-cell {
      /*justify-content:space-between;*/
      font-size: pr(14);
      padding: pr(15);
      border-bottom: 1px solid #ddd;
      a {
        display: flex;
        .user-reply-avatar {
          display: inline-block;
          width: pr(40);
          height: pr(40);
          margin-right: pr(15);
          border-radius: pr(20);
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .user-reply-content {
          flex: 1;
          //不设置overflow或者width:0就会移到左边并且左边头像宽度为0，原因未知
          overflow: hidden;
          /*width: 0;*/
          h3 {
            /*width:80%;*/
            height: pr(24);
            color: #333;
            @include ell;
          }
          .user-reply-name {
            display: flex;
            justify-content: space-between;
            font-size: pr(12);
            color: #555;
          }
        }
      }
    }
  }
</style>
