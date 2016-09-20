# domodule-scroll-trigger

Domodule library to add classes as elements scroll into viewport.

## Install

`npm install domodule domodule-scroll-trigger`

## Setup

```javascript
import Domodule from 'domodule';
import ScrollTrigger from 'domodule-scroll-trigger';
Domodule.register('ScrollTrigger', ScrollTrigger);
```

## Usage

Add Class when element is in view.

```html
<div data-module="ScrollTrigger" data-module-class="class-to-add"></div>
```

Add class to another element when an element is in view

```html
<div data-module="ScrollTrigger" data-module-class="class-to-add" data-module-target=".some .selector"></div>
```
