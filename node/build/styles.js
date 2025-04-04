const { execSync } = require('child_process')
const path = require('./config')
const stylelint = require('stylelint')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const fs = require('fs')
const configureLogger = require('./logger')

const log = configureLogger('Styles')

const output = process.argv[2] || 'expanded'

function runScript(alias, script) {
  try {
    const stdout = execSync(script).toString()
    log.success(`${alias}: ${stdout.trim()}`)
  } catch (error) {
    log.error('', `Task ${alias} hasn't been completed! ${error.stdout.toString()}`)
  }
}

const lintScss = async () => {
  log.info('Linting SCSS...')

  const result = await stylelint.lint({
    files: `${path.scss}/**/*.scss`,
    configFile: '.stylelintrc.json',
  })

  if (result.errored) {
    const formattedErrors = stylelint.formatters.string(result.results)
    log.error('', formattedErrors)
    throw new Error('Linting errors found')
  } else {
    log.success('Lint SCSS')
  }
}

const runSass = async (outputStyle) => {
  const outputFile = outputStyle === 'compressed' ? '.min' : ''
  const sassCommand = `sass --style ${outputStyle} --source-map --embed-sources --no-error-css --load-path=node_modules ${path.scss}/theme.scss:${path.css}/theme${outputFile}.css`

  log.info(`Building ${outputStyle} CSS...`)
  runScript(`Compile SCSS to CSS (${outputStyle})`, sassCommand)

  const cssPath = `${path.css}/theme${outputFile}.css`
  const cssMapPath = `${path.css}/theme${outputFile}.css.map`

  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    const result = await postcss([autoprefixer]).process(cssContent, {
      from: cssPath,
      to: cssPath,
    })
    fs.writeFileSync(cssPath, result.css)
    if (result.map) {
      fs.writeFileSync(cssMapPath, result.map.toString())
    }
    log.success(`Added vendor prefixes (Autoprefixer)`)
  }
}

const buildStyles = async () => {
  try {
    await lintScss()
    await runSass(output === 'minified' ? 'compressed' : 'expanded')
  } catch (error) {
    log.error('', error.message)
  }
}

if (output === 'expanded' || output === 'minified') {
  buildStyles()
} else {
  log.error('Invalid output key. Use either "minified" or "expanded"')
}
