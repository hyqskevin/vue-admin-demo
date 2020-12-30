<template>
  <div class="content">
    <Button type="primary" size="default" @click="addModal = true" class="add-menu">新增菜单</Button>
    <Modal v-model="addModal" title="新增菜单" @on-ok="add" @on-cancel="cancel">
      <Form :label-width="100">
        <form-item label="代码：">
          <Input v-model="addMenuCode" placeholder="输入菜单代码" style="width: auto" />
        </form-item>
        <form-item label="名称：">
          <Input v-model="addMenuName" placeholder="输入菜单名称" style="width: auto" type="text" />
        </form-item>
      </Form>
    </Modal>
    <Modal v-model="delModal" title="确认删除菜单？" @on-ok="remove" @on-cancel="cancel">
      <Content>删除菜单的同时会修改审批流程</Content>
    </Modal>
    <Table stripe :columns="menuColumns" :data="sliceMenuList" class="menu-table">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click= "(delModal = true);delIndex = index">删除</Button>
      </template>
    </Table>
<!--    <Page :total="menuCount" :page-size="pageSize" @on-change="changePage" show-elevator show-total class="page"></Page>-->
  </div>
</template>

<script>
import api from '@/plugin/api.js'
export default {
  name: 'Menu',
  methods: {
    // 获取菜单信息
    getMenuInfo () {
      api._getMenu().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.menuList = res.applInfo
          this.menuCount = Number(res.resultCode)
          // 初始化分页显示
          if (this.menuCount < this.pageSize) {
            this.sliceMenuList = this.menuList
          } else {
            this.sliceMenuList = this.menuList.slice(0, this.pageSize)
          }
        } else {
          alert('MenuInfo Error. Return resultCode:' + res.resultCode)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // changePage (page) {
    //   // 点击分页按钮进行跳转
    //   // console.log(page)
    //   let _start = (page - 1) * this.pageSize
    //   let _end = page * this.pageSize
    //   this.sliceMenuList = this.menuList.slice(_start, _end)
    // },
    add () {
      let _thisCode = this.addMenuCode
      let _thisName = this.addMenuName
      if ((_thisCode === '') || (_thisName === '')) {
        alert('输入不能为空')
      } else {
        // 循环查重
        try {
          this.menuList.forEach(res => {
            if ((res.menu_code !== _thisCode) && (res.menu_name !== _thisName)) {
              this.addFlag = true
            } else {
              this.addFlag = false
              throw Error('请输入不重复的菜单代码和名称')
            }
          })
        } catch (e) {
          alert(e)
        }
        if (this.addFlag) {
          let uid = localStorage.userId
          api._postCheckMenu(uid, _thisCode, _thisName).then(res => {
            if (res === 1) {
              this.getMenuInfo()
              this.$Message.success('已添加 ' + _thisName)
              this.addMenuCode = ''
              this.addMenuName = ''
            } else {
              this.$Message.error('添加失败:' + res)
            }
          }).catch(err => {
            console.log(err)
            this.$Message.error('添加失败')
          })
        }
      }
    },
    cancel () {
      this.$Message.info('取消操作')
    },
    remove () {
      let _this = this.sliceMenuList[this.delIndex]
      let uid = localStorage.userId
      api._removeMenu(uid, _this.menu_code, _this.menu_name).then(res => {
        if (res === 1) {
          this.getMenuInfo()
          this.$Message.success('已删除 ' + _this.menu_name)
        } else {
          this.$Message.error('删除失败:' + res)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    // 首次进入页面，执行ajax请求
    this.getMenuInfo()
  },
  data () {
    return {
      checkModal: false, // 删除时弹出对话框
      addModal: false, // 增加时弹出对话框
      addFlag: false, // 新增菜单标志位
      delModal: false, // 删除对话框
      delIndex: 0, // 删除的行
      menuCount: 0, // 菜单数量
      pageSize: 10, // 每页显示数量
      menuColumns: [
        { title: '菜单代码', key: 'menu_code' },
        { title: '菜单名称', key: 'menu_name' },
        { title: '操作', slot: 'action' }
      ], // 表格列标签
      addMenuCode: '', // 存储新增菜单代码
      addMenuName: '', // 存储新增菜单名称
      menuList: [], // 接收数据
      sliceMenuList: [] // 存储分页数据
    }
  }
}
</script>

<style lang="stylus" scoped>
  .content
    background #fff
    padding 20px
    height 600px
    box-shadow 1px 1px 1px rgba(0,0,0,.1)
    .add-menu
      position absolute
      right 70px
      top 103px
      font-size 14px
    .menu-table
      height auto
    .page
      margin-top 10px
</style>
