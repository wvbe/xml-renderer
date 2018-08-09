import React from 'react';
import Snapshot from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/index';
describe('Simple rendering', () => {
	test('for elements', () => {
		const experience = new Experience();

		experience.register('self::element()', ({ key }) => (
			<x-ok key={ key() }>
				OK
			</x-ok>
		));

		expect(Snapshot.create(experience.render(sync(`<div />`))).toJSON())
			.toMatchSnapshot();
	});

	test('for text', () => {
		const experience = new Experience();

		experience.register('self::node()', ({ traverse }) => traverse());

		experience.register('self::text()', ({ key, node }) => (
			<x key={ key() }>{ node().nodeValue }</x>
		));

		expect(Snapshot.create(experience.render(sync(`<span>OK</span>`))).toJSON())
			.toMatchSnapshot();
	});

	test('for processing instructions', () => {
		const experience = new Experience();

		experience.register('self::node()', ({ traverse }) => traverse());

		experience.register('self::processing-instruction()', ({ key, node }) => (
			<x key={ key() }>{ node().target }</x>
		));

		expect(Snapshot.create(experience.render(sync(`<?OK ?>`))).toJSON())
			.toMatchSnapshot();
	});

	test('for comments', () => {
		const experience = new Experience();

		experience.register('self::node()', ({ traverse }) => traverse());

		experience.register('self::comment()', ({ key, node }) => (
			<x key={ key() }>{ node().data }</x>
		));

		expect(Snapshot.create(experience.render(sync(`<!-- OK -->`))).toJSON())
			.toMatchSnapshot();
	});

});
