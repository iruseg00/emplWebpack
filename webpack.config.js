// webpack config
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptomizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const Optimization = ()=>                          
{
    const CONFIG = 
    {
        splitChunks: { chunks: 'all' },
    };
    if(isProd) CONFIG.minimizer = [
        new OptomizeCssAssetsWebpackPlugin(),
        new TerserWebpackPlugin()
    ];
    return CONFIG;
};

module.exports = {
    entry: {         
        main: path.resolve(__dirname, './src/js/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: ''
    },
    optimization: Optimization(),
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        compress: true,
        port: 3000,
        hot: false,
        open: true,
    },
    devtool: 'source-map', // isDev ? 'source-map' : false,
    plugins: [
        new HtmlWebpackPlugin({ 
            template: path.resolve(__dirname, './src/html/index.html'),
            filename: 'index.html',
            chunks: ['main']
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        // new CopyWebpackPlugin({ 
        //     patterns: [
        //         { from: path.resolve(__dirname, './src/assets') , to: path.resolve(__dirname, './dist') }
        //     ]
        // }),
    ],
    module: {
        rules: [
            {   
                test: /\.css$/i,            
                use: [ MiniCssExtractPlugin.loader,  'css-loader' ],
            },
            {  
                test: /\.s[ac]ss$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
            },
            {   
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                  name(resourcePath, resourceQuery) {
                    // `resourcePath` - `/absolute/path/to/file.js`
                    // `resourceQuery` - `?foo=bar`
                    return isDev ? './img/[contenthash].[ext]' : './img/[name].[contenthash].[ext]';
                  },
                },
            },   
            {   
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: ['babel-loader']
            },
            {   
                test: /\.(ttf|woff|woff2|eot)$/i,           
                loader: 'file-loader',
                options: {
                    name(resourcePath, resourceQuery) {
                      // `resourcePath` - `/absolute/path/to/file.js`
                      // `resourceQuery` - `?foo=bar`
                      return isDev ? 'assets/fonts/[name].[ext]' : 'assets/fonts/[name].[ext]';
                    },
                }    
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ]
    }
}