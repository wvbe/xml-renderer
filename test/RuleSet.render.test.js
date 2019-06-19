import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser';
import { RuleSet } from '../main';

const RenderingContainer = ({ xml, experience, traversalData }) => {
	return <rendering-container>{experience.render(sync(xml.trim()), traversalData)}</rendering-container>;
};

const basicExperience = new RuleSet();
basicExperience.add('self::node()', ({ traverse }) => traverse());
basicExperience.add('self::document-node()', ({ traverse }) => traverse());
basicExperience.add('self::text()', ({ node }) => node.nodeValue);

describe('render()', () => {
	test("Doesn't do much without configuration", () => {
		const experience = new RuleSet();

		expect(() => experience.render(sync(`<div />`)))
			.toThrow('There was no match for the given node');
	});

	test('Matches configuration on the most specific XPath test that matches', () => {
		const experience = new RuleSet(basicExperience);

		experience.add('self::div', ({ nodeId, traverse }) => <x-notok key={nodeId}>{traverse()}</x-notok>);

		experience.add('self::div[@some-attribute]', ({ nodeId, traverse }) => <x-ok key={nodeId}>{traverse()}</x-ok>);

		experience.add('self::div[@some-attribute="y"]', ({ nodeId, traverse }) => (
			<x-also-notok key={nodeId}>{traverse()}</x-also-notok>
		));

		experience.add('self::div', ({ nodeId, traverse }) => <x-also-notok key={nodeId}>{traverse()}</x-also-notok>);

		expect(renderer.create(experience.render(sync(`<div some-attribute="x" />`))).toJSON()).toMatchSnapshot();
	});

	test('based on a relative XPath query', () => {
		const experience = new RuleSet(basicExperience),
			xml = `
				<div>
					<span>OK</span>
					<span>NOTOK</span>
				</div>
			`;

		experience.add('self::*[not(parent::*)]', ({ traverse, node, nodeId, query, ...additionalStuff }) => (
			<cool-action key={nodeId}>
				<node>{node.nodeName}</node>
				<query>{query('string(./span[1]/@skr)')}</query>
				<additional-stuff>{JSON.stringify(additionalStuff)}</additional-stuff>
				<traverse>{traverse('./*[1]')}</traverse>
			</cool-action>
		));

		experience.add('self::span', ({ nodeId, traverse }) => <x-ok key={nodeId}>{traverse()}</x-ok>);

		expect(renderer.create(<RenderingContainer xml={xml} experience={experience} />).toJSON()).toMatchSnapshot();
	});
});
