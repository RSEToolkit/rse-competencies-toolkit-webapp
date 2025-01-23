/**
 * Date / time picker
 * @requires https://github.com/flatpickr/flatpickr
 */

export default (() => {
  const picker = document.querySelectorAll('.date-picker')

  if (picker.length === 0) return

  for (let i = 0; i < picker.length; i++) {
    const defaults = {
      disableMobile: 'true',
    }

    let userOptions
    if (picker[i].dataset.datepickerOptions != undefined)
      userOptions = JSON.parse(picker[i].dataset.datepickerOptions)

    /* eslint-disable no-undef */
    const linkedInput = picker[i].classList.contains('date-range')
      ? { plugins: [new rangePlugin({ input: picker[i].dataset.linkedInput })] }
      : '{}'
    /* eslint-enable no-undef */
    const options = { ...defaults, ...linkedInput, ...userOptions }

    flatpickr(picker[i], options) // eslint-disable-line no-undef
  }
})()
