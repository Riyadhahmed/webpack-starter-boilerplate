const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({template: "./src/index.html"});
const miniCssExtractPlugin = new MiniCssExtractPlugin({filename: "[name].[contenthash].css", chunkFilename: "[name].[chunkhash].css"})
const cleanWebpackPlugin = new CleanWebpackPlugin(['dist'])

module.exports = {
    entry: {
        main: './src/index.js',
        vendors: ['jquery', 'bootstrap', 'popper.js']
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[chunkhash].js',
        publicPath: './'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
          ],
        usedExports: true,
        splitChunks: {
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    name: 'vendors',
                    chunks: 'all'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    }, {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve
                        // them
                        loader: 'css-loader'
                    }
                ]
            }, {
                test: /\.(scss)$/,
                use: [
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [require('autoprefixer')];
                            }
                        }
                    }, {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }, {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            outputPath: 'images',
                            limit: 10 * 1024, // Convert images < 10kb to base64 strings
                            name: '[hash]-[name].[ext]'
                        }
                    },
                    'image-webpack-loader'
                ]
            }

        ]
    },
    plugins: [
        htmlWebpackPlugin, miniCssExtractPlugin, cleanWebpackPlugin, new webpack.HotModuleReplacementPlugin()
    ]
};