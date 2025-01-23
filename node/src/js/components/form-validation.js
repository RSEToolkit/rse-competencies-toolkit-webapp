/**
 * Form validation
 */

export default (() => {
  const selector = 'needs-validation'

  window.addEventListener(
    'load',
    () => {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.getElementsByClassName(selector)
      // Loop over them and prevent submission

      /* eslint-disable no-unused-vars */
      const validation = Array.prototype.filter.call(forms, (form) => {
        form.addEventListener(
          'submit',
          (e) => {
            if (form.checkValidity() === false) {
              e.preventDefault()
              e.stopPropagation()
            }
            form.classList.add('was-validated')
          },
          false
        )
      })
      /* eslint-enable no-unused-vars */
    },
    false
  )
})()
