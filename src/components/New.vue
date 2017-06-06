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
        <md-icon>send</md-icon>
      </md-button>
    </md-toolbar>
  </div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="scss" type="text/scss">

</style>
