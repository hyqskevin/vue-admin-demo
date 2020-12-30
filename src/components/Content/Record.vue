<template>
  <div class="content">
    <Table stripe :columns="recordColumns" :data="sliceRecordList" class="record-table"/>
    <Page :total="recordCount" :page-size="pageSize" @on-change="changePage" show-elevator show-total class="page"></Page>
  </div>
</template>

<script>
import api from '@/plugin/api.js'
export default {
  name: 'Record',
  methods: {
    getRecordInfo () {
      api._getRecord().then(res => {
        // data接收传值
        if (Number(res.resultCode) > 0) {
          this.recordList = res.applInfo
          this.recordCount = Number(res.resultCode)
          clearInterval(this.dataTimer)
          // 初始化分页显示
          if (this.recordCount < this.pageSize) {
            this.sliceRecordList = this.recordList
          } else {
            this.sliceRecordList = this.recordList.slice(0, this.pageSize)
          }
        } else {
          alert('Record Error. Return resultCode:' + res.resultCode)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (page) {
      // 点击分页按钮进行跳转
      let _start = (page - 1) * this.pageSize
      let _end = page * this.pageSize
      this.sliceRecordList = this.recordList.slice(_start, _end)
    }
  },
  mounted () {
    // 首次进入页面，执行ajax请求
    this.getRecordInfo()
  },
  data () {
    return {
      recordCount: 0, // 记录数量
      pageSize: 10, // 每页显示数量
      recordColumns: [
        { title: '记录号', key: 'record_id', width: 100 },
        { title: '工号', key: 'user_code', width: 100 },
        { title: '操作名称', key: 'record_name', width: 160 },
        { title: '操作记录', key: 'record_content' },
        { title: '结果', key: 'record_result', width: 80 },
        { title: '操作时间', key: 'record_time' }
      ], // 表格列标签
      recordList: [], // 接收数据
      sliceRecordList: [], // 存储分页数据
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
    .record-table
      height auto
    .page
      margin-top 10px
</style>
