let Mock = require('mockjs')
let GetBranchCount = {
  'resultCode': '20',
  'applInfo|20': [
    {
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': Mock.mock('@county')
    },
    {
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': Mock.mock('@county')
    },
    {
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': Mock.mock('@county')
    },
    {
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': Mock.mock('@county')
    }
  ]
}

module.exports = GetBranchCount
