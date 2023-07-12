'use strict'

const pkg = require('../package.json')

const year = new Date().getFullYear()

function getBanner() {
  return `/*!
  * Tom Select v${pkg.version} (${pkg.homepage})
  * Copyright 2012-${year} ${pkg.author}
  * Licensed under the Apache License, Version 2.0 (the "License")
  */`
}

module.exports = getBanner
