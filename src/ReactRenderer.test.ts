import React, { Fragment, ReactElement } from 'react';
import reactTestRenderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser';

import { ReactRenderer } from './ReactRenderer';

describe('ReactRenderer', () => {
	test('returns the expected result', () => {
		const node = sync(`<a><b /><b foo="bar"/></a>`);
		const registry = new ReactRenderer();

		// In proper TS
		registry.add('self::document-node()', ({ traverse }) =>
			React.createElement(Fragment, {}, traverse())
		);
		registry.add('self::a', ({ traverse }) =>
			React.createElement('a', {}, traverse('./*[@foo]'))
		);
		registry.add('self::b', () => React.createElement('x'));
		registry.add('self::b[@foo]', () => React.createElement('b'));

		const output = registry.render(React.createElement, (node as unknown) as Node);
		expect(
			// reactTestRenderer does not accept null, so force output as ReactElement
			reactTestRenderer.create(output as ReactElement)
		).toMatchInlineSnapshot(`
		<a>
		  <b />
		</a>
	`);
	});
});
