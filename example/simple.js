import React from 'react';
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
import Experience from 'xml-renderer';
import { sync } from 'slimdom-sax-parser';

const experience = new Experience();

experience.register('self::element()', ({ traverse }) => traverse());
experience.register('self::text()', ({ node }) => node().nodeValue);

function RenderedXml ({ xml, experience }) {
	return experience.render(sync(xml));
}

// Render that baby
const rendered = renderToString(
	<RenderedXml
		experience={ experience }
		xml={`
			<webpage>
				<author user-id="wvbe" />
				<paragraph>The preceding element, "author", was not specifically mentioned in this example yet, but it matches the XPath test for 'self::*[@user-id]'.</paragraph>
				<horizontal-ruler />
				<paragraph>Footnotes will be rendered as an asterisk<footnote><paragraph>But the full footnote is rendered at the bottom of a page</paragraph></footnote></paragraph>
			</webpage>
		`}
	/>
);

console.log(rendered);