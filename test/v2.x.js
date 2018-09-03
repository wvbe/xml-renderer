import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser';
import Experience from '../src/Experience';

const RenderingContainer = ({ xml, registry, traversalQuery, traversalData }) => {
	return (
		<rendering-container>
			{ registry.render(
				sync(xml.trim()),
				traversalQuery,
				traversalData) }
		</rendering-container>
	);
}

describe('Merging experiences', () => {
	const renderTextExperience = new Experience();
	renderTextExperience.register('self::text()', ({ node }) => node().nodeValue);

	const renderElementExperience = new Experience();
	renderElementExperience.register('self::element()', ({ traverse, key }) => <x key={key()}>{ traverse() }</x>);

	expect(renderer.create(<RenderingContainer
		xml={ `<div>text</div>` }
		registry={ new Experience(renderTextExperience, renderElementExperience) }
	/>).toJSON()).toMatchSnapshot();
})

test('based on a relative XPath query', () => {
	const registry = new Experience(),
		xml = `
			<div>
				<span skr="skkkrrah!" />
				<span />
			</div>
		`;

	// Previously:
	//   registry.register('self::text()', renderer => renderer.getNode().nodeValue);
	registry.register('self::text()', ({ traverse, node, key, query, additionalStuff }) => node().nodeValue);

	registry.register('self::*[not(parent::*)]', ({ traverse, node, key, query, ...additionalStuff }) => (
		<cool-action key={ key() }>
			<node>
				{
					// Previously:
					//   renderer.getNode().nodeName
					node().nodeName
				}
			</node>

			<query typeof={ typeof query('string(./span[1]/@skr)') }>
				{
					// Previously:
					//   fontoxpath.evaluateXPath('string(...)', renderer.getNode())
					query('string(./span[1]/@skr)')
				}
			</query>

			<additional-stuff>
				{JSON.stringify(additionalStuff)}
			</additional-stuff>

			<traverse>
				{ traverse() }
			</traverse>

			<traverse-defaults>
				{ traverse('./node()', additionalStuff) }
			</traverse-defaults>

			<traverse-with-query>
				{ traverse('./element()') }
			</traverse-with-query>

			<traverse-with-query-and-extra>
				{ traverse('./element()', { extra: true }) }
			</traverse-with-query-and-extra>

			<traverse-with-extra>
				{ traverse({ extra: true }) }
			</traverse-with-extra>

			<traverse-with-all-extra-data>
				{ traverse('./element()', { extra: true, ...additionalStuff }) }
			</traverse-with-all-extra-data>
		</cool-action>
	));

	registry.register('self::span[@skr]', ({ key, traverse, ...additionalStuff }) => (
		<x-ok key={ key() }>{JSON.stringify(additionalStuff)}</x-ok>
	));

	expect(renderer.create(<RenderingContainer
		xml={ xml }
		registry={ registry }
		traversalData={{ fromRoot: true }}
	/>).toJSON()).toMatchSnapshot();
});