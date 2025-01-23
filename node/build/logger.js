const log = require('npmlog')

module.exports = function configureLogger(heading) {
  log.heading = heading
  log.headingStyle = {
    fg: 'cyan',
    bg: 'black',
  }

  log.addLevel('info', 2000, { fg: 'blue', bold: true }, 'Info')
  log.addLevel('success', 3000, { fg: 'green', bold: true }, 'Success')
  log.addLevel('error', 4000, { fg: 'red', bold: true }, 'Error!')
  log.addLevel('warn', 3000, { fg: 'yellow', bold: true }, 'Warn!')

  return log
}
