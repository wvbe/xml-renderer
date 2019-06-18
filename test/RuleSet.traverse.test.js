import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser';
import { RuleSet } from '../main';

const basicExperience = new RuleSet();
basicExperience.add('self::node()', ({ traverse }) => traverse());
basicExperience.add('self::document-node()', ({ traverse }) => traverse());
basicExperience.add('self::text()', ({ node }) => node.nodeValue);

const xml = `<div some-attribute="x"><div>Some text <b>nodes</b> for ya</div></div>`;

describe('traverse()', () => {
	test('Accepts query to traverse into subtree', () => {
		const experience1 = new RuleSet(basicExperience);
		experience1.add('self::div', ({ traverse }) => traverse('./div/b'));
		expect(renderer.create(experience1.render(sync(xml))).toJSON()).toBe('nodes');
	});

	test('Nulling any argument becomes the default value', () => {
		const experience1 = new RuleSet(basicExperience);
		experience1.add('self::div', ({ nodeId, traverse, proof }) => (
			<x-ok key={nodeId} data-proof={proof}>
				{traverse()}
			</x-ok>
		));
		expect(renderer.create(experience1.render(sync(xml), { proof: 'blaat' })).toJSON()).toMatchSnapshot();

		const experience2 = new RuleSet(basicExperience);
		experience2.add('self::div', ({ nodeId, traverse, proof }) => (
			<x-ok key={nodeId} data-proof={proof}>
				{traverse(null, null)}
			</x-ok>
		));
		expect(renderer.create(experience2.render(sync(xml), { proof: 'blaat' })).toJSON()).toEqual(
			renderer.create(experience1.render(sync(xml), { proof: 'blaat' })).toJSON()
		);

		const experience3 = new RuleSet(basicExperience);
		experience3.add('self::div', ({ nodeId, traverse, proof }) => (
			<x-ok key={nodeId} data-proof={proof}>
				{traverse('./node()', { proof })}
			</x-ok>
		));
		expect(renderer.create(experience3.render(sync(xml), { proof: 'blaat' })).toJSON()).toEqual(
			renderer.create(experience1.render(sync(xml), { proof: 'blaat' })).toJSON()
		);
	});

	test('Just the first argument is also optional', () => {
		const experience1 = new RuleSet(basicExperience);
		experience1.add('self::div', ({ nodeId, traverse, proof }) => (
			<x-ok key={nodeId} data-proof={proof}>
				{traverse(null, { proof })}
			</x-ok>
		));
		expect(renderer.create(experience1.render(sync(xml), { proof: 'blaat' })).toJSON()).toMatchSnapshot();

		const experience2 = new RuleSet(basicExperience);
		experience2.add('self::div', ({ nodeId, traverse, proof }) => (
			<x-ok key={nodeId} data-proof={proof}>
				{traverse({ proof })}
			</x-ok>
		));
		expect(renderer.create(experience1.render(sync(xml))).toJSON()).toEqual(
			renderer.create(experience2.render(sync(xml))).toJSON()
		);
	});
});
