/**
 * Countdown timer
 * @requires https://github.com/BrooonS/timezz
 */

export default (() => {
  const timers = document.querySelectorAll('.countdown')
  if (timers.length === 0) return

  for (let i = 0; i < timers.length; i++) {
    const date = timers[i].dataset.countdownDate

    /* eslint-disable no-undef */
    timezz(timers[i], {
      date: date,
      // add more options here
    })
    /* eslint-enable no-undef */
  }
})()
