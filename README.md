# vue-cnode社区

预览地址：[点此查看](http://39.108.14.248/node)
使用chrome模拟手机查看

> 基于vue全家桶的Material Design风格Cnode社区
  
>  尽量接近原生App的Material Design风格，参考了Google Play，Cnode的Android客户端。

> 另外推荐一下自己另一个vue + express + nodejs爬虫构建的整站移动书城项目:[地址](https://github.com/tgxhx/vue-reader)
  
## 技术栈
vue2 + vue-router2 + vuex + es6 + webpack + axios + scss + flex + [vue-material](https://github.com/vuematerial/vue-material)

## 描述
* 单页面应用：通过vue-router跳转
* 状态管理：使用vuex实现组件通信，也有一些父子组件使用props通信
* MD风格：使用vue-material组件库来实现高仿原生md风格
* icons：使用Google官方的[material design icon](material.io/icons/)
* markdown编辑器：[mavonEditor](https://github.com/hinesboy/mavonEditor)
* 无限滚动：[vue-mugen-scroll](https://github.com/egoist/vue-mugen-scroll) 实现思路是滚动到底部使page加1，然后通过watch监听page的变化，再获取数据通过concat凭借到原列表
* 移动端适配：在head标签通过js动态设置html标签的font-size，配合sass的自定义函数，具体可以参考[这篇文章](https://segmentfault.com/a/1190000008721148)，使用方式比如width:100px;可以写成width:pr(100);

## Build Setup

``` bash
git clone git@github.com:tgxhx/vue-md-cnode.git

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 功能
- [x] 登录
- [x] 保存登录
- [x] 注销 
- [x] 切换分类
- [x] 主题列表
- [x] 主题详情
- [x] 滚动加载
- [x] 发帖
- [x] 回复
- [ ] 回复某人
- [x] 收藏
- [x] 点赞
- [x] 个人中心 
- [x] 消息 
- [ ] 消息已读 
- [x] 移动端适配 

## 部分截图
![](http://i1.buimg.com/502037/925afb142b2d5e82.png)
![](http://i1.buimg.com/502037/3c3d61f521c2cdd0.png)
![](http://i1.buimg.com/502037/90edc6ad694d10b5.png)
![](http://i1.buimg.com/502037/1b69a056023ff385.png)
![](http://i1.buimg.com/502037/1505a95dd6819954.png)
![](http://i1.buimg.com/502037/e3d9a53a0876bb0d.png)

