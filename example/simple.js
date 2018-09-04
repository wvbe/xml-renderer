import React from 'react';
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
import Experience from 'xml-renderer';
import { sync } from 'slimdom-sax-parser';

// A basic Experience registry. You can merge experiences together by passing them as arguments to a constructor
const experience = new Experience();

// Even the most basic XML nodes could/should be configured, such as text nodes
experience.register('self::text()', ({ node }) => node().nodeValue);

// This configuration will match any element that does not have (a more specific) configuration. In this case,
// unconfigured elements traverse into their children.
experience.register('self::element()', ({ traverse }) => traverse());

// Basic config to render XML <paragraph> as HTML <p>
experience.register('self::paragraph', ({ key, traverse }) => (
	<p key={ key() }>
		{ traverse() }
	</p>
));

experience.register('self::horizontal-ruler', ({ key }) => (
	<hr key={ key() } />
));

experience.register('self::footnote', () => (
	'*'
));

function RenderedXml ({ xml, experience }) {
	return experience.render(sync(xml));
}



// Render that baby
const rendered = renderToStaticMarkup(
	<RenderedXml
		experience={ experience }
		xml={`
			<webpage>
				<author user-id="wvbe" />
				<paragraph>The preceding element, "author", was not <i>specifically</i> mentioned in this example yet, but it matches the XPath test for 'self::*[@user-id]'.</paragraph>
				<horizontal-ruler />
				<paragraph>Footnotes will be rendered as an asterisk<footnote><paragraph>But the full footnote is rendered at the bottom of a page</paragraph></footnote></paragraph>
			</webpage>
		`}
	/>
);

console.log(rendered);