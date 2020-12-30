<template>
  <div class="content">
    <Button type="primary" size="default" @click="addModal = true" class="add-check">新增审批人员</Button>
    <Modal v-model="addModal" title="新增审批人员" @on-ok="add" @on-cancel="cancel">
      <Form :label-width="100">
        <form-item label="工号：">
          <Input v-model="addCheckCode" placeholder="输入工号" style="width: 160px" />
        </form-item>
        <form-item label="姓名：">
          <Input v-model="addCheckName" placeholder="输入姓名" style="width: 160px" />
        </form-item>
        <form-item label="选择机构：">
          <Select v-model="addBranchCode" style="width: 160px" placeholder="请选择机构">
            <Option v-for="item in branchList" :value="item.branch_code" :key="item.branch_name">{{item.branch_name}}</Option>
          </Select>
        </form-item>
        <form-item label="选择角色：">
          <Select v-model="addRoleCode" style="width: 160px" placeholder="请选择角色">
            <Option v-for="item in roleList" :value="item.role_code" :key="item.role_name">{{item.role_name}}</Option>
          </Select>
        </form-item>
      </Form>
    </Modal>
    <Modal v-model="updateModal" title="更改审批人员" @on-ok="update" @on-cancel="cancel">
      <Form :label-width="100">
        <form-item label="工号：">
          {{this.updateCheckCode}}
        </form-item>
        <form-item label="姓名：">
          {{this.updateCheckName}}
        </form-item>
        <form-item label="选择机构：">
          <Select v-model="updateBranchCode" style="width:160px" placeholder="指定新的机构">
            <Option v-for="(item, index) in branchList" :value="item.branch_code" :key="index">{{item.branch_name }}</Option>
          </Select>
        </form-item>
        <form-item label="选择角色：">
          <Select v-model="updateRoleCode" style="width:160px" placeholder="指定新的角色">
            <Option v-for="(item, index) in roleList" :value="item.role_code" :key="index">{{item.role_name }}</Option>
          </Select>
        </form-item>
      </Form>
    </Modal>
    <Modal v-model="offModal" title="确认禁用审批人员？" @on-ok="offState" @on-cancel="cancel">
      <Content>禁用审批人员的同时会修改审批流程</Content>
    </Modal>
    <Table stripe :columns="checkColumns" :data="sliceCheckList" class="check-table">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 10px" @click="(updateModal = true);getCheckSelect(index)">更新</Button>
        <Button v-if="row.user_status==='正常'" type="error" size="small" @click="(offModal = true);offIndex = index">禁用</Button>
        <Button v-if="row.user_status!=='正常'" type="success" size="small" @click="onState(index)">启用</Button>
      </template>
    </Table>
    <Page ref="current" :total="checkCount" :page-size="pageSize" @on-change="changePage" show-elevator show-total class="page"></Page>
  </div>
</template>

<script>
import api from '@/plugin/api.js'
export default {
  name: 'Check',
  methods: {
    // 获取审批信息
    getCheckInfo () {
      this.$Loading.start()
      api._getCheck().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.checkList = res.applInfo
          this.checkCount = Number(res.resultCode)
          // 初始化分页显示
          if (this.checkCount < this.pageSize) {
            this.sliceCheckList = this.checkList
          } else {
            this.sliceCheckList = this.checkList.slice(0, this.pageSize)
          }
          // 每次获取数据时页面号返回到1
          this.$refs['current'].currentPage = 1
          this.$Loading.finish()
        } else {
          this.$Loading.error()
          alert('CheckInfo Error. Return resultCode:' + res.resultCode)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取机构列表
    async getBranchList () {
      api._getCount().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.branchList = res.applInfo
        } else alert('BranchInfo Error. Return resultCode:' + res.resultCode)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取角色列表,查重
    async getRoleList () {
      api._getRole().then(res => {
        // console.log(res)
        if (Number(res.resultCode) > 0) {
          let len = Number(res.resultCode)
          let _roleList = res.applInfo
          for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
              if (_roleList[i].role_code === _roleList[j].role_code) {
                _roleList.splice(j, 1)
                len--
              } else j++
            }
          }
          _roleList.splice(0, 1)
          this.roleList = _roleList
        } else alert('RoleList Error. Return resultCode:' + res.resultCode)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取要更新的工号和用户名称显示
    getCheckSelect (index) {
      this.updateCheckCode = this.sliceCheckList[index].user_code
      this.updateCheckName = this.sliceCheckList[index].user_name
    },
    changePage (page) {
      // 点击分页按钮进行跳转
      let _start = (page - 1) * this.pageSize
      let _end = page * this.pageSize
      this.sliceCheckList = this.checkList.slice(_start, _end)
    },
    add () {
      let _thisCheckCode = this.addCheckCode
      let _thisCheckName = this.addCheckName
      let _thisBranchCode = this.addBranchCode
      let _thisRoleCode = this.addRoleCode
      if ((_thisCheckCode === '') || (_thisCheckName === '') || (_thisBranchCode === '') || (_thisRoleCode === '')) {
        alert('输入不能为空')
      } else {
        // 循环查重
        try {
          this.checkList.forEach(res => {
            if ((res.check_code === _thisCheckCode)) {
              this.addFlag = false
              throw Error('请输入不重复的工号')
            } else {
              this.addFlag = true
            }
          })
        } catch (e) {
          alert(e)
        }
        if (this.addFlag) {
          let uid = localStorage.userId
          api._postCheckmen(uid, _thisCheckCode, _thisCheckName, _thisBranchCode, _thisRoleCode).then(res => {
            if (res === 1) {
              this.getCheckInfo()
              this.$Message.success('已添加审批人员: ' + _thisCheckName)
              this.addCheckCode = ''
              this.addCheckName = ''
              this.addBranchCode = ''
              this.addRoleCode = ''
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
    // 更新机构和部门
    update () {
      let _thisCheckCode = this.updateCheckCode
      let _thisCheckName = this.updateCheckName
      let _thisBranchCode = this.updateBranchCode
      let _thisRoleCode = this.updateRoleCode
      let uid = localStorage.userId
      // console.log(_thisBranchCode, _thisBranchName, _thisCountCode, _thisCountName)
      api._updateCheckmen(uid, _thisCheckCode, _thisCheckName, _thisBranchCode, _thisRoleCode).then(res => {
        if (res === 1) {
          this.getCheckInfo()
          this.changePage(1)
          this.$Message.success('已更新审批人员 ' + _thisCheckName)
          // 清空选择的机构和角色名称
          this.updateBranchCode = ''
          this.updateRoleCode = ''
        } else {
          this.$Message.error('更新失败:' + res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    cancel () {
      this.$Message.info('取消操作')
    },
    offState () {
      let _this = this.sliceCheckList[this.offIndex]
      let flag = 0
      let uid = localStorage.userId
      api._updateCheckmenStatus(uid, _this.user_code, _this.user_name, _this.branch_code, _this.role_code, flag).then(res => {
        if (res === 1) {
          this.getCheckInfo()
          this.$Message.success('已禁用用户 ' + _this.user_name + '机构 ' + _this.branch_name + '角色 ' + _this.role_name)
        } else {
          this.$Message.error('禁用失败:' + res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onState (index) {
      let _this = this.sliceCheckList[index]
      let flag = 1
      let uid = localStorage.userId
      api._updateCheckmenStatus(uid, _this.user_code, _this.user_name, _this.branch_code, _this.role_code, flag).then(res => {
        if (res === 1) {
          this.getCheckInfo()
          this.$Message.success('已启用用户 ' + _this.user_name + '机构 ' + _this.branch_name + '角色 ' + _this.role_name)
        } else {
          this.$Message.error('启用失败:' + res)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    remove () {
      let _this = this.sliceCheckList[this.delIndex]
      let uid = localStorage.userId
      api._removeCheckmen(uid, _this.user_code, _this.user_name, _this.branch_code, _this.role_code).then(res => {
        if (res === 1) {
          this.getCheckInfo()
          this.$Message.success('已删除用户 ' + _this.user_name + '机构 ' + _this.branch_name + '角色 ' + _this.role_name)
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
    this.getCheckInfo()
    this.getBranchList()
    this.getRoleList()
  },
  data () {
    return {
      checkModal: false, // 删除时弹出对话框
      addModal: false, // 增加时弹出对话框
      addFLag: false, // 新增审批标志位
      updateModal: false, // 更新时弹出对话框
      offModal: false, // 禁用时弹出对话框
      offIndex: 0, // 禁用的行
      checkCount: 0, // 审批人员数量
      pageSize: 10, // 每页显示数量
      // page: 0, // 缓存页面号
      checkColumns: [
        { title: '工号', key: 'user_code', width: 100 },
        { title: '用户名称', key: 'user_name' },
        { title: '机构代码', key: 'branch_code', tooltip: true },
        { title: '机构名称', key: 'branch_name', width: 120 },
        { title: '部门代码', key: 'count_code', tooltip: true },
        { title: '部门名称', key: 'count_name' },
        { title: '角色代码', key: 'role_code' },
        { title: '角色名称', key: 'role_name' },
        { title: '用户状态', key: 'user_status' },
        { title: '操作', slot: 'action', width: 140 }
      ], // 表格列标签
      addCheckCode: '', // 存储新增审批代码
      addCheckName: '', // 存储新增审批人员
      addBranchCode: '', // 存储新增机构代码
      addRoleCode: '', // 存储新增角色代码
      updateCheckCode: '', // 更新审批工号
      updateCheckName: '', // 更新审批人员
      updateBranchCode: '', // 更新机构号
      updateRoleCode: '', // 更新角色号
      checkList: [], // 审批销售人员数据
      branchList: [], // 机构
      roleList: [], // 角色
      sliceCheckList: [] // 存储分页数据
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
    .add-check
      position absolute
      right 70px
      top 103px
    .check-table
      height auto
      // max-height 450px
</style>
