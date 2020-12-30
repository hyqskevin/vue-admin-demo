<template>
  <div class="content">
    <div class="search">
      <Select v-model="selectValue" placeholder="请选择..." clearable class="select">
        <Option v-for="(item, index) in selectList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>
      <Input v-if="selectValue === 'user_code' || selectValue === 'user_name'" v-model="inputValue" placeholder="请输入..." clearable class="input"/>
      <Select v-else-if="selectValue === 'branch_name'" v-model="inputValue" style="width:160px" placeholder="请选择..." class="select">
        <Option v-for="(item,index) in branchList" :value="item.branch_name" :key="index">{{item.branch_name}}</Option>
      </Select>
      <Select v-else-if="selectValue === 'count_name'" v-model="inputValue" style="width:160px" placeholder="请选择..." class="select">
        <Option v-for="(item,index) in countList" :value="item.count_name" :key="index">{{item.count_name}}</Option>
      </Select>
      <Select v-else-if="selectValue === 'credit_name'" v-model="inputValue" style="width:160px" placeholder="请选择..." class="select">
        <Option v-for="(item,index) in creditList" :value="item.credit_name" :key="index">{{item.credit_name}}</Option>
      </Select>
      <Input v-else disabled placeholder="请选择查询条件" class="input"/>
      <Button type="primary" class="button" @click="updateSaleInfo">查询</Button>
      <Button class="button" @click="clearSelect">清空</Button>
    </div>
    <div class="table">
      <Table stripe :columns="saleColumns" :data="sliceSaleList" class="sale-table"/>
      <Page :total="saleCount" :page-size="pageSize" @on-change="changePage" show-elevator show-total class="page"></Page>
    </div>
  </div>

</template>

<script>
import api from '@/plugin/api.js'

export default {
  name: 'Sale',
  methods: {
    // 获取销售人员数据
    async getSaleInfo () {
      let uid = this.$store.state.currentUser
      api._getSale(uid).then(res => {
        // data接收传值
        // console.log(res)
        if (Number(res.resultCode) > 0) {
          this.saleList = res.applInfo
          this.saleCount = Number(res.resultCode)
          clearInterval(this.dataTimer)
          // 初始化分页显示
          if (this.saleCount < this.pageSize) {
            this.sliceSaleList = this.saleList
          } else {
            this.sliceSaleList = this.saleList.slice(0, this.pageSize)
          }
        } else {
          alert('SaleInfo Error. Return resultCode:' + res.resultCode)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取机构名称列表
    async getBranchList () {
      await api._getBranchList().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) this.branchList = res.applInfo
        else alert('BranchList Error. Return resultCode:' + res.resultCode)
        // console.log(this.branchList)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取部门名称列表
    async getCountList () {
      api._getCountList().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) this.countList = res.applInfo
        else alert('CountList Error. Return resultCode:' + res.resultCode)
        // console.log(this.countList)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取信用等级列表
    async getCreditList () {
      await api._getCreditList().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) this.creditList = res.applInfo
        else alert('CreditList Error. Return resultCode:' + res.resultCode)
        // console.log(this.creditList)
      }).catch(err => {
        console.log(err)
      })
    },
    // 更新销售人员数据
    updateSaleInfo () {
      let _thisUserCode = ''
      let _thisUserName = ''
      let _thisBranchName = ''
      let _thisCountName = ''
      let _thisCreditName = ''
      switch (this.selectValue) {
        case 'user_code': _thisUserCode = this.inputValue; break
        case 'user_name': _thisUserName = this.inputValue; break
        case 'branch_name': _thisBranchName = this.inputValue; break
        case 'count_name': _thisCountName = this.inputValue; break
        case 'credit_name': _thisCreditName = this.inputValue; break
        default: break
      }
      let uid = this.$store.state.currentUser
      // console.log(_thisUserCode, _thisUserName, _thisBranchName, _thisCountName, _thisCreditName)
      api._updateSale(uid, _thisUserCode, _thisUserName, _thisBranchName, _thisCountName, _thisCreditName).then(res => {
        // data接收更新后的传值
        if (Number(res.resultCode) > 0) {
          this.saleList = res.applInfo
          this.saleCount = Number(res.resultCode)
          this.$Message.success('查询成功!')
          // 初始化分页显示
          if (this.saleCount < this.pageSize) {
            this.sliceSaleList = this.saleList
          } else {
            this.sliceSaleList = this.saleList.slice(0, this.pageSize)
          }
        } else if (res.resultCode === '0') alert('查无记录')
        else alert('Update Error. Return resultCode:' + res.resultCode)
      }).catch(err => {
        alert(err)
      })
    },
    clearSelect () {
      this.inputValue = ''
      this.selectValue = ''
    },
    // 表格分页
    changePage (page) {
      // 点击分页按钮进行跳转
      let _start = (page - 1) * this.pageSize
      let _end = page * this.pageSize
      this.sliceSaleList = this.saleList.slice(_start, _end)
    }
  },
  mounted () {
    // 读取销售人员数据时进行定时
    this.dataTimer = setInterval(() => {
      this.getSaleInfo()
    }, 100)
    this.getBranchList()
    this.getCountList()
    this.getCreditList()
  },
  destroyed () {
    clearInterval(this.dataTimer)
  },
  data () {
    return {
      inputValue: '', // 查询输入
      selectValue: '', // 存储筛选条件
      saleCount: 0, // 销售人员数量
      pageSize: 8, // 每页显示数量
      selectList: [
        { value: 'user_code', label: '工号' },
        { value: 'user_name', label: '用户名' },
        { value: 'branch_name', label: '机构' },
        { value: 'count_name', label: '部门' },
        { value: 'credit_name', label: '信用等级' }
      ], // 查询列表
      saleColumns: [
        { title: '工号', key: 'user_code', width: 150 },
        { title: '用户名称', key: 'user_name' },
        { title: '机构代码', key: 'branch_code', tooltip: true },
        { title: '机构名称', key: 'branch_name' },
        { title: '部门代码', key: 'count_code', tooltip: true },
        { title: '部门名称', key: 'count_name' },
        { title: '用户状态', key: 'user_status' },
        { title: '信用等级', key: 'credit_name' },
        { title: '注册时间', key: 'user_create', tooltip: true },
        { title: '更新时间', key: 'user_update', tooltip: true }
      ], // 表格列标签
      saleList: [], // 接收销售人员数据
      sliceSaleList: [], // 存储分页数据
      branchList: [], // 存储机构列表
      countList: [], // 存储部门列表
      creditList: [], // 存储信用等级列表
      dataTimer: null
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
    .search
      margin 10px 10px 20px 10px
    .select
      width 100px
      margin-right 10px
    .input
      width 250px
      margin-right 40px
    .button
      width 70px
      margin-right 10px
    .table
      // height 450px
      .sale-table
        height auto
        // max-height 450px
    .page
      // position fixed
      margin-left 10px
      margin-top 10px
</style>
