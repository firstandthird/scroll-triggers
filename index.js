'use strict';

import { find, fire, findOne, ready, on, addClass, removeClass, styles } from 'domassist';
import attrobj from 'attrobj';
import tinybounce from 'tinybounce';

const Events = {
  In: 'scrolltriggers:inView',
  Out: 'scrolltriggers:outOfView',
  Pause: 'scrolltriggers:pause',
  Resume: 'scrolltriggers:resume',
  Bounds: 'scrolltriggers:bounds'
};

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

    this.calcOffset();

    // If images, once by default
    if (this.options.image || this.options.src || this.options.srcset) {
      this.options.once = true;
    }

    el.setAttribute('data-scroll-init', 'true');

    this.calcBounds();

    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('resize', this.dCalcBounds);

    on(this.el, Events.Pause, () => {
      this.paused = true;
    });

    on(this.el, Events.Resume, () => {
      this.paused = false;
    });

    /*
      Prevents a bug on Blink+Webkit in which scroll is always 0 until around
      400 milliseconds due to anchor scrolling features.
     */
    setTimeout(this.eventHandler, 400);
  }

  calcBounds() {
    this.calcOffset();

    // Element is hidden and not fixed
    const isAllowedToBeFixed = this.options.progress === true || typeof this.options.fixed !== 'undefined';
    if ((!this.el.offsetParent && !isAllowedToBeFixed) ||
      (this.added && this.options.once)) {
      // Don't even bother calculating
      this.disabled = true;
      return;
    }

    this.disabled = false;

    if (isAllowedToBeFixed && this.added) {
      this.outOfView();
      return requestAnimationFrame(() => this.calcBounds());
    }

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

    this.fire(Events.Bounds);
    this.eventHandler();
  }

  calcOffset() {
    this.options.offset = this.options.offset ?
      this.options.offset : this.el.dataset.scrollOffset;

    // A screen above loading
    if (this.options.image || this.options.srcset || this.options.offset === 'auto') {
      this.options.offset = Math.max(document.documentElement.clientHeight, window.innerHeight, 0) * -1;
    } else {
      this.options.offset = parseInt(this.options.offset || 0, 10);
    }
  }

  inView() {
    const { className, inView } = this.options;

    if (className && this.el.classList) {
      addClass(this.el, className);
    }

    const image = this.options.image;
    const src = this.options.src;
    const srcset = this.options.srcset;

    if (image || src) {
      const source = image || src;

      switch (this.el.tagName) {
        case 'IMG':
        case 'IFRAME':
        case 'VIDEO':
        case 'SCRIPT':
          this.el.setAttribute('src', source);
          break;
        default:
          styles(this.el, {
            backgroundImage: `url(${source})`,
            backgroundRepeat: 'no-repeat'
          });
      }
    }

    if (srcset) {
      this.el.setAttribute('srcset', srcset);
    }

    if (typeof inView === 'function') {
      inView(this.el, this.options);
    }

    this.fire(Events.In);

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

    this.fire(Events.Out);

    this.added = false;
  }

  fire(event) {
    fire(this.el, event, {
      detail: {
        instance: this,
        options: this.options
      }
    });
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

ready(init);

init.Events = Events;
init.ScrollTrigger = ScrollTrigger;

export default init;
