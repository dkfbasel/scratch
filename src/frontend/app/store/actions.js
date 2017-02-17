// define the actions that can be called from components
const actions = {

	// actions should be camelcased
	addUser({commit}, name) {

		// always use object style commits for consistency
		commit({
			type: 'ADD_USER',
			name: name
		});

	}

};

export default actions;
