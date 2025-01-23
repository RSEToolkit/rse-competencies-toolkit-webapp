/**
 * Bind different content to different navs or even accordion.
 */

export default (() => {
  const clickToggles = document.querySelectorAll('[data-binded-content]')

  // Get target element siblings
  const getSiblings = (elem) => {
    let siblings = [],
      sibling = elem.parentNode.firstChild
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== elem) {
        siblings.push(sibling)
      }
      sibling = sibling.nextSibling
    }
    return siblings
  }

  // Change binded content function
  const changeBindedContent = (target) => {
    const targetEl = document.querySelector(target)
    const targetSiblings = getSiblings(targetEl)

    targetSiblings.map((sibling) => {
      sibling.classList.remove('active')
    })

    targetEl.classList.add('active')
  }

  // Change binded content on click
  for (let i = 0; i < clickToggles.length; i++) {
    clickToggles[i].addEventListener('click', (e) => {
      changeBindedContent(e.currentTarget.dataset.bindedContent)
    })
  }
})()
