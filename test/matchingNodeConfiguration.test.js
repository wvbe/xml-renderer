import React from 'react';
import Snapshot from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/index';

const basicExperience = new Experience();
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ key, node }) => node().nodeValue);

describe('Matching node configuration', () => {
	test('on the most specific XPath test that matches', () => {
		const experience = new Experience(basicExperience);

		experience.register('self::div', ({ key, traverse }) => (
			<x-notok key={ key() }>{ traverse() }</x-notok>
		));

		experience.register('self::div[@some-attribute]', ({ key, traverse }) => (
			<x-ok key={ key() }>{ traverse() }</x-ok>
		));

		experience.register('self::div[@some-attribute="y"]', ({ key, traverse }) => (
			<x-also-notok key={ key() }>{ traverse() }</x-also-notok>
		));

		experience.register('self::div', ({ key, traverse }) => (
			<x-also-notok key={ key() }>{ traverse() }</x-also-notok>
		));

		expect(Snapshot.create(experience.render(sync(`<div some-attribute="x" />`))).toJSON())
			.toMatchSnapshot();
	});
});

