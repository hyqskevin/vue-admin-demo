// 使用 Mock
let Mock = require('mockjs')
let Random = Mock.Random
Random.id()
Random.cname()
Random.zip()
Random.county()
Random.datetime()
Random.title()

let Getsaler = require('./module/GetSaler')
let GetCheckmen = require('./module/GetCheckmen')
let GetBranchCount = require('./module/GetBranchCount')
let GetCheckMenu = require('./module/GetCheckMenu')
let Manager = require('./module/Manager')

module.exports = Mock.mock({
  Getsaler,
  GetCheckmen,
  GetBranchCount,
  GetCheckMenu,
  Manager
})
