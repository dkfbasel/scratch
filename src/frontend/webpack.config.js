var path = require('path');
var webpack = require('webpack');
var poststylus = require('poststylus');
var autoprefixer = require('autoprefixer');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

require('babel-polyfill');

// note: we prefer using includes over excludes, as this will give us finer
// control over what is actually transpiled
var appDirectory = path.resolve(__dirname, 'app');
var includes = [appDirectory];

module.exports = {
	devServer: {
		contentBase: '/tmp/public',
		historyApiFallback: true,
		noInfo: true,
		host: '0.0.0.0',
		port: 3000,
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
	devtool: '#eval-source-map',
	entry: {
		app: [path.resolve(__dirname, 'app/main.js')]
	},
	output: {
		path: '/tmp/build/assets',
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
						stylus: ExtractTextPlugin.extract({
							use: ['css-loader', 'stylus-loader'],
							fallback: 'vue-style-loader'
						})
					}
				},
				include: includes
			}, {
				// parse css styles
				test: /\.css$/,
				use: ['style-loader','css-loader','postcss-loader'],
				include: includes
			}, {
				// parse javascript files (use babel to transpile)
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'stage-0'],
					plugins: ['transform-runtime']
				},
				include: includes
			}, {
				// parse stylus styles
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract({
					use: ['css-loader', 'stylus-loader'],
					fallback: 'style-loader'
				}),
				include: includes
			}
		]
	},
	resolve: {
		alias: {
			// resolve vue to non minified bundle for development
			vue: 'vue/dist/vue.js'
		}
	},
	plugins: [
		// extract all styles into one single css file
		new ExtractTextPlugin({
			filename: 'app.css',
			allChunks: true
		})
	]
};


if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map';

	// use babel polyfill for production builds (for ie support)
	module.exports.entry = {
		app: ['babel-polyfill', path.resolve(__dirname, 'app/main.js')]
	},

	// resolve vue to the minified module
	module.exports.resolve = {},

	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		// use babel to transpile js code
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false,
			options: {
				// babel needs to set the context path here!
				context: __dirname,
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
	]);
}
