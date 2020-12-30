<template>
  <div>
    <Header class="layout-header-bar">
      <Icon @click.native="collapseSider" class="header-icon" type="md-menu" />
      <div v-if="name !== ''" class="header-user">
        <Icon type="md-person" class="user-icon"/>
        Welcome, {{name}}
      </div>
    </Header>
    <div class="header-title">
      <Content  v-if="role >= 100">{{headerTitle[number]}}</Content>
    </div>
    <div class="header-info" v-if="role >= 100">
      <Icon type="md-pricetag" class="header-info-icon"/>
      {{headerInfo[number]}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeHeader',
  props: ['number', 'name', 'role'],
  methods: {
    // sideBar收缩操作从子组件传递到父组件
    collapseSider () {
      this.$emit('collapseEvent')
    }
  },
  data () {
    return {
      // isCollapsed: false,
      headerTitle: [
        '销售人员列表',
        '审批人员列表',
        '机构管理页面',
        '菜单管理页面',
        '角色管理页面',
        // '流程管理页面',
        '操作记录',
        // '新增用户',
        '权限管理'
      ],
      headerInfo: [
        '查看及修改销售人员',
        '查看及修改审批人员',
        '管理机构和柜面',
        '管理审批系统菜单',
        '管理审批系统角色',
        // '管理审批流程',
        '系统所有操作记录',
        // '新增销审批角色',
        '修改管理员权限'
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
  // header
  .layout-header-bar
    padding 0
    height 120px
    line-height 120px
    background-color rgba(0, 204, 51, 0.2)
    box-shadow: 0 1px 1px rgba(0,0,0,.1)
    .header-icon
      margin: 0 30px
      margin-bottom 56px
      font-size 24px
      transition: all .3s
    .header-user
      position absolute
      line-height 24px
      font-size 18px
      top 24px
      right 60px
      .user-icon
        font-size 24px
        margin-bottom 2px
        margin-right 5px
  .header-title
    margin -35px 30px 0 30px
    padding 0 20px
    height 70px
    line-height 70px
    background: #fff
    box-shadow: 1px 1px 1px rgba(0,0,0,.1)
    font-size 18px
    font-weight bold
  .header-info
    margin-top 30px
    margin-left 30px
    font-size 16px
    .header-info-icon
      font-size 24px
      margin-right 4px
      padding-top 1px
      color rgba(0, 204, 51, 0.32)
</style>
