// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license


;(function () {

    document.addEventListener('click', function (e) {
        let trigger = e.target.closest('[data-accordion-item-trigger]')

        if (!trigger) return

        let wrap = trigger.closest('[data-accordion]')
        let item = trigger.closest('[data-accordion-item]')
        let activeItem = wrap.querySelector('[data-accordion-item]._active')
        let stop = false

        let scrollBar = wrap.closest('[data-scrollbar]')
        let scrollBarEl = null

        if (scrollBar) {
            scrollBars.forEach(item => {
                if (scrollBar === item.getElements().target) {
                    scrollBarEl = item
                }
            })
        }

        let requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (fn) {
                return window.setTimeout(fn, 20);
            };

        e.preventDefault()

        function step() {
            if (stop) return;
            requestAnimationFrame(step);

            if (!scrollBarEl) return
            scrollBarEl.update()
        }

        if (item.classList.contains('_active')) {
            closeItem(item)
        } else if (activeItem) {
            openItem(item)
            closeItem(activeItem)
        } else {
            openItem(item)
        }

        function openItem(el) {
            let content = el.querySelector('[data-accordion-item-content]')
            let height = content.scrollHeight
            el.classList.add('_active')
            content.style.height = height + 'px'

            content.addEventListener('transitionend', onTransitionEnd, false)
            stop = false
            step();

            function onTransitionEnd() {
                content.style.height = 'auto'
                removeEventListener('transitionend', onTransitionEnd, false)
                stop = true
            }
        }

        function closeItem(el) {
            let content = el.querySelector('[data-accordion-item-content]')
            let height = content.scrollHeight
            content.style.height = height + 'px'
            stop = false
            step();

            setTimeout(() => {
                content.addEventListener('transitionend', onTransitionEnd, false)
                el.classList.remove('_active')
                content.style.height = 0 + 'px'
            })

            function onTransitionEnd() {
                content.style = null
                removeEventListener('transitionend', onTransitionEnd, false)
                stop = true
            }
        }
    })
})()

//
// ;(function () {
//
//     const newsCarousel = Array.from(document.querySelectorAll('.first-block'))
//
//     newsCarousel.forEach(item => {
//         const container = item.querySelector('.first-block__carousel')
//         new Swiper(container, {
//             wrapperClass: 'first-block__carousel-list',
//             slideClass: 'first-block__slide',
//             slidesPerView: 'auto',
//             watchOverflow: true,
//             speed: 600,
//             roundLengths: true,
//             // loop: true,
//             pagination: {
//                 el: '.swiper-pagination',
//                 type: 'bullets',
//                 clickable: true
//             },
//         })
//     })
//
// })()


;(function () {

    document.addEventListener('click', function (e) {
        let btn = e.target.closest('.header__btn-menu')

        if (!btn) return

        let header = btn.closest('.header')
        let menu = header.querySelector('.header__mob-menu')

        e.preventDefault()

        if (!menu.classList.contains('_active')) {
            document.addEventListener('click', onClickOut)
            document.addEventListener('keyup', onKeyUp)
            document.addEventListener('click', onClickLink)

            setTimeout(onOpen)
        }

        function onClickLink(e) {
            let link = e.target.closest('.header__menu-link, .socials__item, .lang-select__btn')
            if (!link) return
            onClose()
        }


        function onKeyUp(e) {
            if (e.keyCode === 27) {
                e.preventDefault()
                onClose()
            }
        }

        function onOpen() {
            menu.classList.add('_active')
            btn.classList.add('_active')
            document.body.classList.add('_scroll-lock')
        }

        function onClose() {
            menu.classList.remove('_active')
            btn.classList.remove('_active')
            document.body.classList.remove('_scroll-lock')
            document.removeEventListener('click', onClickOut)
            document.removeEventListener('click', onClickLink)
        }

        function onClickOut(e) {
            if (!menu.classList.contains('_active')) return
            const isElement = e.target === menu || menu.contains(e.target)
            if (!isElement) {
                onClose()
            }
        }
    })
})()


let eventCloseModal = new Event('onCloseModal', {bubbles: true})

function openModal(name) {
    if (!name) return
    let modal = document.querySelector(`[data-modal="${name}"]`)
    if (!modal) return

    let modalContent = modal.querySelector('.modal__content')

    if (!modal.classList.contains('_active')) {
        document.addEventListener('click', onClickOut)
        document.addEventListener('keyup', onKeyUp)
        setTimeout(onOpen)
    }

    function onKeyUp(e) {
        if (e.keyCode === 27) {
            e.preventDefault()
            onCloseModal()
        }
    }

    function onOpen() {
        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add('_active')
            document.body.classList.add('_scroll-lock')
            document.addEventListener('onCloseModal', onCloseModal)
        }, 100)
    }

    function onClickOut(e) {
        if (!modal.classList.contains('_active')) return
        const isElement = e.target === modalContent || modalContent.contains(e.target)
        if (!isElement) {
            closeModal()
        }
    }

    function onCloseModal() {
        modal.classList.remove('_active')
        document.body.classList.remove('_scroll-lock')
        document.removeEventListener('click', onClickOut)
        document.removeEventListener('onCloseModal', onCloseModal)
        document.removeEventListener('keyup', onKeyUp)

        modal.addEventListener('transitionend', onTransitionEnd, false)

        function onTransitionEnd() {
            modal.style = null;
            modal.removeEventListener('transitionend', onTransitionEnd, false)
        }
    }
}

function closeModal() {
    document.dispatchEvent(eventCloseModal)
}

document.addEventListener('click', function (e) {
    let triggerOpen = e.target.closest('[data-modal-open]')
    let triggerClose = e.target.closest('[data-modal-close]')
    let tab_banner = e.target.closest('.modal-promo__tab-btn')

    if (triggerOpen) {
        e.preventDefault()
        let name = triggerOpen.getAttribute('data-modal-open')
        openModal(name)
    } else if (triggerClose) {
        e.preventDefault()
        closeModal()
    } else if (tab_banner) {
        e.preventDefault();
        document.querySelector('.modal-promo__tab-btn._active').classList.remove('_active')
        tab_banner.classList.add('_active');
    }

})

let scrollBars;

document.addEventListener("DOMContentLoaded", function () {
    scrollBars = OverlayScrollbars(document.querySelectorAll("[data-scrollbar]"), {});
});


