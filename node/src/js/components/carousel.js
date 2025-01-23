/**
 * Content carousel with extensive options to control behaviour and appearance
 * @requires https://github.com/nolimits4web/swiper
 */

export default (() => {
  // forEach function
  const forEach = (array, callback, scope) => {
    for (let i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]) // passes back stuff we need
    }
  }

  // Carousel initialisation
  const carousels = document.querySelectorAll('.swiper')
  forEach(carousels, (index, value) => {
    let options
    if (value.dataset.swiperOptions != undefined)
      options = JSON.parse(value.dataset.swiperOptions)

    // Thumbnails
    if (options.thumbnails) {
      let images = options.thumbnails.images
      options = Object.assign({}, options, {
        pagination: {
          el: options.thumbnails.el,
          clickable: true,
          bulletActiveClass: 'active',
          renderBullet: (index, className) => {
            return `<li class='swiper-thumbnail ${className}'>
              <img src='${images[index]}' alt='Thumbnail'>
            </li>`
          },
        },
      })
    }

    const swiper = new Swiper(value, options) // eslint-disable-line no-undef

    // Controlled slider
    if (options.controlledSlider) {
      const controlledSlider = document.querySelector(options.controlledSlider)
      let controlledSliderOptions

      if (controlledSlider.dataset.swiperOptions != undefined)
        controlledSliderOptions = JSON.parse(controlledSlider.dataset.swiperOptions)
      /* eslint-disable no-undef */
      const swiperControlled = new Swiper(controlledSlider, controlledSliderOptions)
      /* eslint-enable no-undef */
      swiper.controller.control = swiperControlled
    }

    // Binded content
    if (options.bindedContent) {
      swiper.on('activeIndexChange', (e) => {
        const targetItem = document.querySelector(
          e.slides[e.activeIndex].dataset.swiperBinded
        )
        const previousItem = document.querySelector(
          e.slides[e.previousIndex].dataset.swiperBinded
        )

        previousItem.classList.remove('active')
        targetItem.classList.add('active')
      })
    }
  })
})()
