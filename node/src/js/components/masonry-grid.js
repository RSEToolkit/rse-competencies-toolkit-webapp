/**
 * Cascading (Masonry) grid layout
 *
 * @requires https://github.com/desandro/imagesloaded
 * @requires https://github.com/Vestride/Shuffle
 */

export default (() => {
  const grid = document.querySelectorAll('.masonry-grid')
  let masonry

  if (grid === null) return

  for (let i = 0; i < grid.length; i++) {
    /* eslint-disable no-undef */
    masonry = new Shuffle(grid[i], {
      itemSelector: '.masonry-grid-item',
      sizer: '.masonry-grid-item',
    })

    imagesLoaded(grid[i]).on('progress', () => {
      masonry.layout()
    })
    /* eslint-enable no-undef */

    // Filtering
    const filtersWrap = grid[i].closest('.masonry-filterable')
    if (filtersWrap === null) return
    const filters = filtersWrap.querySelectorAll('.masonry-filters [data-group]')

    for (let n = 0; n < filters.length; n++) {
      filters[n].addEventListener('click', function (e) {
        const current = filtersWrap.querySelector('.masonry-filters .active')
        const target = this.dataset.group
        if (current !== null) {
          current.classList.remove('active')
        }
        this.classList.add('active')
        masonry.filter(target)
        e.preventDefault()
      })
    }
  }
})()
