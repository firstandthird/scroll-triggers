'use strict';

import { find, fire, findOne, ready, on, addClass, removeClass, styles } from 'domassist';
import attrobj from 'attrobj';
import tinybounce from 'tinybounce';

class ScrollTrigger {
  constructor(el, options) {
    if (el.hasAttribute('data-scroll-init')) {
      return;
    }

    this.added = false;
    this.el = el;
    this.options = options;
    this.eventHandler = tinybounce(this.onScroll.bind(this), 10, true);
    this.dCalcBounds = tinybounce(this.calcBounds.bind(this), 10);
    this.paused = false;
    this.disabled = false;

    //if image, only process once and load a screen size above
    if (this.options.image) {
      this.options.offset = Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0) * -1;
      this.options.once = true;
    }

    el.setAttribute('data-scroll-init', 'true');

    this.calcBounds();

    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('resize', this.dCalcBounds);

    on(this.el, 'scrolltriggers:pause', () => {
      this.paused = true;
    });

    on(this.el, 'scrolltriggers:resume', () => {
      this.paused = false;
    });

    /*
      Prevents a bug on Blink+Webkit in which scroll is always 0 until around
      400 milliseconds due to anchor scrolling features.
     */
    setTimeout(this.eventHandler, 400);
  }

  calcBounds() {
    // Element is hidden and not fixed
    const isAllowedToBeFixed = this.options.progress === true || typeof this.options.fixed !== 'undefined';
    if (!this.el.offsetParent && !isAllowedToBeFixed) {
      // Don't even bother calculating
      this.disabled = true;
      return;
    }

    this.disabled = false;

    const position = this.options.position || 'bottom';

    this.startEl = (this.options.start) ? findOne(this.options.start) : this.el;
    ScrollTrigger.checkElement(this.startEl, 'start', this.options.start);
    const rect = this.startEl.getBoundingClientRect();
    const scrollY = ScrollTrigger.getScrollY();
    const start = rect.top + scrollY + (this.options.offset || 0);

    this.start = ScrollTrigger.processPosition(position, start);

    if (this.options.end) {
      const endEl = findOne(this.options.end);
      const endRect = endEl.getBoundingClientRect();
      const end = endRect.top + scrollY;
      let endPosition = this.options.positionEnd || 'bottom';
      if (endPosition === 'auto') {
        endPosition = 'top';
      }

      this.end = ScrollTrigger.processPosition(endPosition, end);

      if (this.options.positionEnd === 'auto') {
        this.end -= this.el.offsetHeight;
      }

      ScrollTrigger.checkElement(endEl, 'end', this.options.end);
    }

    this.eventHandler();
  }

  inView() {
    const { className, inView } = this.options;

    if (className && this.el.classList) {
      addClass(this.el, className);
    }

    const image = this.options.image;

    if (image) {
      if (this.el.tagName === 'IMG') {
        this.el.setAttribute('src', image);
      } else {
        styles(this.el, {
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat'
        });
      }
    }

    if (typeof inView === 'function') {
      inView(this.el, this.options);
    }

    if (this.options.once) {
      this.disabled = true;
      window.removeEventListener('scroll', this.eventHandler);
      window.removeEventListener('resize', this.dCalcBounds);
    }
    this.added = true;
  }

  outOfView() {
    const { className, outOfView } = this.options;
    if (className && this.el.classList) {
      removeClass(this.el, className);
    }

    if (typeof outOfView === 'function') {
      outOfView(this.el, this.options);
    }
    this.added = false;
  }

  onScroll() {
    const scroll = ScrollTrigger.getScrollY();

    if (this.paused || this.disabled) {
      return;
    }

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

  static checkElement(element, position, selector) {
    if (!element) {
      throw new Error(`${position} element doesn't match any element with selector: "${selector}"`);
    }
  }

  static getScrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  static processPosition(position, currentValue) {
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
}

const init = function(items) {
  const instances = [];

  if (items && Array.isArray(items)) {
    items.forEach((item) => {
      const els = find(item.el);

      if (els === null) {
        throw new Error('unknown element');
      }

      els.forEach((el) => {
        delete item.el;
        instances.push(new ScrollTrigger(el, item));
      });
    });
  } else if (items) {
    throw new Error('please convert object to array');
  } else {
    const els = find('[data-scroll]');

    els.forEach(el => {
      const options = attrobj('scroll', el);

      if (options.progress !== null && typeof options.progress !== 'undefined') {
        options.progress = true;
      }
      options.className = options.class;

      if (options.offset) {
        options.offset = parseInt(options.offset, 10);
      }
      if (typeof options.once !== 'undefined') {
        options.once = true;
      }
      instances.push(new ScrollTrigger(el, options));
    });
  }

  return instances;
};

if (document.readyState !== 'complete') {
  // Avoid image loading impacting on calculations
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      fire(window, 'resize');
    }
  });
}

export default init;

ready(init);
