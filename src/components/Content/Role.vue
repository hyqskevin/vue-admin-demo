<template>
  <div class="content">
    <Button type="primary" size="default" @click="(addModal = true);getMenuList()" class="add-role">新增角色</Button>
    <Modal v-model="addModal" title="新增审批角色" @on-ok="add" @on-cancel="cancel">
      <Form :label-width="100">
        <form-item label="代码：">
            <Input v-model="addRoleCode" placeholder="输入角色代码" style="width: auto" />
        </form-item>
        <form-item label="名称：">
          <Input v-model="addRoleName" placeholder="输入角色名称" style="width: auto" />
        </form-item>
        <form-item label="菜单：">
          <Select v-model="addMenuCode" placeholder="选择菜单" style="width: auto">
            <Option v-for="item in menuList" :value="item.menu_code" :key="item.menu_code">{{ item.menu_code + ' ' + item.menu_name }}</Option>
          </Select>
        </form-item>
      </Form>
    </Modal>
    <Modal v-model="delModal" title="确认删除角色？" @on-ok="remove" @on-cancel="cancel">
      <Content>删除角色的同时会修改审批流程</Content>
    </Modal>
    <Table stripe :columns="roleColumns" :data="sliceRoleList" class="role-table">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click= "(delModal = true);delIndex = index">删除</Button>
      </template>
    </Table>
    <Page ref="current" :total="roleCount" :page-size="pageSize" @on-change="changePage" show-elevator show-total class="page"></Page>
  </div>
</template>

<script>
import api from '@/plugin/api.js'
export default {
  name: 'Role',
  methods: {
    // 获取角色信息
    getRoleInfo () {
      api._getRole().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.roleList = res.applInfo
          this.roleCount = Number(res.resultCode)
          // 初始化分页显示
          if (this.roleCount < this.pageSize) {
            this.sliceRoleList = this.roleList
          } else {
            this.sliceRoleList = this.roleList.slice(0, this.pageSize)
          }
          // 每次获取数据时页面号返回到1
          this.$refs['current'].currentPage = 1
        } else {
          alert('RoleInfo Error. Return resultCode:' + res.resultCode)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取菜单列表
    getMenuList () {
      api._getMenu().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.menuList = res.applInfo
        } else if (res.resultCode === '0') alert('查无记录')
        else alert('Error. Return resultCode:' + res.resultCode)
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (page) {
      // 点击分页按钮进行跳转
      let _start = (page - 1) * this.pageSize
      let _end = page * this.pageSize
      this.sliceRoleList = this.roleList.slice(_start, _end)
    },
    add () {
      let _thisRoleCode = this.addRoleCode
      let _thisRoleName = this.addRoleName
      let _thisMenuCode = this.addMenuCode
      // console.log(_thisRoleCode, _thisRoleName, _thisMenuCode)
      if ((_thisRoleCode === '') || (_thisRoleName === '') || (_thisMenuCode === '')) {
        alert('输入不能为空')
      } else {
        // 循环查重
        try {
          this.roleList.forEach(res => {
            if ((res.role_code === _thisRoleCode) && (res.role_name === _thisRoleName) && (res.menu_code === _thisMenuCode)) {
              this.addFlag = false
              throw Error('已有相同条目!')
            } else if ((res.role_code === _thisRoleCode) && (res.role_name !== _thisRoleName)) {
              this.addFlag = false
              throw Error('角色代码 ' + _thisRoleCode + ' 已存在，不能对应多个角色名称!')
            } else if ((res.role_code !== _thisRoleCode) && (res.role_name === _thisRoleName)) {
              this.addFlag = false
              throw Error(_thisRoleName + '对应角色代码 ' + res.role_code + ' ,请更改角色代码或名称')
            } else {
              this.addFlag = true
            }
          })
        } catch (e) {
          alert(e)
        }
        if (this.addFlag) {
          let uid = this.$store.state.currentUser
          api._postCheckRole(uid, _thisRoleCode, _thisRoleName, _thisMenuCode).then(res => {
            if (res === 1) {
              this.getRoleInfo()
              this.$Message.success('已添加 ' + _thisRoleName)
              // 新增完清空
              this.addRoleCode = ''
              this.addRoleName = ''
              this.addMenuCode = ''
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
      this.$Message.info('取消更改')
    },
    remove () {
      let _this = this.sliceRoleList[this.delIndex]
      let uid = this.$store.state.currentUser
      api._removeRole(uid, _this.role_code, _this.role_name, _this.menu_code).then(res => {
        if (res === 1) {
          this.getRoleInfo()
          this.$Message.success('已删除 ' + _this.role_name)
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
    this.getRoleInfo()
  },
  data () {
    return {
      checkModal: false, // 删除时弹出对话框
      addModal: false, // 增加时弹出对话框
      addFlag: false, // 新增标志位
      delModal: false, // 删除时弹出对话框
      delIndex: 0, // 删除的行
      roleCount: 0, // 角色数量
      pageSize: 10, // 每页显示数量
      roleColumns: [
        { title: '角色代码', key: 'role_code' },
        { title: '角色名称', key: 'role_name' },
        { title: '菜单代码', key: 'menu_code' },
        { title: '菜单名称', key: 'menu_name' },
        { title: '操作', slot: 'action' }
      ], // 表格列标签
      addRoleCode: '', // 存储新增角色代码
      addRoleName: '', // 存储新增角色名称
      addMenuCode: '', // 存储新增菜单代码
      roleList: [], // 接收角色数据
      menuList: [], // 接收菜单数据
      sliceRoleList: [] // 存储分页数据
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
    .add-role
      position absolute
      right 70px
      top 103px
      font-size 14px
    .role-table
      height auto
    .page
      margin-top 10px
</style>
