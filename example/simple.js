// Import relevant libraries
import React from 'react';
import ReactDOM from 'react-dom';
import XmlRenderer from 'xml-renderer';

const registry = new XmlRenderer();

// Register render functions for specific elements
registry.register('self::text()', renderer => renderer.getNode().nodeValue);

registry.register('self::section', renderer => (
	<div key={ renderer.key() }>
		<h1>My first section</h1>
		{ renderer.traverse() }
		<hr />
		<ol>
			{ renderer.traverse('.//footnote', 'footnotes') }
		</ol>
	</div>
));

registry.register('self::paragraph', renderer => (
	<p key={ renderer.key() }>
		{ renderer.traverse() }
	</p>
));

registry.register('self::paragraph[@special]', renderer => (
	<p key={ renderer.key() }>
		~{ renderer.traverse() }~
	</p>
));

registry.register('self::footnote', renderer => <b key={ renderer.key() }>*</b>);
registry.mode('footnotes').register('self::footnote', renderer => (
	<li key={ renderer.key() }>
		{ renderer.traverse() }
	</li>
));

// Load an XML string from anywhere, and use the browser to create a DOM
const xml = new window.DOMParser().parseFromString(`
    <section>
        <paragraph>My first paragraph<footnote>This is the footnote.</footnote>.</paragraph>
        <paragraph>My second paragraph.</paragraph>
        <paragraph special="true">My special paragraph.</paragraph>
    </section>
`, `application/xml`);

// Render that baby
ReactDOM.render(
	<div>{ registry.node(xml).traverse() }</div>,
	document.getElementById('root')
);

// <div>
//     <h1>My first section</h1>
//     <p>My first paragraph<b>*</b>.</p>
//     <p>My second paragraph.</p>
//     <p>~My special paragraph.~</p>
//     <hr />
//     <ol>
//         <li>This is the footnote.</li>
//     </ol>
// </div>
