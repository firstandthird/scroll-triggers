# scroll-triggers

A tiny, dependency-less javascript library to add classes as elements scroll into viewport.

## Install

`npm install scroll-triggers`

## Setup

```javascript
import scrollTriggers from 'scroll-triggers';
window.addEventListener('DOMContentLoaded', () => {
  scrollTriggers();
});
```

## Usage

Add Class when element is in view.

```html
<div data-scroll data-scroll-class="class-to-add"></div>
```

Add class to another element when an element is in view

```html
<div data-scroll data-scroll-class="class-to-add" data-scroll-target=".some .selector"></div>
```

Add class to another element when an element is in view and remove when it gets to another element

```html
<div data-scroll data-scroll-class="class-to-add" data-scroll-target=".some .selector" data-scroll-end=".some .lower .selector"></div>
```
