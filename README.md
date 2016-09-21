# scroll-triggers

A tiny, dependency-less javascript library to add classes as elements scroll into viewport.

## Install

`npm install scroll-triggers`

## Setup

```javascript
import 'scroll-triggers';
```

## Usage

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
