var path = require('path');
var webpack = require('webpack');

var WebpackNotifierPlugin = require('webpack-notifier');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var chalk = require('chalk');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.NODE_ENV;
var IS_PRODUCTION = ENV === 'production';
var VERSION = JSON.stringify(require('./package.json').version);

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function webpackConfig(options = {}) {

  var config = {
    context: root(),
    debug: true,
    devtool: 'cheap-module-eval-source-map',

    resolve: {
      extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
      root: root('src'),
      descriptionFiles: ['package.json'],
      modules: [
        'node_modules',
        root('src')
      ]
    },

    entry: {
      'bootstrap': './src/bootstrap.ts',
      'polyfills': './src/polyfills.ts',
      'vendor': './src/vendor.ts'
    },

    devServer: {
      outputPath: root('dist'),
      watchOptions: {
        poll: true
      },
      port: 9999,
      hot: options.HMR,
      inject: true,
      stats: {
        modules: false,
        cached: false,
        chunk: false
      }
    },

    output: {
      path: root('dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },

    module: {
      preLoaders: [{
        test: /\.js$/,
        loader: 'source-map',
        exclude: /(node_modules)/
      }
      /* {
        test: /\.ts$/,
        loader: 'tslint'
      } */
      ],
      loaders: [{
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          '@angularclass/hmr-loader'
        ],
        exclude: /(node_modules)/
      }, {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?sourceMap',
          'sass?sourceMap'
        ]
      }, {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw',
        exclude: /node_modules/
      }, {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify',
        exclude: /node_modules/
      }]
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),

      new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'polyfills'],
        minChunks: Infinity
      }),

      new CopyWebpackPlugin([{
        from: 'src/three/assets',
        to: 'assets'
      }]),

      new webpack.DefinePlugin({
        'ENV': JSON.stringify(ENV),
        'HMR': options.HMR,
        'IS_PRODUCTION': IS_PRODUCTION,
        'APP_VERSION': VERSION
      }),

      new webpack.ProvidePlugin({
        'THREE': 'three'
      }),

      new WebpackNotifierPlugin({
        excludeWarnings: true
      }),

      new ProgressBarPlugin({
        format: chalk.yellow.bold('Webpack Building...') + ' [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
      })
    ],

    tslint: {
      emitErrors: false,
      failOnHint: false,
      resourcePath: 'src'
    }
  };

  if(ENV === 'production') {
    config.plugins.push(new HtmlWebpackPlugin({
      template: './index.html',
      inject: false
    }));
  }

  return config;

};

module.exports = webpackConfig;
