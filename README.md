# xml-renderer

A quite simple way of registering rendering functions for XML nodes, effectively an XSL with javascript functions. Works
great transforming XML to React components, but writing to a JsonML structure or string is also fine.

## To install

```bash
npm i xml-renderer --save
```

## To use

Using `xml-renderer` is two parts; registering the renderer for a given node, and actually rendering that.

Assume a `const xr = new XmlRenderer()` shared between the following examples.

## Registering and rendering

The first parameter to registering a renderer for a node is always an XPath boolean test. The second parameter is a
callback that is expected to return the result for any XML node that matches the test. This callback is given an
instance of `NodeRenderer` that allows you to access the actual XML node, or traverse into its children.

```js
// Render every <horizontal-ruler> XML element to an HTML <hr />.
//   This is probably the simplest transformation.
xr.register('self::horizontal-ruler', renderer => (
  <hr key={ renderer.key() } />
));

// Render text as text :) This is actually also a pretty simple
//   transformation
xr.register('self::text()', renderer => renderer.getNode().nodeValue);

// Render every XML element that has a "user-id" attribute to a
//   component called "UserBadgeComponent", and pass it the user
//   identifier that we can get from the XML node.
xr.register('self::*[@user-id]', renderer => (
  <UserBadgeComponent
    key={ renderer.key() }
    identifier={ renderer.getNode().getAttribute('user-id') }
  />
));
```

Usually you'll start rendering of root nodes, or rendering of child nodes, using `NodeRenderer#traverse()`. Most of the
time you'll actually be rendering a child element, so the `traverse()` call in a parent element's renderer is very
important.

```js
// Render every <paragraph> XML node to a regular <p> HTML element
//   and traverse to render its children.
xr.register('self::paragraph', renderer => (
  <p key={ renderer.key() }>
    { renderer.traverse() }
  </p>
));

// Render footnotes as an asterisk, but render them again as list
//   items (+ children) somewhere else.
xr.register('self::footnote', renderer => '*');
xr.mode('footnote-render-mode')
  .register('self::footnote', renderer => (
    <li key={ renderer.key() }>
    { renderer.traverse() }
  </li>
  ));

// Render a <webpage> XML node with a second traversal in a
//   different mode for all its <footnote> descendants in an ordered
//   list under a horizontal ruler.
xr.register('self::webpage', renderer => (
  <div key={ renderer.key() }>
    { renderer.traverse() }
    <hr />
    <ol>
      { renderer.traverse('.//footnote', 'footnote-render-mode') }
    </ol>
  </div>
));
```

To finally engage all of the above for an XML string that you've loaded from anywhere, use a `DOMParser` to create a DOM out of it and start `xr` for that.

```js
// Load an XML string from anywhere
const xmlString = `
  <webpage>
    <author user-id="wvbe" />
    <paragraph>
      The preceding element, "author", was not specifically mentioned
      in this example yet, but it matches the XPath test for
      'self::*[@user-id]'.
    </paragraph>
    <horizontal-ruler />
    <paragraph>
      Footnotes will be rendered as an asterisk<footnote>
        <paragraph>
          But the full footnote is rendered at the bottom of a page
        </paragraph>
      </footnote>.
    </paragraph>
  </webpage>
`;

// Create a DOM
const xmlDom = new window.DOMParser().parseToString(
  xmlString,
  'application/xml'
);

// Render that baby
ReactDOM.render(
  <div>{ xr.node(xmlDom).traverse() }</div>,
  document.getElementById('root')
);
```

This should yield a DOM like this:

```xml
<div>
  <UserBadgeComponent identifier="wvbe" />
  <p>
    The preceding element, "author", was not specifically mentioned
    in this example yet, but it matches the XPath test for
    'self::*[@user-id]'.
  </p>
  <hr />
  <p>
    Footnotes will be rendered as an asterisk*
  </p>
  <hr />
  <ol>
    <li>
      <p>
        But the full footnote is rendered at the bottom of a page
      </p>
    </li>
  </ol>
</div>
```

The full code for this example is in [example/simple.js](./example/simple.js).
