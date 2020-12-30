let Mock = require('mockjs')
let GetCheckmen = {
  'resultCode': '10',
  'applInfo|10': [
    {
      'user_code': Mock.mock('@id'),
      'user_name': Mock.mock('@cname'),
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': '公司',
      'role_code': '2',
      'role_name': Mock.mock('@ctitle'),
      'user_status': '正常',
      'user_create': Mock.mock('@datetime')
    },
    {
      'user_code': Mock.mock('@id'),
      'user_name': Mock.mock('@cname'),
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': '公司',
      'role_code': '2',
      'role_name': Mock.mock('@ctitle'),
      'user_status': '正常',
      'user_create': Mock.mock('@datetime')
    },
    {
      'user_code': Mock.mock('@id'),
      'user_name': Mock.mock('@cname'),
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': '公司',
      'role_code': '2',
      'role_name': Mock.mock('@ctitle'),
      'user_status': '正常',
      'user_create': Mock.mock('@datetime')
    },
    {
      'user_code': Mock.mock('@id'),
      'user_name': Mock.mock('@cname'),
      'branch_code': Mock.mock('@zip'),
      'branch_name': Mock.mock('@county'),
      'count_code': Mock.mock('@zip'),
      'count_name': '公司',
      'role_code': '2',
      'role_name': Mock.mock('@ctitle'),
      'user_status': '正常',
      'user_create': Mock.mock('@datetime')
    }
  ]
}

module.exports = GetCheckmen
