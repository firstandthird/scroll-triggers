# scroll-triggers ![npm](https://img.shields.io/npm/v/scroll-triggers.svg)

A tiny, dependency-less javascript library to add classes as elements scroll into viewport.

## Features

* Add a class when an element comes into view (great for animations)
* Set an image when an element comes into view (great for lazy loading)
* Set the width of an element based on scroll % (great for scroll progress bars)
* API for both HTML and Javascript

## Install

```sh
npm install scroll-triggers
```

## Setup

```javascript
import 'scroll-triggers';

// alternative
import scrollTriggers from 'scroll-triggers';
```

## Events

Custom events are fired/listened on the element:

| Event                      | Type     | Description             |
|----------------------------|----------|-------------------------|
| `scrolltriggers:inView`    | Fired    | Element is in view      |
| `scrolltriggers:outOfView` | Fired    | Element is out of view  |
| `scrolltriggers:pause`     | Listened | Pauses scroll-triggers  |
| `scrolltriggers:resume`    | Listened | Resumes scroll-triggers |

## Options

List of available options:

| Name          | Type                                              | Description                                                              |
|---------------|---------------------------------------------------|--------------------------------------------------------------------------|
| `className`   | _{string}_                                        | Class to be added/removed when element is in view                        |
| `start`       | _{string\|Element\|NodeList}_ CSS Selector        | Add class when the specified element is in view                          |
| `end`         | _{string\|Element\|NodeList}_ CSS Selector        | Removes class when the specified element is in view                      |
| `position`    | _{string = 'bottom'}_ "top\|middle\|bottom"       | Add class at when element hits the specified position of page            |
| `positionEnd` | _{string = 'bottom'}_ "auto\|top\|middle\|bottom" | Removes class when specified element hits the specified position of page |
| `offset`      | _{number}_                                        | The offset controls the distance (negative or positive) between the top border of the element and the top border of the window. This is useful to fine tune when a class is added. |
| `image`       | _{string}_ Path to image                          | Set an image when an element comes into view, if the element is an <img> it will set it as the src, otherwise it will be set as `background-image`                             |
| `src`         | _{string}_ Path to resource                       | Set the `src` property when an element comes into view                   |
| `srcset`      | _{string}_ Path to resource                       | Set the `srcset` property when an element comes into view                |
| `progress`    | _{boolean = false}_                               | Set the width of an element based on scroll %                            |
| `once`        | _{boolean = true}_                                | Whether scroll-triggers should be executed once or not                   |
| `fixed`        | _{boolean = true}_                               | Needed for fixed (`position: fixed`) elements                            |
| `inView`      | _{function}_                                      | Callback executed when element is in view                                |
| `outOfView`   | _{function}_                                      | Callback executed when element is out view                               |

## Usage

See [the example](example/index.html).

### HTML

Add class when element is in view.

```html
<div data-scroll data-scroll-class="class-to-add"></div>
```

Add class when another element is in view

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

Set an image when an element comes into view as a background image

```html
<div data-scroll data-scroll-image="/path/to/image.jpg"></div>

<!--
  This will generate the markup below:
  <div data-scroll data-scroll-image="/path/to/image.jpg" style="background-image: url('/path/to/image.jpg'); background-repeat: no-repeat;"></div>
-->

```

Set the width of an element based on scroll % (great for progress bars)

```html
<div data-scroll data-scroll-progress></div>
```

Set the `src` property when an element comes into view (great for lazy load)

```html
<iframe data-scroll data-scroll-src="https://wikipedia.org/wiki/Main_Page"/></iframe>
```

Set the `srcset` property when an element comes into view (great for lazy load)

```html
<picture>
  <source media="(min-width: 650px)" data-scroll data-scroll-srcset="http://placehold.it/465x465?text=Min-650" />
</picture>
```

### JavaScript

```javascript
import scrollTriggers from 'scroll-triggers';

scrollTriggers([
  {
    el: '.some-selector',
    start: '.selector',
    end: '.selector',
    className: 'class-to-add',
    image: 'image/path.jpg',
    src: 'http://url-to-resource.com',
    srcSet: 'http://url-to-resource.com',
    position: 'top|middle|bottom',
    positionEnd: 'auto|top|middle|bottom',
    offset: -20,
    progress: true|false,
    once: true|false,
    fixed: true|false,
    inView: (el, options) => {},
    outOfView: (el, options) => {}
  }
]);
```
