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
    this.options = this.el.dataset;

    this.calcBounds();
    this.eventHandler = debounce(this.onScroll.bind(this), 10, true);
    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('resize', this.calcBounds.bind(this));
    //trigger right away
    this.eventHandler();
  }

  calcBounds() {
    const position = this.options.scrollPosition || 'bottom';

    this.startEl = (this.options.scrollStart) ? document.querySelector(this.options.scrollStart) : this.el;
    const rect = this.startEl.getBoundingClientRect();
    this.start = rect.top + window.scrollY;

    if (position === 'middle') {
      this.start -= window.innerHeight / 2;
    } else if (position === 'bottom') {
      this.start -= window.innerHeight;
    }

    if (this.options.scrollEnd) {
      const endEl = document.querySelector(this.options.scrollEnd);
      const endRect = endEl.getBoundingClientRect();
      this.end = endRect.top + window.scrollY;
    }
  }

  inView() {
    const className = this.options.scrollClass;
    if (className) {
      this.el.classList.add(className);
    }
    const image = this.options.scrollImage;
    if (image && !this.el.getAttribute('src')) {
      this.el.setAttribute('src', image);
    }
    this.added = true;
  }

  outOfView() {
    const className = this.options.scrollClass;
    if (className) {
      this.el.classList.remove(className);
    }
    this.added = false;
  }

  onScroll() {
    const scroll = window.scrollY;
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
