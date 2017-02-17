// define the root store mutations
const mutations = {

	// note: mutation names should be in uppercase letters to be clearly
	// distinguished from actions
	ADD_USER(state, payload) {
		state.user = payload.name;
	}

};

export default mutations;
