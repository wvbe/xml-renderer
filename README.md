# xml-renderer

Combines XML and XPath with _your_ components and stylesheets to render whatever in React or elsewhere. Can be used for
front- or back-end rendering.

## Docs & demo

Docs have been temporarily removed. As an alternative, check out;

-   Unit test code in [`src/`](src)
-   [Demonstration site with several documents](https://wvbe.github.io/xml-renderer)
-   [Code to the demonstration site](https://github.com/wvbe/xml-renderer-demo)

## Installation

@TODO Use in Deno
@TODO Use in Node

## Example

```js
import React from 'react';
import { sync } from 'slimdom-sax-parser';

// Take the default export of `xml-renderer`
import { ReactRenderer } from 'xml-renderer';

// Instantiate a new object to contain rendering rules
const experience = new ReactRenderer(React.createElement);

// For text nodes you _probably_ just want to show the text content
experience.add('self::text()', ({ node }) => node.nodeValue);

// For some nodes, including the document node, you _probably_ just want to render the children
experience.add('self::node()', ({ traverse }) => traverse());

// For other nodes you may want to add a template
experience.add('self::paragraph', ({ traverse }) => <p>{traverse()}</p>);

// For some situations you may want to specify a more specific test
experience.add('self::paragraph[not(preceding-sibling::*)]', ({ traverse }) => (
	<p>
		<b>{traverse()}</b>
	</p>
));

// For some situations you may want to traverse into specific children, or add some elements of your own
experience.add('self::webpage', ({ traverse }) => (
	<div>
		<h1>My first page</h1>
		{traverse('./paragraph')}
	</div>
));

// ReactRenderer#render returns React elements, so you can use them in React like any other JS value
export default function MyXmlDocument({ xmlString }) {
	return <div className="doc-or-whatever">{xp.render(React.createElement, sync(xmlString))}</div>;
}
```
