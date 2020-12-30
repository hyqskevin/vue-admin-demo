<template>
  <Content class="layout-content">
    <keep-alive>
      <router-view />
    </keep-alive>
  </Content>
</template>

<script>
export default {
  name: 'homeContent'
}
</script>

<style lang="stylus" scoped>
  .layout-content
    margin 35px
    min-height: 300px
</style>
