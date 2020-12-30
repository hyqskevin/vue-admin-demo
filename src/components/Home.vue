<template>
  <layout>
    <Sider ref="sider" hide-trigger collapsible :collapsed-width="80" v-model="isCollapsed">
      <Menu width="auto" :class="menuItemCollapse">
        <menu-item name="title">
          <div class="title">vue后台管理demo</div>
        </menu-item>
        <div v-for="menu in Menu" :key="menu.name" :title="menu.title" :name="menu.name">
          <!-- menu为空时不显示title，只显示child menu -->
          <div v-if="menu.title" class="subTitle">{{menu.title}}</div>
          <menu-item :name="child.name" v-for="child in menu.children" :key="child.name" class="menu-item">
            <router-link tag="div" :to="{path:child.href, query:{uid: userId}}" @click.native="handleClick(child.name)">
              <Icon :type="child.icon"></Icon>
              <span v-show="!isCollapsed">{{child.title}}</span>
            </router-link>
          </menu-item>
        </div>
      </Menu>
    </Sider>
    <layout>
      <home-header v-if="roleCode > 0" :name="userName" :number="menuClick" :role ="roleCode" @collapseEvent="collapseEvent"></home-header>
      <home-content v-if="roleCode > 0"></home-content>
    </layout>
  </layout>
</template>

<script>
import homeContent from './Content'
import homeHeader from './Header'
import { mapState, mapMutations } from 'vuex'
import api from '@/plugin/api.js'

export default {
  name: 'Home',
  components: {
    homeHeader,
    homeContent
  },
  computed: {
    menuItemCollapse () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    ...mapState(['currentMenu', 'currentUser'])
  },
  methods: {
    // 侧边栏收缩，iview toggleCollapse方法，同步触发isCollapse改变
    collapseEvent () {
      this.$refs.sider.toggleCollapse()
    },
    // 根据uid获取管理员id和角色代码
    async getManager () {
      await api._getManager(this.userId).then(res => {
        if (Number(res.resultCode) > 0) {
          this.userName = res.applInfo[0].user_name
          this.roleCode = res.applInfo[0].role_code
          console.log('getManager:', this.userName, this.roleCode)
        } else {
          alert('Uid Error. Return resultCode:', res.resultCode)
          this.$router.push('/Page404')
        }
      })
    },
    // 判断登录人员角色赋予不同的侧边栏
    roleCheck () {
      if (this.roleCode !== '') {
        if (Number(this.roleCode) >= 101) {
          this.Menu = this.adminMenu
        } else if (Number(this.roleCode) === 100) {
          this.Menu = this.checkMenMenu
        } else {
          this.$router.push('/default')
        }
      } else {
        alert('RoleCode Error. You have no permission.', this.roleCode)
        this.$router.push('/Page404')
      }
    },
    // 点击侧边栏跳转
    handleClick (menu) {
      // menu从1开始，array从0开始
      this.menuClick = menu - 1
      // console.log('handleClick:' + this.menuClick)
      this.changeMenuClick(this.menuClick)
    },
    ...mapMutations(['changeMenuClick', 'getUserId'])
  },
  activated () {
    // 每次刷新页面时去获取state中的缓存侧边栏号
    if (this.menuClick !== this.currentMenu) {
      this.menuClick = this.currentMenu
    }
  },
  mounted () {
    if (this.userId === '' || this.userId === undefined) {
      this.$router.push('/Page404')
    } else {
      this.getUserId(this.userId)
      this.getManager().then(() => {
        this.roleCheck()
      })
    }
  },
  created () {
    // 初始化参数
    this.userId = this.$route.query.uid
    this.userName = ''
    this.roleCode = ''
    this.Menu = []
  },
  data () {
    return {
      userId: '',
      userName: '',
      roleCode: '',
      isCollapsed: false,
      menuClick: null,
      Menu: [],
      checkMenMenu: [
        {
          title: '人员查看',
          name: 'employee',
          children: [
            { title: '销售人员', name: '1', icon: 'md-person', href: '/sale' },
            { title: '审批人员', name: '2', icon: 'md-laptop', href: '/check' }
          ]
        }
      ],
      adminMenu: [
        {
          title: '人员查看',
          name: 'employee',
          children: [
            { title: '销售人员', name: '1', icon: 'md-person', href: '/sale' },
            { title: '审批人员', name: '2', icon: 'md-laptop', href: '/check' }
          ]
        },
        {
          title: '审批管理',
          name: 'check',
          children: [
            { title: '机构管理', name: '3', icon: 'md-apps', href: '/branch' },
            { title: '菜单管理', name: '4', icon: 'md-laptop', href: '/menu' },
            { title: '角色管理', name: '5', icon: 'md-people', href: '/role' }
          // {
          //   title: '流程管理',
          //   name: '6',
          //   icon: 'md-git-network',
          //   href: '/flow/'
          // }
          ]
        },
        {
          title: '后台',
          name: 'backEnd',
          children: [
            { title: '操作记录', name: '6', icon: 'md-information-circle', href: '/record/' }
            // { title: '权限管理', name: '7', icon: 'md-settings', href: '/authority/' }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
  /* 侧边栏 */
  // 修改原模板
  .ivu-layout-sider
    background #fff
  .menu-item span
    display: inline-block
    overflow: hidden
    margin 14px 0
    width: 120px
    height:22px
    font-size: 16px
    text-overflow: ellipsis
    white-space: nowrap
    vertical-align: bottom
    transition: width .2s ease .2s
  .ivu-icon
    margin-bottom 14px
    margin-right: 2px
    transform: translateX(0px)
    transition: font-size .2s ease, transform .2s ease
    vertical-align: middle
    font-size: 18px
  .title
    font-weight bold
    line-height 25px
    margin 10px 0 10px -20px
    width: 160px
    font-size 20px
    text-align center
  .subTitle
    font-size 12px
    margin-left 20px
    color darkgrey
  .collapsed-menu span
    width: 0
    transition: width .2s ease .5s
  .collapsed-menu
    .title
      display none
    .subTitle
      margin-left -18px
      margin-right -10px
      font-size 12px
      color lightgrey
      text-align center
  .collapsed-menu i
    margin-left -2px
    transform: translateX(5px)
    transition: font-size .2s ease .2s, transform .2s ease .2s
    vertical-align: middle
    font-size: 24px
  .line
    //display: inline-block
    //overflow: hidden
    background #2222
    min-height: 1px
  .footer
    margin 10px 35px
    text-align left
    color darkgrey
</style>
