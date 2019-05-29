import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/Experience';

const RenderingContainer = ({ xml, experience, traversalData }) => {
	return (
		<rendering-container>
			{ experience.render(
				sync(xml.trim()),
				traversalData) }
		</rendering-container>
	);
}

const basicExperience = new Experience();
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::document-node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ node }) => node.nodeValue);

describe('render()', () => {
	test('Doesn\'t do much without configuration', () => {
		const experience = new Experience();

		expect(experience.render(sync(`<div />`)))
			.toBeNull();
	});

	test('Matches configuration on the most specific XPath test that matches', () => {
		const experience = new Experience(basicExperience);

		experience.register('self::div', ({ nodeId, traverse }) => (
			<x-notok key={ nodeId }>{ traverse() }</x-notok>
		));

		experience.register('self::div[@some-attribute]', ({ nodeId, traverse }) => (
			<x-ok key={ nodeId }>{ traverse() }</x-ok>
		));

		experience.register('self::div[@some-attribute="y"]', ({ nodeId, traverse }) => (
			<x-also-notok key={ nodeId }>{ traverse() }</x-also-notok>
		));

		experience.register('self::div', ({ nodeId, traverse }) => (
			<x-also-notok key={ nodeId }>{ traverse() }</x-also-notok>
		));

		expect(renderer.create(experience.render(sync(`<div some-attribute="x" />`))).toJSON())
			.toMatchSnapshot();
	});

	test('based on a relative XPath query', () => {
		const experience = new Experience(basicExperience),
			xml = `
				<div>
					<span>OK</span>
					<span>NOTOK</span>
				</div>
			`;

		experience.register('self::*[not(parent::*)]', ({ traverse, node, nodeId, query, ...additionalStuff }) => (
			<cool-action key={ nodeId }>
				<node>{node.nodeName}</node>
				<query>{ query('string(./span[1]/@skr)') }</query>
				<additional-stuff>{JSON.stringify(additionalStuff)}</additional-stuff>
				<traverse>{ traverse('./*[1]') }</traverse>
			</cool-action>
		));

		experience.register('self::span', ({ nodeId, traverse }) => (
			<x-ok key={ nodeId }>{ traverse() }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()).toMatchSnapshot();
	});
});
