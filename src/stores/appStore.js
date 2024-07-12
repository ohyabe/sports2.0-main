import { createStore } from 'vuex';

const savedUserType = localStorage.getItem('userType') || 'guest';

const store = createStore({
  state: {
    userType: savedUserType
  },
  mutations: {
    setUserType(state, userType) {
      state.userType = userType;
      localStorage.setItem('userType', userType); // 保存到 localStorage
    },
    logout(state) {
      state.userType = 'guest';
      localStorage.removeItem('userType'); // 從 localStorage 中移除
    }
  },
  actions: {
    setUserType({ commit }, userType) {
      commit('setUserType', userType);
    },
    logout({ commit }) {
      commit('logout');
    }
  }
});

export default store;
