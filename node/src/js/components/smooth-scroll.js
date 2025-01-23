/**
 * Anchor smooth scrolling
 * @requires https://github.com/cferdinandi/smooth-scroll/
 */

export default (() => {
  /* eslint-disable no-unused-vars, no-undef */
  const selector = '[data-scroll]',
    fixedHeader = '[data-scroll-header]',
    scroll = new SmoothScroll(selector, {
      speed: 800,
      speedAsDuration: true,
      offset: (anchor, toggle) => {
        return toggle.dataset.scrollOffset || 20
      },
      header: fixedHeader,
      updateURL: false,
    })
  /* eslint-enable no-unused-vars, no-undef */
})()
