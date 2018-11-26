# Instructions

One of the instructions has to be present in every command. These properties are evaluated (and their effect is executed) in the order, in which they are listed below:

- [if-then-else](#if-then-else)
- [setViewport](#setviewport)
- [url](#url)
- [go](#go)
- [scroll](#scroll)
- [clearValue](#clearvalue)
- [setValue](#setvalue)
- [addValue](#addvalue)
- [selectOptionByIndex](#selectoptionbyindex)
- [selectOptionByValue](#selectoptionbyvalue)
- [moveCursor](#movecursor)
- [click](#click)
- [keys](#keys)
- [wait](#wait)
- [hasAttribute](#hasattribute)
- [hasClass](#hasclass)
- [hasValue](#hasvalue)
- [hasText](#hastext)
- [hasInnerHtml](#hasinnerhtml)
- [hasOuterHtml](#hasouterhtml)
- [isEnabled](#isenabled)
- [isExisting](#isexisting)
- [isFocused](#isfocused)
- [isSelected](#isselected)
- [isVisible](#isvisible)
- [isVisibleWithinViewport](#isvisiblewithinviewport)
- [isNotEnabled](#isnotenabled)
- [isNotExisting](#isnotexisting)
- [isNotFocused](#isnotfocused)
- [isNotSelected](#isnotselected)
- [isNotVisible](#isnotvisible)
- [isNotVisibleWithinViewport](#isnotvisiblewithinviewport)
- [abort](#abort)
- [file](#file)

## if-then-else

Conditional command consisting of two or three three instructions, which each points to a sub-command or to an array of sub-commands to perform:

### if
Type: `Object` | `Array` (mandatory)

### then
Type: `Object` | `Array` (optional)

### else
Type: `Object` | `Array` (optional)

At first the sub-commands from the `if` instruction are performed. If they succeed, the execution continues with sub-sommands from the `then` instruction. If they fail, the execution continues with sub-sommands from the `else` instruction. The success or failure of the whole conditional command will depend on either of `then` and `else` instructions, which are executed. The success or failure of the `if` instruction decides only the following condition branch.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  if: {
    hasAttribute: {
      selector: '#lst-ib',
      name: 'autocomplete',
      value: 'off'
    }
  },
  then: {
    setValue: {
      selector: '#lst-ib',
      value: 'autocomplete is off'
    }
  },
  file: 'google'
}
```

#### setViewport
Type: `Object`

Resizes the web browser viewport to the specified `width` and `height` values (in pixels), overriding the `viewport` value in `options`. Once this instruction is used, the viewport size will stay, until it is modified by this instruction again, or until the `viewport` option is detected in another instruction.

If the input object for this instruction is left empty (`{}`), the viewport will be resized to the original value set in `options`.

```js
{
  setViewport: {with: 640, height: 480},
  url: 'https://google.com',
  file: 'google'
}
```

## url
Type: `String`

Navigates (changes the current window location) to the specified URL.

```js
{
  url: 'https://google.com',
  file: 'google'
}
```

If it is omitted, the command will reuse the location from the previous command. A command without URL can cause some page changes, wait for an element state and/or save a snapshot.

## go
Type: `String`: 'back', 'forward' or 'refresh'

Navigates backwards or forwards using the browser history, or refreshes the current page.

```js
{
  go: 'back',
  file: 'previous'
}
```

## scroll
Type: `String` | `Object`

Scrolls the page, so that the element with the specified selector or mouse coordinates become visible. If an object is used for the specification, it should contain the following properties:

* `selector` - `String` - selector of the element to move the mose to.
* `offset` - `Object` - relative offset to the top left corner of the specified element expected as `left` and `top` numeric properties.

```js
{
  url: 'https://google.com',
  scroll: {
    selector: '#lst-ib'
  },
  file: 'google'
}
```

The `offset` value can be specified instead of the `selector` and shares the format with the [`moveCursor`](#moveCursor) instruction.

## clearValue
Type: `String`

Clears value of an input element at the specified selector.

```js
{
  url: 'https://google.com',
  clearValue: '#lst-ib',
  file: 'google'
}
```

## setValue
Type: `Object`

Set value of an input element either by providing the new value or using [keyboard key identifiers]. The previous value will be cleared. The object should contain the following properties:

* `selector` - `String` - selector of an input element.
* `value` - `String|Number|Array` - string or numeric value, or an array of keys (strings) to send to the element for setting its value.

```js
{
  url: 'https://google.com',
  setValue: {
    selector: '#lst-ib',
    value: 'Hi'
  }
}
{
  setValue: {
    selector: '#lst-ib',
    value: ['Enter']
  }
  file: 'google',
}
```

## addValue
Type: `Object`

Appends to the current value of an input element. The object should contain the following properties:

* `selector` - `String` - selector of an input element.
* `value` - `String|Number` - string or numeric value.

```js
{
  url: 'https://google.com',
  setValue: {
    selector: '#lst-ib',
    value: ' there!'
  },
  file: 'google'
}
```

## selectOptionByIndex
Type: `Object`

Select an `option` element of a `select` element by the specified (zero-based)
index. The object should contain the following properties:

* `selector` - `String` - selector of a select element.
* `index` - `Number` - numeric (0-based integer) index of an option to select.

```js
{
  url: 'https://example.com',
  setValue: {
    selector: 'select',
    index: 1 // select second option
  }
}
```

## selectOptionByValue
Type: `Object`

Select an `option` element of a `select` element by the specified value of
the `value` attribute. The object should contain the following properties:

* `selector` - `String` - selector of a select element.
* `value` - `String` - value of the `value` attribute of an option to select.

```js
{
  url: 'https://example.com',
  setValue: {
    selector: 'select',
    value: 'second'
  }
}
```

## moveCursor
Type: `String` | `Object`

Moves the mouse cursor to an element with the specified selector. If an object is used for the specification, it should contain the following properties:

* `selector` - `String` - selector of the element to move the mose to.
* `offset` - `Object` - relative offset to the top left corner of the specified element expected as `left` and `top` numeric properties.

```js
{
  url: 'https://google.com',
  moveCursor: {
    selector: '#lst-ib',
    offset: {
      left: 10
      top: 5,
    }
  },
  file: 'google'
}
```

## click
Type: `String`

Triggers a click event on an element with the specified selector.

```js
{
  url: 'https://google.com',
  click: 'input[name=btnK]',
  file: 'google'
}
```

## keys
Type: `String|Array`

Sends either a text (string) typed by keys, or single keystrokes (array) to the browser.

```js
{
  url: 'https://google.com',
  click: 'input[name=btnK]',
  keys: 'test',
  file: 'google'
}
```

## wait
Type: `Number` | `String` | `Function` | `Array` (optional)

Delays taking of the snapshot until a condition s met depending on the value type:

`Number` - number of milliseconds to wait:

```js
{
  url: 'https://google.com',
  wait: 1000,
  file: 'google'
}
```

`String` - selector of a node to look for. As soon as this node is found in DOM, the waiting will stop:

```js
{
  url: 'https://google.com',
  wait: '#footer',
  file: 'google'
}
```

If the selector is prefixed by the exclamation mark ("!"), the waiting waiting will stop, once the node disappears from DOM:

```js
{
  url: 'https://google.com',
  wait: '!.gsfi',
  file: 'google'
}
```

`Function` - callback, which is supposed to return a `Promise`. Once this promise is resolved, the waiting will stop. The callback obtains the [webdriverio] client instance and can use [WebdriverIO API] to interact with the browser:

```js
{
  url: 'https://google.com',
  wait: function (browser) {
    return browser.waitForExist('#footer', 1000);
  },
  file: 'google'
}
```

`Array` - an array of items of types described above. They will be processed one by one. Once the last one is finished, the waiting will stop:

```js
{
  url: 'https://google.com',
  wait: '!.gsfi',
  file: 'google'
}
```

If `wait` is omitted, the task will advance to another item without delay. It can still save a snapshot immediately.

## hasAttribute
Type: `Object`

Checks, that the attribute with the specified value exists in the element with the specified selector. The input object should contain the following properties:

* `selector` - `String` - selector of the element to check.
* `name` - `String` - attribute name.
* `value` - `String` - attribute value.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  hasAttribute: {
    selector: '#lst-ib',
    name: 'autocomplete',
    value: 'off'
  },
  file: 'google'
}
```

## hasClass
Type: `Object`

Checks, that at least one of the specified classes is included or omitted in the element with the specified selector. The input object should contain the following properties:

* `selector` - `String` - selector of the element to check.
* `value` - `String` - space-delimited class list.
* `allRequired` - `Boolean` - if all classes in the list have to match. Optional. The default value is `false`.

Class names starting with the exclamation mark ("!") are expected to be omitted, otherwise the class names are expected to be included in the specified element.

The check will succeed, if at least one class from the list will be included or omitted. If you want all classes to pass the check, set the instruction property `allRequired` to `true`. (Or use multiple commands with the `hasClass` instruction.)

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  hasClass: {
    selector: '#lst-ib',
    value: 'gsfi !hidden',
    allRequired: true
  },
  file: 'google'
}
```

## hasValue
Type: `Object`

Checks, that the value of the `textarea`, `select` or text `input` element with the specified selector is equal to the specified one. The input object should contain the following properties:

* `selector` - `String` - selector of the element to check.
* `value` - `String` - element value.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  hasValue: {
    selector: '#lst-ib',
    value: 'test'
  },
  file: 'google'
}
```

## hasText
Type: `Object`

Checks, that the text in the [interactable](https://www.w3.org/TR/webdriver/#dfn-interactable-element) element with the specified selector is equal to the specified one. The input object should contain the following properties:

* `selector` - `String` - selector of the element to check.
* `value` - `String` - element text.

```js
{
  url: 'https://google.com',
  wait: '.gb_P',
  hasText: {
    selector: '#lst-ib',
    value: 'Gmail'
  },
  file: 'google'
}
```

## hasInnerHtml
Type: `Object`

Checks, that the HTML markup inside the element with the specified selector is equal to the specified value. The input object should contain the following properties:

* `selector` - `String` - selector of the element to check.
* `value` - `String` - element content.

```js
{
  url: 'https://google.com',
  wait: '.gb_P',
  hasInnerHtml: {
    selector: '#lst-ib',
    value: 'Gmail'
  },
  file: 'google'
}
```

## hasOuterHtml
Type: `Object`

Checks, that the HTML markup of the element with the specified selector (including the element and its attributes) is equal to the specified value. The input object should contain the following properties:

* `selector` - `String` - selector of the element to check.
* `value` - `String` - element and its content.

```js
{
  url: 'https://google.com',
  wait: '.gb_P',
  hasOuterHtml: {
    selector: '#lst-ib',
    value: '<a class="gb_P" data-pid="23" href="https://mail.google.com/mail/?tab=wm">Gmail</a>'
  },
  file: 'google'
}
```

## isEnabled
Type: `String`

Checks, that the specified element is currently enabled (does not have the `disabled` attribute set).

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isEnabled: '#lst-ib',
  file: 'google'
}
```

## isExisting
Type: `String`

Checks, that the specified element currently exists.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isExisting: '#lst-ib',
  file: 'google'
}
```

## isFocused
Type: `String`

Checks, that the specified element is currently focused.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: [
    '#lst-ib',
    10
  ],
  isFocused: '#lst-ib',
  file: 'google'
}
```

## isSelected
Type: `String`

Checks, that the specified `option` element or `input` element of type checkbox or radio is currently selected.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: [
    '#lang',
    10
  ],
  isSelected: '#lang [value=en]',
  file: 'google'
}
```

## isVisible
Type: `String`

Checks, that the specified element is currently visible anywhere on the page.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isVisible: '#lst-ib',
  file: 'google'
}
```

## isVisibleWithinViewport
Type: `String`

Checks, that the specified element is currently visible and within the viewport.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isVisibleWithinViewport: '#lst-ib',
  file: 'google'
}
```

## isNotEnabled
Type: `String`

Checks, that the specified element is *not* currently enabled (has the `disabled` attribute set).

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isNotEnabled: '#lst-ib',
  file: 'google'
}
```

## isNotExisting
Type: `String`

Checks, that the specified element does *not* currently.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isNotExisting: '#lst-ib',
  file: 'google'
}
```

## isNotFocused
Type: `String`

Checks, that the specified element is *not* currently focused.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: [
    '#lst-ib',
    10
  ],
  isNotFocused: '#lst-ib',
  file: 'google'
}
```

## isNotSelected
Type: `String`

Checks, that the specified `option` element or `input` element of type checkbox or radio is *not* currently selected.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: [
    '#lang',
    10
  ],
  isNotSelected: '#lang [value=en]',
  file: 'google'
}
```

## isNotVisible
Type: `String`

Checks, that the specified element is *not* currently visible anywhere on the page.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isNotVisible: '#lst-ib',
  file: 'google'
}
```

## isNotVisibleWithinViewport
Type: `String`

Checks, that the specified element is *not* currently visible within the viewport, or it is visible outside of the viewport.

The input string should contain selector of the element to check.

```js
{
  url: 'https://google.com',
  wait: '#lst-ib',
  isNotVisibleWithinViewport: '#lst-ib',
  file: 'google'
}
```

## abort
Type: `String`

Stops executing firther commands and fails current Grunt task with the specified message. It can be used to stop the tests at a specific point and investigate the situation in the web browser.

## file
Type: `String`

Name of the file to write the snapshot to. If it does not end with ".html" or ".htm", the extension ".html" will be appended to it.

If writing screenshots is enabled, the same name will be used for the file with the screenshot; just without the extension ".html" or ".htm", if the file name ends to it, and with the extension ".png" appended to the file name instead.

```js
{
  url: 'https://google.com',
  file: 'google'
}
```

If it is omitted, the object will save no snapshot (and no screenshot). It can still change location or wait for some change.
