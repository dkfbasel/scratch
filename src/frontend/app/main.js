import Vue from 'vue';
import App from './app.vue';

if (process.env.NODE_ENV === 'production') {
	Vue.config.devtools = true;
}

new Vue({
	el: '#app',
	render: h => h(App)
});
