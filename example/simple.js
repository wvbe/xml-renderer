import React from 'react';
const { renderToStaticMarkup } = require('react-dom/server')
import Experience from './dist.es5';
import { sync } from 'slimdom-sax-parser';

// A basic Experience registry. You can merge experiences together by passing them as arguments to a constructor
const experience = new Experience();

// Even the most basic XML nodes could/should be configured, such as text nodes. The following line say text nodes
// should be rendered as their text string.
experience.register('self::text()', ({ node }) => node.nodeValue);

// This configuration will match any node that does not have (a more specific) configuration. Traversing to render the
// children is a good default to have for most node types.
experience.register('self::node()', ({ traverse }) => traverse());

// Basic configuration to render XML <paragraph> as HTML <p>
experience.register('self::paragraph', ({ nodeId, traverse }) => (
	<p key={ nodeId }>
		{ traverse() }
	</p>
));

// Render the first <paragraph> in bold.
experience.register('self::paragraph[not(preceding-sibling::*)]', ({ nodeId, traverse }) => (
	<p key={ nodeId }>
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