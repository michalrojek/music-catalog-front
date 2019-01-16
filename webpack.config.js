const path = require('path');

module.exports = {
    //the entry file for the bundle
    entry: path.join(__dirname, '/client/src/app.jsx'),

    //the bundle file we will get in the result
    output: {
        path: path.join(__dirname, '/client/dist/js'),
        filename: 'app.js',
    },
    
    module: {

        //apply loaders to file that meet given conditions
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, '/client/src'),
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ["react", "env", 'stage-2'],
                plugins: ['transform-class-properties']
            }
        }],
    },

    devServer: {
        historyApiFallback: true
    },

    //start Webpack in a watch mode, so webpack will rebuild the bundle on changes
    watch: true
};