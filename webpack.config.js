const path = require('path');

module.exports = {
    entry: './src/index.ts',
    resolve: {
        extensions: ['.mjs', '.js', '.ts'],
        mainFields: ['browser', 'module', 'main']
    },
    experiments: {
        topLevelAwait: true,
    },
    module: {
        rules: [{
            test: /\.(txt|svg)$/i,
            use: 'raw-loader',
        },
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: "ts-loader" }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: "web"
}