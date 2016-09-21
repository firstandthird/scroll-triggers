/* global window,document */
'use strict';

const debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments; // eslint-disable-line prefer-rest-params
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

class ScrollTrigger {
  constructor(el) {
    this.added = false;
    this.el = el;
    //since dataset doesn't work everywhere...

    this.options = {
      position: el.getAttribute('data-scroll-position'),
      start: el.getAttribute('data-scroll-start'),
      end: el.getAttribute('data-scroll-end'),
      className: el.getAttribute('data-scroll-class'),
      image: el.getAttribute('data-scroll-image')
    };

    this.calcBounds();
    this.eventHandler = debounce(this.onScroll.bind(this), 10, true);
    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('resize', this.calcBounds.bind(this));
    //trigger right away
    this.eventHandler();
  }

  getScrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  calcBounds() {
    const position = this.options.position || 'bottom';

    this.startEl = (this.options.start) ? document.querySelector(this.options.start) : this.el;
    const rect = this.startEl.getBoundingClientRect();
    const scrollY = this.getScrollY();
    this.start = rect.top + scrollY;

    if (position === 'middle') {
      this.start -= window.innerHeight / 2;
    } else if (position === 'bottom') {
      this.start -= window.innerHeight;
    }

    if (this.options.end) {
      const endEl = document.querySelector(this.options.end);
      const endRect = endEl.getBoundingClientRect();
      this.end = endRect.top + scrollY;
    }
  }

  inView() {
    const className = this.options.className;
    if (className) {
      this.el.classList.add(className);
    }
    const image = this.options.image;
    if (image && !this.el.getAttribute('src')) {
      this.el.setAttribute('src', image);
    }
    this.added = true;
  }

  outOfView() {
    const className = this.options.className;
    if (className) {
      this.el.classList.remove(className);
    }
    this.added = false;
  }

  onScroll() {
    const scroll = this.getScrollY();
    if (scroll < this.start || (this.end && scroll > this.end)) {
      if (this.added) {
        this.outOfView();
      }
      return;
    }

    if (this.added) {
      return;
    }
    this.inView();
  }
}

const init = function(query) {
  if (!query) {
    query = document.querySelectorAll('[data-scroll]');
  }
  for (let i = 0, c = query.length; i < c; i++) {
    const el = query[i];
    new ScrollTrigger(el);
  }
};

export default init;

window.addEventListener('DOMContentLoaded', () => {
  init();
});
