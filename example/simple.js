import React from 'react';
const { renderToStaticMarkup } = require('react-dom/server');
import { RuleSet } from './dist';
import { sync } from 'slimdom-sax-parser';

// A basic RuleSet registry. You can merge experiences together by passing them as arguments to a constructor
const experience = new RuleSet();

// Even the most basic XML nodes could/should be configured, such as text nodes. The following line say text nodes
// should be rendered as their text string.
experience.add('self::text()', ({ node }) => node.nodeValue);

// This configuration will match any node that does not have (a more specific) configuration. Traversing to render the
// children is a good default to have for most node types.
experience.add('self::node()', ({ traverse }) => traverse());

experience.add('self::document-node()', ({ traverse }) => <page>{traverse()}</page>);

// Basic configuration to render XML <paragraph> as HTML <p>
experience.add('self::paragraph', ({ traverse }) => <p>{traverse()}</p>);

// Render the first <paragraph> in bold.
experience.add('self::paragraph[not(preceding-sibling::*)]', ({ traverse }) => (
	<p>
		<b>{traverse()}</b>
	</p>
));

const rendered = renderToStaticMarkup(
	experience.render(
		sync(`
			<webpage>
				<paragraph>Beep boop baap.</paragraph>
				<paragraph>I am a robot.</paragraph>
			</webpage>
		`)
	)
);

console.log(rendered);
