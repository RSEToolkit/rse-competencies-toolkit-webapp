const path = require('./config')
const rollup = require('rollup')
const nodeResolve = require('@rollup/plugin-node-resolve')
const { babel } = require('@rollup/plugin-babel')
const terser = require('@rollup/plugin-terser')
const { ESLint } = require('eslint')
const configureLogger = require('./logger')

const log = configureLogger('Scripts')

const output = process.argv[2] || 'expanded' // Default to expanded if not provided

const lintJS = async () => {
  log.info('Linting JavaScript...')
  const eslint = new ESLint()
  const results = await eslint.lintFiles(`${path.src_js}/**/*.js`)
  const errorResults = ESLint.getErrorResults(results)

  if (errorResults.length > 0) {
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(errorResults)
    log.error('', resultText)
    throw new Error('Linting errors found')
  } else {
    log.success('Lint JavaScript')
  }
}

const bundleJS = async (output) => {
  log.info('Bundling JavaScript...')
  try {
    const isMinified = output === 'minified'
    const outputFilename = isMinified ? 'theme.min.js' : 'theme.js'

    const inputOptions = {
      input: `./${path.src_js}/theme.js`,
      plugins: [
        nodeResolve(),
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**',
        }),
        isMinified && terser({ output: { comments: /^!|@author|@version/i } }),
      ].filter(Boolean),
      onwarn: (warning, warn) => {
        // Ignore the 'this' at the top level warning
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return
        }
        // Show all other warnings
        warn(warning)
      },
    }

    const outputOptions = {
      file: `${path.js}/${outputFilename}`,
      format: 'iife',
      sourcemap: true,
      banner: `
/**
 * Around | Multipurpose Bootstrap HTML Template
 * Copyright 2023 Createx Studio
 * Theme scripts
 *
 * @author Createx Studio
 * @version 3.2.0
 */
      `,
    }

    const bundle = await rollup.rollup(inputOptions)
    await bundle.write(outputOptions)

    log.success(`Bundled JavaScript (${output})`)
  } catch (error) {
    log.error('', error.message)
  }
}

const buildScripts = async () => {
  try {
    await lintJS()
    if (output === 'expanded' || output === 'minified') {
      await bundleJS(output)
    } else {
      log.error('Invalid output key. Use either "minified" or "expanded"')
    }
  } catch (error) {
    log.error('', error.message)
  }
}

buildScripts()
