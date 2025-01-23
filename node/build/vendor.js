const path = require('./config')
const fs = require('fs-extra')
const packageFile = require('../../package.json')
const configureLogger = require('./logger')

const log = configureLogger('Vendor')

const excludedDependencies = ['bootstrap', 'smooth-scroll']

const cleanVendorDirectory = async () => {
  log.info('Cleaning vendor directory...')
  try {
    await fs.emptyDir(path.vendor)
    log.success('Cleaned vendor directory')
  } catch (error) {
    log.error('', `Failed to clean vendor directory: ${error.message}`)
  }
}

const copyDependencies = async () => {
  log.info('Copying dependencies...')
  const dependencies = Object.keys(packageFile.dependencies).filter(
    (dependency) => !excludedDependencies.includes(dependency)
  )

  let errors = 0
  for (const dependency of dependencies) {
    try {
      await fs.copy(`node_modules/${dependency}`, `${path.vendor}/${dependency}`)
    } catch (error) {
      errors++
      log.error('', `Failed to copy ${dependency}: ${error.message}`)
    }
  }

  if (errors === 0) {
    log.success('All dependencies copied successfully')
  } else {
    log.error('', `${errors} dependencies failed to copy`)
  }
}

;(async () => {
  await cleanVendorDirectory()
  await copyDependencies()
})()
