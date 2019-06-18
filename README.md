> This is an alpha version! Please use 2.0.1 as the latest stable.
> In this alpha, the renderData will be deprecated (made redundant by React context)

# xml-renderer

Combines XML and XPath with _your_ components and stylesheets to render whatever in React or elsewhere. Can be used for
front- or back-end rendering.

## Demonstration

- [Demonstration site with several documents](https://wvbe.github.io/xml-renderer)
- [Code to the demonstration site](https://github.com/wvbe/xml-renderer-demo)

## Installation

```sh
npm i xml-renderer --save
```

## Example

Find this example code with annotations in [example/simple.js](./example/simple.js). You can run it in Node using
`babel example/simple.js | node`.

```js
import React from 'react';
const { renderToStaticMarkup } = require('react-dom/server');
import { RuleSet } from 'xml-renderer';
import { sync } from 'slimdom-sax-parser';

const experience = new RuleSet();

experience.add('self::text()', ({ node }) => node().nodeValue);

experience.add('self::node()', ({ traverse }) => traverse());

experience.add('self::paragraph', ({ key, traverse }) => (
	<p key={ key() }>
		{ traverse() }
	</p>
));

experience.add('self::paragraph[not(preceding-sibling::*)]', ({ key, traverse }) => (
	<p key={ key() }>
		<b>
			{ traverse() }
		</b>
	</p>
));

const rendered = renderToStaticMarkup(experience.render(sync(`
	<webpage>
		<paragraph>Beep boop baap.</paragraph>
		<paragraph>I am a robot.</paragraph>
	</webpage>
`)));

console.log(rendered);
```

# Usage

The following is generated by JSDoc.

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## Experience

An instance of Experience is essentially a set of rendering callbacks each attached to an XPath test, and provides
the APIs to add new rendering rules and of course render an output.

**Parameters:**

-   `mergeExperiences` **...Experience**

### #register

Register a rendering callback for an XPath test. Any node matching the test (and not a more specific one)
will be transformed using onRender.

**Parameters:**

-   `xPathTest` **XPathTest**
-   `onRender` **[Experience~onRender](#onrender)**

### #render

Returns the rendering result for the given node and any node that its rendering rule traverses in to. Also allows
you to pass extra contextual information that ends up in a rendering callback.

**Parameters:**

-   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** The XML node to start rendering from
-   `renderData` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An
    object of contextual information that is passed to every rendering callback. Any `key`, `node`, `traverse` or
    `query` property will be overwritten since those are part of xml-renderer's API.

### .getKeyForNode

Convenience method to get a unique, stable identifier for the given XML node. Is useful to pass to React as the
key prop, or to use as a page anchor.

**Parameters:**

-   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)**

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**

### ~onRender

The callback that produces a rendering of the matching node. The callback is passed an instance of
[Experience](#experience) for that node as first and only argument.

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

**Parameters:**

-   `props` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**
    -   `props.traverse` **function (query: XPathQuery, renderData: [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)): [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any>**
    -   `props.node` **function (): [Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)**
    -   `props.key` **function (): [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**
    -   `props.query` **function (query: XPathQuery): any**

Returns **any**
