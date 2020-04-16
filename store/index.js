import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
	sys_info: {}
};

const getters = {
	sys_info: state => state.sys_info
};

const mutations = {
	SET_SYS_INFO(state, d) {
		state.sys_info = d;
	}
};

const actions = {};

const store = new Vuex.Store({
	modules: {},
	state,
	getters,
	mutations,
	actions,
});

export default store;
