const path = require('./config')
const rollup = require('rollup')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs') // Fix CommonJS issues
const terser = require('@rollup/plugin-terser')
const fs = require('fs-extra')
const packageFile = require('../../package.json')
const configureLogger = require('./logger')

const log = configureLogger('Vendor')

const excludedDependencies = ['bootstrap', 'smooth-scroll']
const vendorFile = `${path.js}/vendor.bundle.js`

const getVendorEntries = () => {
  const dependencies = Object.keys(packageFile.dependencies).filter(
    (dependency) => !excludedDependencies.includes(dependency)
  )

  return (
    dependencies.map((dep) => `import '${dep}'`).join('\n') +
    "\nimport AOS from 'aos'\nwindow.AOS = AOS" // Expose AOS globally
  )
}

const cleanVendorDirectory = async () => {
  log.info('Cleaning vendor directory...')
  try {
    await fs.emptyDir(path.vendor)
    log.success('Cleaned vendor directory')
  } catch (error) {
    log.error('', `Failed to clean vendor directory: ${error.message}`)
  }
}

const bundleVendorScripts = async () => {
  log.info('Bundling vendor scripts...')
  try {
    const vendorEntry = `${path.src_js}/vendor.js`

    // Generate a temporary entry file
    await fs.writeFile(vendorEntry, getVendorEntries())

    const bundle = await rollup.rollup({
      input: vendorEntry,
      plugins: [
        nodeResolve({ browser: true, preferBuiltins: false }), // Fix module resolution
        commonjs({ include: /node_modules/ }), // Handle CommonJS modules properly
        terser(), // Minify output
      ],
    })

    await bundle.write({
      file: vendorFile,
      format: 'iife',
      sourcemap: true,
    })

    log.success('Bundled vendor scripts successfully')
  } catch (error) {
    log.error('', `Failed to bundle vendor scripts: ${error.message}`)
  }
}

;(async () => {
  await cleanVendorDirectory()
  await bundleVendorScripts()
})()
