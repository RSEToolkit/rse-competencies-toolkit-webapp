/**
 * Toggle that checks / unchecks all target checkboxes at once
 */

export default (() => {
  const toggler = document.querySelectorAll('[data-bs-toggle="checkbox"]')

  if (toggler.length === 0) return

  for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener('click', (e) => {
      e.preventDefault()

      let checkboxListContainer = document.querySelector(e.target.dataset.bsTarget),
        checkboxList = checkboxListContainer.querySelectorAll('input[type="checkbox"]')

      checkboxListContainer.classList.toggle('all-checked')

      if (checkboxListContainer.classList.contains('all-checked')) {
        for (let n = 0; n < checkboxList.length; n++) {
          checkboxList[n].checked = true
        }
      } else {
        for (let m = 0; m < checkboxList.length; m++) {
          checkboxList[m].checked = false
        }
      }
    })
  }
})()
