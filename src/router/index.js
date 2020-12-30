import Vue from 'vue'
import ViewUI from 'iview'
import Router from 'vue-router'
import Home from '../components/Home'

Vue.use(ViewUI)
Vue.use(Router)

// 禁止全局路由错误处理打印
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/sale',
      children: [
        {
          path: '/sale',
          name: 'sale-page',
          meta: { title: '销售人员' },
          component: () => import('../components/Content/Sale')
        },
        {
          path: '/check',
          name: 'checker-page',
          meta: { title: '审批人员' },
          component: () => import('../components/Content/Check')
        },
        {
          path: '/branch',
          name: 'branch-page',
          meta: { title: '机构管理' },
          component: () => import('../components/Content/Branch')
        },
        {
          path: '/menu',
          name: 'menu-page',
          meta: { title: '菜单管理' },
          component: () => import('../components/Content/Menu')
        },
        {
          path: '/role',
          name: 'role-page',
          meta: { title: '角色管理' },
          component: () => import('../components/Content/Role')
        },
        // {
        //   path: '/flow/',
        //   name: 'flow-page',
        //   meta: {title: '流程管理'}
        // },
        {
          path: '/record',
          name: 'operation-record',
          meta: { title: '操作记录' },
          component: () => import('../components/Content/Record')
        },
        {
          path: '/default',
          name: 'default',
          meta: {title: '默认'},
          component: () => import('../components/Content/DefaultPage')
        }
      ]
    },
    {
      path: '/404',
      name: 'page404',
      component: () => import('../components/Page404')
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})

// 增加路由全局守卫
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start()
  next()
})

router.afterEach(route => {
  ViewUI.LoadingBar.finish()
})

export default router
