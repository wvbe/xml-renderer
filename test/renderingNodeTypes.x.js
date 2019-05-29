import React from 'react';
import Snapshot from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/Experience';
xdescribe('Simple rendering', () => {
	test('for elements', () => {
		const experience = new Experience();

		experience.register('self::element()', ({ key }) => (
			<x-ok key={ nodeId }>
				OK
			</x-ok>
		));

		expect(Snapshot.create(experience.render(sync(`<div />`))).toJSON())
			.toMatchSnapshot();
	});


	test('for text', () => {
		const experience = new Experience();

		experience.register('self::node() or self::document-node()', ({ traverse }) => traverse());

		experience.register('self::text()', ({ nodeId, node }) => (
			<x key={ nodeId }>{ node.nodeValue }</x>
		));

		expect(Snapshot.create(experience.render(sync(`<span>OK</span>`))).toJSON())
			.toMatchSnapshot();
	});

	test('for processing instructions', () => {
		const experience = new Experience();

		experience.register('self::node', ({ traverse }) => traverse());

		experience.register('self::processing-instruction()', ({ nodeId, node }) => (
			<x key={ nodeId }>{ node.target }</x>
		));

		expect(Snapshot.create(experience.render(sync(`<?OK ?>`))).toJSON())
			.toMatchSnapshot();
	});

	test('for comments', () => {
		const experience = new Experience();

		experience.register('self::node', ({ traverse }) => traverse());

		experience.register('self::comment()', ({ nodeId, node }) => (
			<x key={ nodeId }>{ node.data }</x>
		));

		expect(Snapshot.create(experience.render(sync(`<!-- OK -->`))).toJSON())
			.toMatchSnapshot();
	});

});
