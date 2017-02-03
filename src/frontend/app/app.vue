<style lang="stylus">
	@require "./app.styl";
</style>

<template>
	<div id="test"><p>This is my {{ number }} template </p></div>
</template>

<script lang="babel">

	module.exports = {
		name: 'app',
		data() {
			return {
				number: 'first'
			};
		}
	}

</script>
