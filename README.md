# xml-renderer

Combines XML and XPath with _your_ components and stylesheets to render whatever in React or elsewhere.

## To install

```sh
npm i xml-renderer --save
```

## To use

> As seen in the [example/](./example) directory.

1. Configure one or more elements to look like something
2. Convert your XML into a Javascript DOM
3. Profit


### Example

```js
const xr = new XmlRenderer();

// 1. Configure one or more elements to look like something

// text nodes
xr.register('self::text()', renderer => (
    renderer.getNode().nodeValue
));

// paragraph element nodes
xr.register('self::paragraph', renderer => (
  <p key={ renderer.key() }>
    { renderer.traverse() }
  </p>
));

// every <person> called "wvbe" on github
xr.register('self::person[@github="wvbe"]', renderer => (
  <CoolGuyBadge key={ renderer.key() }>
    { renderer.traverse('./name') }
  </CoolGuyBadge>
));

// etc.
    
// 2. Convert your XML into a Javascript DOM
const xmlDom = new window.DOMParser().parseFromString(
  xmlString,
  'application/xml'
);
    
// 3. Profit
ReactDOM.render(
  <div>{ xr.node(xmlDom).traverse() }</div>,
  document.getElementById('root')
);
```

## Pro-tips
- Render modes combined with traversal queries are powerful tools to publish the same content in different ways.
- The XPath library ([fontoxpath](http://npmjs.org/package/fontoxpath)) supports namespaces and injecting your custom XPath functions.
- xml-renderer words great with React (or to be more specific, JSX), but can also be used without it to render XML strings, JSONML or other output.

## License

MIT
