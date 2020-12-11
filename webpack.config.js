const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let tsToJs = {
    mode: "development",
    devtool: "inline-source-map",
    target: "es5",
    entry: {
        main: "./src/ts/Fluentize.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist/js'),
        filename: "Fluentize.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
};

module.exports = tsToJs;