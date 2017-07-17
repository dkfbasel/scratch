var path = require('path');
var webpack = require('webpack');
var poststylus = require('poststylus');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

// note: we prefer using includes over excludes, as this will give us finer
// control over what is actually transpiled
var appDirectory = path.resolve(__dirname, 'app');
var includes = [appDirectory];

// specify the configuration to use for developnet
var developConfig = {
	// use the dev server included with webpack for live-reload development
	// note: that the port and host can be changed here if require
	devServer: {
		contentBase: '/tmp/public',
		historyApiFallback: true,
		noInfo: true,
		host: '0.0.0.0',
		overlay: true,
		port: 3000,
		// proxy api calls to a container named api
		proxy: {
			'/api/**': {
				target: 'http://api',
				secure: false
			}
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
		}
	},
	performance: {
		hints: false
	},
	devtool: '#cheap-module-eval-source-map',

	// define the entry point of the application
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
				options: {
					loaders: {
						stylus: 'vue-style-loader!css-loader!stylus-loader',
						styl: 'vue-style-loader!css-loader!stylus-loader',
						js: 'babel-loader'
					}
				},
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
				test: /\.styl$/,
				use: ['style-loader', 'css-loader', 'stylus-loader'],
				include: includes
			}, {
				// parse css styles
				test: /\.css$/,
				use: ['style-loader','css-loader','postcss-loader'],
				include: includes
			}
		]
	},
	resolve: {
		alias: {
			// resolve vue to non minified bundle for development
			vue: 'vue/dist/vue.common.js'
		}
	}
};

// specify configuration to be used to build for production
var buildConfig = {
	// add babel polyfill to support older browsers
	entry: {
		app: ['babel-polyfill', path.resolve(__dirname, 'app/main.js')]
	},
	// use the same configuration for the output as in dev mode
	output: developConfig.output,
	// generate source maps for the code
	devtool: '#source-map',
	// specify the module configuration
	module: {
		rules: [
			{
				// parse vue components
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						stylus: ExtractTextPlugin.extract({
							use: ['css-loader', 'stylus-loader'],
							fallback: 'vue-style-loader'
						}),
						styl: ExtractTextPlugin.extract({
							use: ['css-loader', 'stylus-loader'],
							fallback: 'vue-style-loader'
						}),
						js: 'babel-loader'
					}
				},
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
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract({
					use: ['css-loader', 'stylus-loader'],
					fallback: 'style-loader'
				}),
				include: includes
			}, {
				// parse css styles
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					use: ['css-loader', 'postcss-loader'],
					fallback: 'style-loader'
				}),
				include: includes
			}
		]
	},
	// define plugins to use
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		// extract all styles into one single css file
		new ExtractTextPlugin({
			filename: 'app.css',
			allChunks: true
		}),
		// use babel to transpile js code
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false,
			options: {
				// babel needs to set the context path here!
				context: __dirname,
				// babel presets and plugins need to be specified here
				babel: {
					presets: ['es2015', 'stage-0'],
					plugins: ['transform-runtime']
				}
			}
		}),
		// use uglify for minification
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true
			},
			output: {
				comments: false
			}
		})
	]
};


// override some build config to extract the text

// use specific configuration depending on build mode
if (process.env.NODE_ENV !== 'production') {
	console.log('-- using development config');
	module.exports = developConfig;

} else {
	console.log('-- using production config');
	module.exports = buildConfig;

}
