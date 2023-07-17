'use strict'

const path = require('node:path')
const globby = require('globby')
const { rimrafSync } = require('rimraf')
const { babel } = require('@rollup/plugin-babel')
const eslint = require('@rollup/plugin-eslint')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const terser = require('@rollup/plugin-terser')
const banner = require('../.config/banner')


const LINT = process.env.LINT === 'true'
const MINIFIED = process.env.MINIFIED === 'true'

const rollupConfigs = []
const extensions = [
    '.js', '.jsx', '.ts', '.tsx', '.mjs',
]

const terserPlugin = terser();

const plugins = []

if (LINT) {
    plugins.push(eslint())
}

plugins.push(...[
    babel({
        extensions,
        exclude: 'node_modules/**/*.js',
        babelHelpers: 'bundled',
    }),
    nodeResolve({
        extensions,
        mainFields: ['module'],
    }),
])


// Clear dist
rimrafSync(path.resolve(__dirname, '../dist/*'), {
    glob: true,
});


// Main
const tsFiles = [
    'tom-select',
    'tom-select.complete',
    'tom-select.popular',
    'utils',
]

for (const fileName of tsFiles) {
    // ESM
    rollupConfigs.push({
        input: path.resolve(__dirname, `../src/${fileName}.ts`),
        output: {
            banner,
            file: path.resolve(__dirname, `../dist/esm/${fileName}.js`),
            format: 'esm',
            generatedCode: 'es2015',
            preserveModules: false,
            sourcemap: true,
        },
        plugins: plugins,
    })

    // ESM minified
    rollupConfigs.push({
        input: path.resolve(__dirname, `../src/${fileName}.ts`),
        output: {
            banner,
            file: path.resolve(__dirname, `../dist/esm/${fileName}.min.js`),
            format: 'esm',
            generatedCode: 'es2015',
            preserveModules: false,
            sourcemap: true,
        },
        plugins: [ ...plugins, terserPlugin ],
    })

    // CJS
    rollupConfigs.push({
        input: path.resolve(__dirname, `../src/${fileName}.ts`),
        output: {
            banner,
            file: path.resolve(__dirname, `../dist/cjs/${fileName}.js`),
            format: 'cjs',
            generatedCode: 'es2015',
            preserveModules: false,
            sourcemap: true,
            exports: 'auto',
        },
        plugins: plugins,
    })

    // CJS minified
    rollupConfigs.push({
        input: path.resolve(__dirname, `../src/${fileName}.ts`),
        output: {
            banner,
            file: path.resolve(__dirname, `../dist/cjs/${fileName}.min.js`),
            format: 'cjs',
            generatedCode: 'es2015',
            preserveModules: false,
            sourcemap: true,
            exports: 'auto',
        },
        plugins: [ ...plugins, terserPlugin ],
    })
}


// Plugins
const pluginSourcePath = path.posix.resolve(__dirname, '../src/plugins/')
const pluginFiles = globby.sync(`${pluginSourcePath}/**/plugin.ts`)

for (const file of pluginFiles) {
    const pluginName = path.basename(path.dirname(file))

    // ESM
    rollupConfigs.push({
        input: file,
        output: {
            banner,
            file: path.resolve(__dirname, `../dist/plugins/${pluginName}/plugin.js`),
            format: 'esm',
            generatedCode: 'es2015',
            preserveModules: false,
            sourcemap: true,
        },
        plugins: plugins,
    })

    // ESM minified
    rollupConfigs.push({
        input: file,
        output: {
            banner,
            file: path.resolve(__dirname, `../dist/plugins/${pluginName}/plugin.min.js`),
            format: 'esm',
            generatedCode: 'es2015',
            preserveModules: false,
            sourcemap: true,
        },
        plugins: [ ...plugins, terserPlugin ],
    })
}

module.exports = rollupConfigs
