/**
 * Count input with increment (+) and decrement (-) buttons
 */

export default (() => {
  const countInputs = document.querySelectorAll('.count-input')

  for (let i = 0; i < countInputs.length; i++) {
    const component = countInputs[i]
    const incrementBtn = component.querySelector('[data-increment]')
    const decrementBtn = component.querySelector('[data-decrement]')
    const input = component.querySelector('.form-control')

    const handleIncrement = () => {
      input.value++
    }

    const handleDecrement = () => {
      if (input.value > 0) {
        input.value--
      }
    }

    // Add click event to buttons
    incrementBtn.addEventListener('click', handleIncrement)
    decrementBtn.addEventListener('click', handleDecrement)
  }
})()
