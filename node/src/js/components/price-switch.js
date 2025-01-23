/**
 * Price switch
 */

export default (() => {
  const switchWrapper = document.querySelectorAll('.price-switch-wrapper')

  if (switchWrapper.length <= 0) return

  const showMonthlyPrice = (monthlyPrice, annualPrice) => {
    for (let n = 0; n < monthlyPrice.length; n++) {
      annualPrice[n].classList.add('d-none')
      monthlyPrice[n].classList.remove('d-none')
    }
  }
  const showAnnualPrice = (monthlyPrice, annualPrice) => {
    for (let n = 0; n < monthlyPrice.length; n++) {
      monthlyPrice[n].classList.add('d-none')
      annualPrice[n].classList.remove('d-none')
    }
  }

  for (let i = 0; i < switchWrapper.length; i++) {
    const switchToggle = switchWrapper[i].querySelector('[data-bs-toggle="price"]')

    switchToggle.addEventListener('change', (e) => {
      const monthlySwitch = e.currentTarget.querySelector('[data-monthly-switch]')
      const annualSwitch = e.currentTarget.querySelector('[data-annual-switch]')
      const monthlyPrice = e.currentTarget
        .closest('.price-switch-wrapper')
        .querySelectorAll('[data-monthly-price]')
      const annualPrice = e.currentTarget
        .closest('.price-switch-wrapper')
        .querySelectorAll('[data-annual-price]')

      if (monthlySwitch.checked == true) showMonthlyPrice(monthlyPrice, annualPrice)
      if (annualSwitch.checked == true) showAnnualPrice(monthlyPrice, annualPrice)
    })
  }
})()
