const path = require('path');

const createExport = (input, output) => {
    return {
        entry: input,
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
            filename: output,
            path: path.resolve(__dirname, 'dist'),
        },
        target: "web"
    }
}

module.exports = [
    createExport('./src/index.ts', 'index.js'),
    createExport('./src/index.edpuzzle.ts', 'edpuzzle.user.js')
];