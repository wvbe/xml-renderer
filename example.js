import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { sync } from 'slimdom-sax-parser';

// Take the default export of `xml-renderer`
import MetadataRegistry from './dist';

// Instantiate a new object to contain rendering rules
const experience = new MetadataRegistry();

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

// React is not included, so bring your own
const renderer = experience.createReactRenderer(React);

// In this example we're rendering to a string, but this works for "normal" React use too
const rendered = renderToStaticMarkup(
	renderer(
		sync(`
			<webpage>
				<paragraph>Beep boop baap.</paragraph>
				<paragraph>I am a robot.</paragraph>
				<copy>Copyright whomever</copy>
			</webpage>
		`)
	)
);

// Profit
console.log(rendered);
