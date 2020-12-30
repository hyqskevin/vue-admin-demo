import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let defaultMenu = 0
let userId = ''

export default new Vuex.Store({
  state: {
    currentMenu: defaultMenu,
    currentUser: userId
  },
  mutations: {
    changeMenuClick (state, menu) {
      state.currentMenu = menu
      try {
        localStorage.menu = menu
      } catch (e) {}
    },
    getUserId (state, user) {
      state.currentUser = user
      try {
        localStorage.userId = user
      } catch (e) {}
    }
  }
})
