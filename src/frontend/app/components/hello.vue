<style lang="stylus" scoped>
	@require "../styles/colors.styl";
	@require "./hello.styl";
</style>

<template>
	<div>
		<p>Greetings Earthlings. We come in peace.</p>
		<button @click="sayName" v-if="!user">Want to know my name?</button>
		<p v-if="user">I am {{user}}</p>
	</div>
</template>

<script>

	export default {
		name: 'Hello',
		methods: {
			sayName() {
				this.$store.dispatch('addUser', 'Bob');
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			}
		}
	};

</script>
