<template>
  <div class="edit-btn" ref="edit_btn">
    <md-icon>{{icon}}</md-icon>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
      props: ['icon']
  }
</script>

<style lang="scss" type="text/scss">
  @import "../assets/css/common";
  .edit-btn {
    display: flex;
    justify-content: center;
    position: fixed;
    right: pr(20);
    bottom: pr(30);
    width: pr(50);
    height: pr(50);
    border-radius: pr(25);
    background-color: $baseColor;
    color: #fff;
    transition: all .5s;
  }
</style>
