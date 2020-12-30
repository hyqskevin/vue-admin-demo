<template>
  <div id="app">
    <keep-alive>
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // 保证每次修改url刷新页面缓存
    key () {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    }
  }
}
</script>
