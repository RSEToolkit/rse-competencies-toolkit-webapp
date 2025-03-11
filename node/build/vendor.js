const path = require('./config')
const rollup = require('rollup')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const terser = require('@rollup/plugin-terser')
const virtual = require('@rollup/plugin-virtual')
const fs = require('fs-extra')
const packageFile = require('../../package.json')
const configureLogger = require('./logger')

const log = configureLogger('Vendor')

const excludedDependencies = ['bootstrap', 'smooth-scroll']
const vendorJsFile = `${path.js}/vendor.bundle.js`
const vendorCssFile = `${path.css}/vendor.bundle.css`

const externalVendorStyles = ['aos/dist/aos.css']

const getVendorEntries = () => {
  const dependencies = Object.keys(packageFile.dependencies).filter(
    (dependency) => !excludedDependencies.includes(dependency)
  )

  return (
    dependencies.map((dep) => `import '${dep}'`).join('\n') +
    "\nimport AOS from 'aos'\nwindow.AOS = AOS"
  )
}

const bundleVendorScripts = async () => {
  log.info('Bundling vendor scripts...')
  try {
    const bundle = await rollup.rollup({
      input: 'virtual-vendor',
      plugins: [
        virtual({ 'virtual-vendor': getVendorEntries() }),
        nodeResolve({ browser: true, preferBuiltins: false }),
        commonjs({ include: /node_modules/ }),
        terser(),
      ],
    })

    await bundle.write({
      file: vendorJsFile,
      format: 'iife',
      sourcemap: true,
    })

    log.success('Bundled vendor scripts successfully')
  } catch (error) {
    log.error('', `Failed to bundle vendor scripts: ${error.message}`)
  }
}

const bundleVendorStyles = async () => {
  log.info('Bundling vendor styles...')
  try {
    let combinedStyles = ''

    for (const stylePath of externalVendorStyles) {
      const fullPath = require.resolve(stylePath)
      const cssContent = await fs.readFile(fullPath, 'utf8')
      combinedStyles += `/* ${stylePath} */\n${cssContent}\n`
    }

    await fs.writeFile(vendorCssFile, combinedStyles)
    log.success('Bundled vendor styles successfully')
  } catch (error) {
    log.error('', `Failed to bundle vendor styles: ${error.message}`)
  }
}

;(async () => {
  await bundleVendorScripts()
  await bundleVendorStyles()
})()
