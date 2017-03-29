'use strict';

import { find, findOne, ready, on, addClass, removeClass, styles, addAttrs } from 'domassist';
import attrobj from 'attrobj';
import tinybounce from 'tinybounce';

class ScrollTrigger {
  constructor(el, options) {
    this.added = false;
    this.el = el;
    this.options = options;
    this.eventHandler = tinybounce(this.onScroll.bind(this), 10, true);
    this.dCalcBounds = tinybounce(this.calcBounds.bind(this), 10);

    this.calcBounds();

    on(window, 'scroll', this.eventHandler);
    on(window, 'resize', this.dCalcBounds);
  }

  calcBounds() {
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

      this.end = ScrollTrigger.processPosition(position, end);

      ScrollTrigger.checkElement(endEl, 'end', this.options.end);
    }

    this.eventHandler();
  }

  inView() {
    const { className } = this.options;
    if (className && this.el.classList) {
      addClass(this.el, className);
    }
    const image = this.options.image;
    if (image) {
      if (this.el.tagName === 'IMG') {
        if (this.el.getAttribute('src')) {
          return;
        }

        addAttrs(this.el, { src: image });
      } else {
        if (this.el.style.backgroundImage) {
          return;
        }

        styles(this.el, {
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat'
        });
      }
    }
    this.added = true;
  }

  outOfView() {
    const { className } = this.options;
    if (className && this.el.classList) {
      removeClass(this.el, className);
    }
    this.added = false;
  }

  onScroll() {
    const scroll = ScrollTrigger.getScrollY();

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

      instances.push(new ScrollTrigger(el, options));
    });
  }

  return instances;
};

export default init;

ready(init);
