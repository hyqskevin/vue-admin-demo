const Mock = require('mockjs') // 引入mockJS
const Random = Mock.Random
Random.word(5)
Random.region()
Random.time()
Random.now()
Random.datetime()
Random.sentence(3, 5)

// function userData (n) {
// let _data = []
// }
function applData () {
  return [{
    'id|+1': 1,
    'appl_id|10000-99999': 11111,
    'appl_name': '@word',
    'branch_id|100000-399999': 330200,
    'dept_id|100000-399999': 330200,
    'area|1': ['shinei', 'shengnei', 'shengwai'],
    'start_area': '@region',
    'end_area': '@region',
    'start_time': '@now',
    'back_time': '@now',
    'reason': '@sentence',
    'branch_car|1': true,
    'node_status|1': ['w', 'y', 'n', 'yc', 'nc']
  }]
}
function dispatchData () {
  return [{
    'appl_id|10000-39999': 11111,
    'driver_id|40000-99999': 11111,
    'car_num|11111-99999': 11111,
    'send_time': '@now',
    'status|1': ['w', 's', 'e'],
    'start_miles|10-50': 20,
    'end_miles|100-300': 233,
    'time': '@time',
    'reason': '@sentence'
  }]
}

const template = {
  // 'user|': userData(),
  'application|20': applData(),
  'dispatch|10': dispatchData()
}

module.exports = () => {
  return Mock.mock(template)
}
