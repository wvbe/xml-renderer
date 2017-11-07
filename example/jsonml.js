// Import relevant libraries
import XmlRenderer from 'xml-renderer';
import parser from 'slimdom-sax-parser';

const xr = new XmlRenderer();

// Register render functions for specific elements
xr.register('self::text()', renderer => renderer.getNode().nodeValue);

xr.register('self::section', renderer => [
	'div',
	...renderer.traverse(),
	['hr'],
	[
		'ol',
		...renderer.traverse('.//footnote', 'footnotes')
	]
]);

xr.register('self::paragraph', renderer => [
	'p',
	...renderer.traverse()
]);

xr.register('self::paragraph[@special]', renderer => [
	'p',
	'~',
	...renderer.traverse(),
	'~'
]);

xr.register('self::footnote', renderer => [
	'b',
	'*'
]);

xr.mode('footnotes').register('self::footnote', renderer => [
	'li',
	...renderer.traverse()
]);

// Load an XML string from anywhere, and use the browser to create a DOM
const xml = parser.sync(`
    <section>
        <paragraph>My first paragraph<footnote>This is the footnote.</footnote>.</paragraph>
        <paragraph>My second paragraph.</paragraph>
        <paragraph special="true">My special paragraph.</paragraph>
    </section>
`, `application/xml`);

// Render that baby
console.log(JSON.stringify(xr.node(xml.documentElement).render(), null, '\t'));
