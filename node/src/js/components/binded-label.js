/**
 * Update the text of the label when radio button / checkbox changes
 */

export default (() => {
  const toggleBtns = document.querySelectorAll('[data-binded-label]')

  for (let i = 0; i < toggleBtns.length; i++) {
    toggleBtns[i].addEventListener('change', function () {
      const target = this.dataset.bindedLabel
      try {
        document.getElementById(target).textContent = this.value
      } catch (err) {
        /* eslint-disable no-constant-condition */
        if ((err.message = "Cannot set property 'textContent' of null")) {
          console.error(
            'Make sure the [data-binded-label] matches with the id of the target element you want to change text of!'
          )
        }
        /* eslint-enable no-constant-condition */
      }
    })
  }
})()
