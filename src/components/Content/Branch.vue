<template>
  <div class="content">
    <Button type="primary" size="default" @click="addModal = true" class="add-branch">新增机构和部门信息</Button>
    <Modal v-model="addModal" title="新增机构和部门信息" @on-ok="add" @on-cancel="cancel">
      <Form :label-width="100">
        <form-item label="机构代码：">
          <Input v-model="addBranchCode" placeholder="输入机构代码" style="width: auto" />
        </form-item>
        <form-item label="机构名称：">
          <Input v-model="addBranchName" placeholder="输入机构名称" style="width: auto" type="text" />
        </form-item>
        <form-item label="选择部门：">
          <Select @on-change="addCount" placeholder="选择部门" style="width: 160px" >
            <Option v-for="(item, index) in countList" :value="item.branch_code" :key="index">{{ item.branch_code + ' ' + item.branch_name }}</Option>
          </Select>
        </form-item>
      </Form>
    </Modal>
    <Modal v-model="updateModal" title="更改机构" @on-ok="update" @on-cancel="cancel">
      <Form :label-width="100">
        <form-item label="机构代码：">
          {{this.updateBranchCode}}
        </form-item>
        <form-item label="机构名称：">
          {{this.updateBranchName}}
        </form-item>
        <form-item label="选择部门：">
          <Select @on-change="updateCount" style="width:160px" placeholder="指定新的部门" :label-in-value="true">
            <Option v-for="(item, index) in countList" :value="item.branch_code" :key="index">{{item.branch_name }}</Option>
          </Select>
        </form-item>
      </Form>
    </Modal>
    <Modal v-model="delModal" title="确认删除机构？" @on-ok="remove" @on-cancel="cancel">
      <Content>删除机构和柜面的同时会修改审批流程</Content>
    </Modal>
    <Table stripe :columns="branchColumns" :data="sliceBranchList" class="branch-table">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 10px" @click="(updateModal = true);getCountSelect(index)">更新</Button>
        <Button type="error" size="small" @click= "(delModal = true);delIndex = index">删除</Button>
      </template>
    </Table>
    <Page ref="current" :total="branchCount" :page-size="pageSize" @on-change="changePage" show-elevator show-total class="page"></Page>
  </div>
</template>

<script>
import api from '@/plugin/api.js'
export default {
  name: 'Branch',
  methods: {
    // 获取机构柜面信息
    getBranchInfo () {
      api._getBranchCount().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.branchList = res.applInfo
          this.branchCount = Number(res.resultCode)
          // 初始化分页显示
          if (this.branchCount < this.pageSize) {
            this.sliceBranchList = this.branchList
          } else {
            this.sliceBranchList = this.branchList.slice(0, this.pageSize)
          }
          // 每次获取数据时页面号返回到1
          this.$refs['current'].currentPage = 1
        } else {
          alert('BranchInfo Error. Return resultCode:' + res.resultCode)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取机构列表
    getCountList () {
      api._getCount().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.countList = res.applInfo
        } else alert('CountList Error. Return resultCode:' + res.resultCode)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取要更新的机构号和机构名称显示
    getCountSelect (index) {
      this.updateBranchCode = this.sliceBranchList[index].branch_code
      this.updateBranchName = this.sliceBranchList[index].branch_name
    },
    // 新增部门号和名称
    addCount (value) {
      this.addCountCode = value.value
      this.addCountName = value.label
    },
    // 获取更新的部门号和名称
    updateCount (value) {
      this.updateCountCode = value.value
      this.updateCountName = value.label
    },
    changePage (page) {
      // 点击分页按钮进行跳转
      let _start = (page - 1) * this.pageSize
      let _end = page * this.pageSize
      this.sliceBranchList = this.branchList.slice(_start, _end)
    },
    add () {
      let _thisBranchCode = this.addBranchCode
      let _thisBranchName = this.addBranchName
      let _thisCountCode = this.addCountCode
      let _thisCountName = this.addCountName
      if ((_thisBranchCode === '') || (_thisBranchName === '') || (_thisCountCode === '') || (_thisCountName === '')) {
        alert('输入不能为空')
      } else {
        // 循环查重
        try {
          this.branchList.forEach(res => {
            if ((res.branch_code === _thisBranchCode)) {
              this.addFlag = false
              throw Error('请输入不重复的机构代码')
            } else {
              this.addFlag = true
            }
          })
        } catch (e) {
          alert(e)
        }
        // console.log(this.addFlag)
        if (this.addFlag) {
          let uid = localStorage.userId
          api._postBranchCount(uid, _thisBranchCode, _thisBranchName, _thisCountCode, _thisCountName).then(res => {
            if (res === 1) {
              this.getBranchInfo()
              this.$Message.success('已添加机构 ' + _thisBranchName + '部门' + _thisCountName)
              // 清空条件
              this.addBranchCode = ''
              this.addBranchName = ''
              this.addCountCode = ''
              this.addCountName = ''
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
      let _thisBranchCode = this.updateBranchCode
      let _thisBranchName = this.updateBranchName
      let _thisCountCode = this.updateCountCode
      let _thisCountName = this.updateCountName
      let uid = this.$store.state.currentUser
      // console.log(_thisBranchCode, _thisBranchName, _thisCountCode, _thisCountName)
      api._updateBranchCount(uid, _thisBranchCode, _thisCountCode, _thisCountName).then(res => {
        if (res === 1) {
          this.getBranchInfo()
          this.$Message.success('已更新机构 ' + _thisBranchName)
          this.updateCountName = ''// 清空选择的柜面名称
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
    remove () {
      let _this = this.sliceBranchList[this.delIndex]
      let uid = this.$store.state.currentUser
      api._removeBranchCount(uid, _this.branch_code, _this.branch_name).then(res => {
        if (res === 1) {
          this.getBranchInfo()
          this.$Message.success('已删除 ' + _this.branch_name + '机构 ' + _this.count_name)
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
    this.getBranchInfo()
    this.getCountList()
  },
  data () {
    return {
      checkModal: false, // 删除时弹出对话框
      addModal: false, // 增加时弹出对话框
      updateModal: false, // 更新时弹出对话框
      delModal: false, // 删除时弹出对话框
      delIndex: 0, // 要删除的行
      addFlag: false, // 新增机构标志位
      branchCount: 0, // 机构和柜面数量
      pageSize: 10, // 每页显示数量
      branchColumns: [
        { title: '机构代码', key: 'branch_code' },
        { title: '机构名称', key: 'branch_name' },
        { title: '柜面代码', key: 'count_code' },
        { title: '柜面名称', key: 'count_name' },
        { title: '操作', slot: 'action' }
      ], // 表格列标签
      addBranchCode: '', // 存储新增机构代码
      addBranchName: '', // 存储新增机构名称
      addCountCode: '', // 存储新增部门代码
      addCountName: '', // 存储新增部门名称
      updateBranchCode: '', // 存储更改的机构代码
      updateBranchName: '', // 存储更改的机构名称
      updateCountCode: '', // 存储更改的部门代码
      updateCountName: '', // 存储更改的部门名称
      branchList: [], // 接收数据
      countList: [], // 接收柜面数据
      sliceBranchList: [] // 存储分页数据
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
    .add-branch
      position absolute
      right 70px
      top 103px
      // font-size 14px
    .branch-table
      height auto
    .page
      margin-top 10px
</style>
