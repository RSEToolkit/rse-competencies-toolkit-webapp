/**
 * Animate scroll to top button in/off view
 */

export default (() => {
  const button = document.querySelector('.btn-scroll-top')
  const scrollOffset = 450

  if (button == null) return

  const offsetFromTop = parseInt(scrollOffset, 10)
  const progress = button.querySelector('svg circle')
  const length = progress.getTotalLength()

  progress.style.strokeDasharray = length
  progress.style.strokeDashoffset = length

  const showProgress = () => {
    const scrollPercent =
      (document.body.scrollTop + document.documentElement.scrollTop) /
      (document.documentElement.scrollHeight - document.documentElement.clientHeight)
    const draw = length * scrollPercent
    progress.style.strokeDashoffset = length - draw
  }

  window.addEventListener('scroll', (e) => {
    if (e.currentTarget.pageYOffset > offsetFromTop) {
      button.classList.add('show')
    } else {
      button.classList.remove('show')
    }

    showProgress()
  })
})()
