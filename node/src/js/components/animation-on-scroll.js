/**
 * Animation on scroll (AOS)
 *
 * @requires https://github.com/michalsnik/aos
 */

export default (() => {
  const animationToggle = document.querySelector('[data-aos]')

  if (animationToggle === null) return

  AOS.init() // eslint-disable-line no-undef
})()
