import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/Experience';

const basicExperience = new Experience();
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ key, node }) => node().nodeValue);

describe('renderData', () => {
	xtest('should accumulate as it is passed down to traversals', () => {
		const experience = new Experience(basicExperience);

		experience.register('self::x', ({ key, traverse, data1, data2 }) => [
			'x',
			data1,
			data2,
			...traverse({
				// data1 should be passed even if it is not mentioned here
				data2: data2 + 1
			})
		]);

		experience.register('self::div', ({ key, traverse, data1, data2 }) => [
			'div',
			data1,
			data2,
			...traverse()
		]);

		const result = experience.render(sync(`<div><x><x /><div /></x><div /></div>`), {
			data1: 'bacon',
			data2: 0
		});

		console.log(result);
		expect(result)
			.toMatchSnapshot();
	});
});
