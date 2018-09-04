import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/Experience';

const basicExperience = new Experience();
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ key, node }) => node().nodeValue);

describe('renderData', () => {
	test('should accumulate as it is passed down to traversals', () => {
		const experience = new Experience(basicExperience);

		experience.register('self::element()', ({ key, traverse, node, query, ...renderData }) => [
			node().nodeName,
			renderData,
			...traverse()
		]);

		experience.register('self::a', ({ traverse, node, data2 }) => traverse({
			data2: data2 + 1
		}));

		experience.register('self::b', ({ traverse, node }) => traverse({
			data3: 'beer'
		}));

		experience.register('self::c', ({ traverse, node }) => traverse({
			data4: 'eggs'
		}));

		const result = experience.render(sync(`<a><b><with-beer /></b><c><with-eggs /></c></a>`), {
			// Should exist on the deepest traversal level, even if it is never passed explicitly
			data1: 'bacon',

			// Accumulated by every traversal into an <a /> node
			data2: 0,

			// data3, Is only set when traversing the children of <b />

			// data4, Is only set when traversing the children of <c />
		});

		expect(result)
			.toMatchSnapshot();
	});
});
