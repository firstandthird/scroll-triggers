# scroll-triggers

A tiny, dependency-less javascript library to add classes as elements scroll into viewport.

## Features

* Add a class when an element comes into view (great for animations)
* Set an image when an element comes into view (great for lazy loading)
* Set the width of an element based on scroll % (great for scroll progress bars)
* API for both HTML and Javascript

## Install

`npm install scroll-triggers`

## Setup

```javascript
import 'scroll-triggers';
```

## Usage

### HTML

Add class when element is in view.

```html
<div data-scroll data-scroll-class="class-to-add"></div>
```

Add class when another element is in view.

```html
<div data-scroll data-scroll-class="class-to-add" data-scroll-start=".some .selector"></div>
```

Add class when another element is in view and remove when it gets to another element

```html
<div data-scroll data-scroll-class="class-to-add" data-scroll-start=".some .selector" data-scroll-end=".some .lower .selector"></div>
```

Add class at when element hits bottom of page

```html
<div data-scroll data-scroll-class="class-to-add" data-scroll-position="bottom"></div>
```

Add class at when element hits middle of page

```html
<div data-scroll data-scroll-class="class-to-add" data-scroll-position="middle"></div>
```

Set an image when an element comes into view

```html
<div data-scroll data-scroll-image="/path/to/image.jpg"></div>
```

Set the width of an element based on scroll % (great for progress bars)

```html
<div data-scroll data-scroll-progress></div>
```

### Javascript

```javascript
import scrollTriggers from 'scroll-triggers';
scrollTriggers({
  '.some-selector': {
    start: '.selector',
    end: '.selector',
    className: 'class-to-add',
    image: 'image/path.jpg',
    position: 'top|middle|bottom',
    progress: true|false
  }
});
```
