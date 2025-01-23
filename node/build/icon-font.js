const path = require('./config.js')
const { generateFonts, FontAssetType } = require('fantasticon')
const { optimize } = require('svgo')
const cssnano = require('cssnano')
const fs = require('fs-extra')
const postcss = require('postcss')
const configureLogger = require('./logger')

const log = configureLogger('IconFont')

const svgOptimizeOptions = {
  removeViewBox: false,
  removeDimensions: true,
}

const generateFontsOptions = {
  inputDir: path.icons.src,
  outputDir: path.icons.output,
  fontTypes: [FontAssetType.WOFF2],
  assetTypes: ['css'],
  fontsUrl: './',
  tag: '',
  prefix: path.icons.cssPrefix,
  name: path.icons.fontName,
}

const cleanOutputDirectory = async () => {
  await fs.emptyDir(path.icons.output)
}

const optimizeSvgIcons = async (options) => {
  log.info('Optimizing SVG icons...')
  const files = fs.readdirSync(path.icons.src)

  for (let file of files) {
    if (file.endsWith('.svg')) {
      const data = fs.readFileSync(`${path.icons.src}/${file}`, 'utf8')
      const result = await optimize(data, options)
      fs.writeFileSync(`${path.icons.src}/${file}`, result.data)
    }
  }
  log.success('Optimized SVG icons')
}

const minifyCss = async () => {
  const cssFileName = `${path.icons.fontName}.css`
  const minifiedCssFileName = `${path.icons.fontName}.min.css`
  const css = fs.readFileSync(`${path.icons.output}/${cssFileName}`, 'utf8')
  const result = await postcss([cssnano]).process(css, { from: undefined })
  fs.writeFileSync(`${path.icons.output}/${minifiedCssFileName}`, result.css)

  // delete the original .css file
  try {
    fs.unlinkSync(`${path.icons.output}/${cssFileName}`)
  } catch (err) {
    console.error(`Error while deleting ${cssFileName}.`, err)
  }
}

;(async () => {
  await cleanOutputDirectory()
  await optimizeSvgIcons(svgOptimizeOptions)
  log.info('Generating font...')
  await generateFonts(generateFontsOptions)
  log.success('Font generated')
  await minifyCss()
})().catch((error) => log.error('', 'An error occurred:', error))
