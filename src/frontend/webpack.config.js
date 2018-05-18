var path = require('path');
var webpack = require('webpack');
var poststylus = require('poststylus');
var autoprefixer = require('autoprefixer');

var VueLoaderPlugin = require('vue-loader/lib/plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

// note: we prefer using includes over excludes, as this will give us finer
// control over what is actually transpiled
var appDirectory = path.resolve(__dirname, 'app');
var nodeModules = path.resolve(__dirname, 'node_modules');
var includes = [appDirectory];

// note: we prefer using includes over excludes, as this will give us finer
// control over what is actually transpiled
var appDirectory = path.resolve(__dirname, 'app');
var nodeModules = path.resolve(__dirname, 'node_modules');
var includes = [appDirectory];

// define specific proxy routes
var proxyConfig = {
	'/api': {
		target: 'http://profiles.graphql',
		secure: false
	}
};


// basic configuration shared for development and production build
var config = {
	entry: {
		app: [path.resolve(__dirname, 'app/main.js')]
	},
	output: {
		path: '/tmp/public/assets',
		filename: '[name].bundle.js',
		publicPath: '/assets/'
	},
	module: {
		rules: [
			{
				// parse vue components
				test: /\.vue$/,
				loader: 'vue-loader',
				include: includes
			}, {
				// parse javascript files (use babel to transpile)
				// note that presets and plugins must be defined as plugin
				// settings (at least for now)
				test: /\.js$/,
				loader: 'babel-loader',
				include: includes
			},  {
				// parse stylus styles
				test: /\.styl(us)?$/,
				use: [
					process.env.NODE_ENV !== 'production' ?
					'vue-style-loader': MiniCssExtractPlugin.loader,
					'css-loader', 'stylus-loader'],
				include: [appDirectory, nodeModules + '/nib']
			}, {
				// parse css styles
				test: /\.css$/,
				use: [
					process.env.NODE_ENV !== 'production' ?
					'vue-style-loader': MiniCssExtractPlugin.loader,
					'css-loader','postcss-loader'],
				include: [appDirectory, nodeModules + '/vue-multiselect/dist']
			}, {
				// include all svg-files as vue components
				test: /\.svg$/,
				loader: 'vue-svg-loader',
				options: {
					svgo: {
						plugins: [
							{removeDoctype: true},
							{removeComments: true}
						]
					}
				}
			}
		]
	},
	resolve: {
		modules: [
			path.resolve('./app'),
			path.resolve('./node_modules')
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};


// override some build config to extract the text

// use specific configuration depending on build mode
if (process.env.NODE_ENV !== 'production') {

	console.log('-- using development config');

	config.mode = 'development';

	config.devtool = '#cheap-module-eval-source-map';

	// setup devserver config
	config.devServer = {
		contentBase: '/tmp/public',
		historyApiFallback: true,
		noInfo: true,
		
		host: '0.0.0.0',
		port: 3000,

		// proxy api calls to a container named api
		proxy: proxyConfig,

		before(app) {
			app.get('/assets/*.css', function(req, res) {
				res.setHeader('Content-Type', 'text/css');
				res.send('');
			});
		},
		stats: {
			assets: true,
			children: false,
			chunks: false,
			hash: false,
			modules: false,
			publicPath: true,
			timings: true,
			version: false,
			warnings: true
		},
		overlay: true
	};

	// resolve vue to non minified bundle for development
	config.resolve.alias = {
		vue: 'vue/dist/vue.common.js'
	};


} else {

	console.log('-- using production config');

	config.mode = 'production';

	// add babel-polyfill to the build
	config.entry.app.unshift('babel-polyfill');

	// create source maps for the minified code
	config.devtool = '#source-map',

	// add some more plugins to the plugin array
	config.plugins.unshift(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}));

	// add a plugin to extract all css into separate files
	config.plugins.push(new MiniCssExtractPlugin({
		filename: 'app.css',
		allChunks: true
	}));

}

module.exports = config;
