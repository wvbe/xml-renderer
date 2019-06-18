import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser';
import { RuleSet } from '../main';

const basicExperience = new RuleSet();
basicExperience.add('self::node()', ({ traverse }) => traverse());
basicExperience.add('self::document-node()', ({ traverse }) => traverse());
basicExperience.add('self::text()', ({ node }) => node.nodeValue);

describe('renderData', () => {
	test('should accumulate as it is passed down to traversals', () => {
		const experience = new RuleSet(basicExperience);

		experience.add('self::element()', ({ nodeId, traverse, node, query, ...renderData }) => [
			node.nodeName,
			renderData,
			...traverse()
		]);

		experience.add('self::a', ({ traverse, node, data2 }) =>
			traverse({
				data2: data2 + 1
			})
		);

		experience.add('self::b', ({ traverse, node }) =>
			traverse({
				data3: 'beer'
			})
		);

		experience.add('self::c', ({ traverse, node }) =>
			traverse({
				data4: 'eggs'
			})
		);

		const result = experience.render(sync(`<a><b><with-beer /></b><c><with-eggs /></c></a>`), {
			// Should exist on the deepest traversal level, even if it is never passed explicitly
			data1: 'bacon',

			// Accumulated by every traversal into an <a /> node
			data2: 0

			// data3, Is only set when traversing the children of <b />

			// data4, Is only set when traversing the children of <c />
		});

		expect(result).toMatchSnapshot();
	});
});
