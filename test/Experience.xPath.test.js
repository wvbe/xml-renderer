import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience, { xPath } from '../src/Experience';

const basicExperience = new Experience();
basicExperience.register('self::document-node()', ({ traverse }) => traverse());
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ node }) => node().nodeValue);

const xml = `<div>text</div>`;

describe('xPath', () => {
	test('registerCustomXPathFunction', () => {
		xPath.registerCustomXPathFunction('my-ns:my-custom-fn', ['xs:string'], 'xs:string', (_context, arg1) => {
			return arg1.toUpperCase();
		});

		const experience1 = new Experience(basicExperience);
		experience1.register('self::div', ({ query }) => query('my-ns:my-custom-fn(string(.))'));
		expect(renderer.create(experience1.render(sync(xml))).toJSON())
			.toBe('TEXT');
	});

});
