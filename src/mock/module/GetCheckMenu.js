let Mock = require('mockjs')
let GetCheckMenu = {
  'resultCode': '4',
  'applInfo|4': [
    {
      'menu_code': '0001',
      'menu_name': Mock.mock('@title')
    },
    {
      'menu_code': '0002',
      'menu_name': Mock.mock('@title')
    }
  ]
}

module.exports = GetCheckMenu
