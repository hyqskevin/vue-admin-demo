import axios from 'axios'
import qs from 'qs'
import ViewUI from 'iview'

axios.defaults.timeout = 100000
axios.defaults.params = {}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    } else if (config.method === 'get') {
      let newParams = {}
      for (let key in config.params) {
        newParams[key] = encodeURIComponent(config.params[key])
      }
      config.params = newParams
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    // 开始显示LoadingBar
    ViewUI.LoadingBar.start()
    return config
  },
  error => {
    // 失败显示LoadingBar
    ViewUI.LoadingBar.error()
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    let data = response.data
    if (Number(data.resultCode) > 0) {
      // 关闭显示LoadingBar
      ViewUI.LoadingBar.finish()
      return response
    } else {
      ViewUI.LoadingBar.error()
      return response
    }
  },
  error => {
    ViewUI.LoadingBar.error()
    return Promise.reject(error)
  }
)

// 封装获取数据
export const oGet = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}
// 封装发送数据
export const oPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}
// 封装修改数据
export const oUpdate = (url, param, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, param, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}
// 封装删除数据
export const oRemove = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

export default {
  /* 查询 */
  // 获取销售人员数据
  _getSale (uid) {
    return oGet('/api/GetSaler')
  },
  // 获取审批人员数据
  _getCheck () {
    return oGet('/api/GetCheckmen')
  },
  // 获取机构和柜面
  _getBranchCount () {
    return oGet('/api/GetBranchCount')
  },
  // 获取菜单
  _getMenu () {
    return oGet('/api/GetCheckMenu')
  },
  // 获取审批角色
  _getRole () {
    return oGet('/api/GetRole')
  },
  // 获取操作记录
  _getRecord () {
    return oGet('/api/GetCheckRecords')
  },
  // 获取信用等级名称清单
  _getCreditList () {
    return oGet('/api/credit')
  },
  // 获取机构名称清单
  _getBranchList () {
    return oGet('/api/branch')
  },
  // 获取部门名称清单
  _getCountList () {
    return oGet('/api/count')
  },
  // 获取部门代码+名称信息
  _getCount () {
    return oGet('/api/GetCount')
  },
  // 获取管理员信息
  _getManager (uid) {
    return oGet('/api/Manager')
  },
  /* 新建 */
  // 新建审批人员
  _postCheckmen () {
    return 1
  },
  // 新建机构和部门
  _postBranchCount () {
    return 1
  },
  // 新建菜单
  _postCheckMenu () {
    return 1
  },
  // 新建角色
  _postCheckRole () {
    return 1
  },
  // 新建流程
  /* 修改 */
  // 更新销售人员数据
  _updateSale () {
    return oGet('/api/GetSaler')
  },
  // 更新审批人员数据（启用，禁用）
  _updateCheckmenStatus () {
    return 1
  },
  _updateCheckmen () {
    return oGet('/api/GetCheckmen')
  },
  // 更新机构或部门
  _updateBranchCount () {
    return 1
  },
  // 更新菜单
  // 更新角色
  // 更新流程
  // 更新审批单层级
  /* 删除 */
  // 删除审批人员
  _removeCheckmen () {
    return 1
  },
  // 删除机构和部门
  _removeBranchCount () {
    return 1
  },
  // 删除菜单
  _removeMenu () {
    return 1
  },
  // 删除角色
  _removeRole () {
    return 1
  }
  // 删除流程
  // 批量删除
  // _removes(){
  //   var ids = [];
  //   $.each(this.selected, (i, user) => {
  //     ids.push(user.id);
  //   });
  //   ids = ids.join(",");
  //   return oRemove('http://10.16.176.6/WXBxr/'+ ids);
  // },
}
