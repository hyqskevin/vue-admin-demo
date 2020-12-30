<template>
  <div>
    <div class="logo">
      <div class="mask"></div>
    </div>
    <div class="notfound">
      <img src="@/assets/404.png" class="center"/>
      <p>
        页面载入错误，请刷新或输入正确的地址。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>

<style lang="stylus" scoped>
  .logo
    width:100%
    height:100%
    line-height:100%
    overflow:hidden
    position:fixed
    bottom:0
    left:0
    z-index:-1000
  .logo img
    width:10%
    height:16%
    margin-left 10%
  .mask
    width:100%
    height:100%
    position:absolute
    top:0
    left:0
    background: #75aa9c
    opacity:0.4
    // filter:alpha(opacity=60)
  .notfound
    width:100%
    text-align:center
    height:400px
    position:absolute
    top:60%
    margin-top:-230px
  p
    color:#fff
    margin-top:40px
    font-size:24px
    line-height:56px
</style>
