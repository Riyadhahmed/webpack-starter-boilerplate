const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({template: "./src/index.html"});
const miniCssExtractPlugin = new MiniCssExtractPlugin({filename: "[name].css", chunkFilename: "[id].css"})
const cleanWebpackPlugin = new CleanWebpackPlugin(['dist'])

module.exports = {
    entry: {
        index: './src/index.js',
        vendor: ['jquery', 'bootstrap']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
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
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }

        ]
    },
    plugins: [htmlWebpackPlugin, miniCssExtractPlugin, cleanWebpackPlugin, new webpack.HotModuleReplacementPlugin()]
};