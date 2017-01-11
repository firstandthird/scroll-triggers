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
  constructor(el, options) {
    this.added = false;
    this.el = el;
    this.options = options;

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

  processPosition(position, currentValue) {
    if (position === 'top') {
      return currentValue;
    }
    if (position === 'middle') {
      currentValue -= window.innerHeight / 2;
    } else if (position === 'bottom') {
      currentValue -= window.innerHeight;
    } else {
      currentValue -= window.innerHeight * (parseInt(position, 10) / 100);
    }
    return currentValue;
  }

  calcBounds() {
    const position = this.options.position || 'bottom';

    this.startEl = (this.options.start) ? document.querySelector(this.options.start) : this.el;
    const rect = this.startEl.getBoundingClientRect();
    const scrollY = this.getScrollY();
    this.start = rect.top + scrollY;
    this.start = this.processPosition(position, this.start);

    if (this.options.end) {
      const endEl = document.querySelector(this.options.end);
      const endRect = endEl.getBoundingClientRect();
      this.end = endRect.top + scrollY;
      this.end = this.processPosition(position, this.end);
    }
  }

  inView() {
    const className = this.options.className;
    if (className && this.el.classList) {
      this.el.classList.add(className);
    }
    const image = this.options.image;
    if (image) {
      if (this.el.tagName === 'IMG') {
        if (this.el.getAttribute('src')) {
          return;
        }
        this.el.setAttribute('src', image);
      } else {
        if (this.el.style.backgroundImage) {
          return;
        }
        this.el.style.backgroundImage = `url(${image})`;
        this.el.style.backgroundRepeat = 'no-repeat';
      }
    }
    this.added = true;
  }

  outOfView() {
    const className = this.options.className;
    if (className && this.el.classList) {
      this.el.classList.remove(className);
    }
    this.added = false;
  }

  onScroll() {
    const scroll = this.getScrollY();
    if (this.options.progress) {
      const perc = scroll / (document.documentElement.scrollHeight - window.innerHeight);
      this.el.style.width = `${perc * 100}%`;
    }
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

const init = function(items) {
  const query = document.querySelectorAll('[data-scroll]');
  for (let i = 0, c = query.length; i < c; i++) {
    const el = query[i];
    const options = {
      position: el.getAttribute('data-scroll-position'),
      start: el.getAttribute('data-scroll-start'),
      end: el.getAttribute('data-scroll-end'),
      className: el.getAttribute('data-scroll-class'),
      image: el.getAttribute('data-scroll-image'),
      progress: (el.getAttribute('data-scroll-progress') !== null)
    };
    new ScrollTrigger(el, options);
  }
  if (items && Array.isArray(items)) {
    items.forEach((item) => {
      let els;
      //support array of elements
      if (item.el instanceof NodeList) {
        els = [].slice.call(item.el);
      } else if (typeof item.el === 'string') {
        els = document.querySelectorAll(item.el);
      } else if (item.el instanceof Node) {
        els = [item.el];
      } else if (Array.isArray(item.el)) {
        els = item.el;
      } else {
        throw new Error('unknown element');
      }

      els.forEach((el) => {
        delete item.el;
        new ScrollTrigger(el, item);
      });
    });
  } else if (items) {
    throw new Error('please convert object to array');
  }
};

export default init;

window.addEventListener('DOMContentLoaded', () => {
  init();
});
