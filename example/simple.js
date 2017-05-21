// Import relevant libraries
import React from 'react';
import ReactDOM from 'react-dom';
import XmlRenderer from 'xml-renderer';

const UserBadgeComponent = ({ identifier }) => <example-user-badge>{ identifier }</example-user-badge>;

const xr = new XmlRenderer();

// Render every <horizontal-ruler> XML element to an HTML <hr />. This is probably the simplest transformation.
xr.register('self::horizontal-ruler', renderer => <hr key={ renderer.key() } />);

// Render text as text :) This is actually also a pretty simple transformation
xr.register('self::text()', renderer => renderer.getNode().nodeValue);

// Render every XML element that has a "user-id" attribute to a component called "UserBadgeComponent",
//     and pass it the user identifier that we can get from the XML node.
xr.register('self::*[@user-id]', renderer => <UserBadgeComponent
	key={ renderer.key() }
	identifier={ renderer.getNode().getAttribute('user-id') }
/>);


// Render every <paragraph> XML node to a regular <p> HTML element
//     and traverse to render its children.
xr.register('self::paragraph', renderer => <p key={ renderer.key() }>
	{ renderer.traverse() }
</p>);

// Render a <webpage> XML node with a second traversal for all its <footnote> descendants
//     in an ordered list under a horizontal ruler.
xr.register('self::webpage', renderer => <div key={ renderer.key() }>
	{ renderer.traverse() }
	<hr />
	<ol>
		{ renderer.traverse('.//footnote', 'footnote-render-mode') }
	</ol>
</div>);

// Render footnotes as an asterisk, but render them again as list items (+ children) somewhere else.
xr.register('self::footnote', renderer => '*');
xr.mode('footnote-render-mode').register('self::footnote', renderer => <li key={ renderer.key() }>
	{ renderer.traverse() }
</li>);

// Load an XML string from anywhere
const xmlString = `
	<webpage>
		<author user-id="wvbe" />
		<paragraph>The preceding element, "author", was not specifically mentioned in this example yet, but it matches the XPath test for 'self::*[@user-id]'.</paragraph>
		<horizontal-ruler />
		<paragraph>Footnotes will be rendered as an asterisk<footnote><paragraph>But the full footnote is rendered at the bottom of a page</paragraph></footnote></paragraph>
	</webpage>
`;

const xmlDom = new window.DOMParser().parseFromString(xmlString, 'application/xml');

// Render that baby
ReactDOM.render(
	<div>{ xr.node(xmlDom).traverse() }</div>,
	document.getElementById('root')
);

// Output:
//	<div>
//		<UserBadgeComponent identifier="wvbe" />
//		<p>The preceding element, "author", was not specifically mentioned in this example yet, but it matches the XPath test for 'self::*[@user-id]'.</p>
//		<hr />
//		<p>Footnotes will be rendered as an asterisk*</p>
//		<hr />
//		<ol>
//			<li>
//				<p>But the full footnote is rendered at the bottom of a page</p>
//			</li>
//		</ol>
//	</div>

