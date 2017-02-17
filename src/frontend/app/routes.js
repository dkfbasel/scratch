// import components for specific routes
import HelloComponent from './components/hello.vue';

// define the routing paths
const routes = [
	{
		path: '/hello',
		name: 'hello',
		component: HelloComponent,
		alias: ['/']
	}
];

export default routes;
