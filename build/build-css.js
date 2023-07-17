#!/usr/bin/env node

'use strict'

const fs = require('node:fs')
const path = require('node:path')
const globby = require('globby')
const sass = require('sass')

const resolvedScssFiles = []


// Main
const scssFiles = [
    'tom-select',
    'tom-select.default',
    'tom-select.bootstrap4',
    'tom-select.bootstrap5',
]

for (const fileName of scssFiles) {
    resolvedScssFiles.push({
        src: path.resolve(__dirname, `../src/scss/${fileName}.scss`),
        dist: path.resolve(__dirname, `../dist/css/${fileName}.css`),
    })
}


// Plugins
const pluginSourcePath = path.posix.resolve(__dirname, '../src/plugins/')
const pluginScssFiles = globby.sync(`${pluginSourcePath}/**/plugin.scss`)

for (const filePath of pluginScssFiles) {
    const pluginName = path.basename(path.dirname(filePath))

    resolvedScssFiles.push({
        src: filePath,
        dist: path.resolve(__dirname, `../dist/plugins/${pluginName}/plugin.css`),
    })
}


console.log(resolvedScssFiles)
for (const file of resolvedScssFiles) {
    fs.copyFileSync(file.src, file.dist)

    sass.compile(file.dist)
}
