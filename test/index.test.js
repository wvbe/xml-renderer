import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/index';

const RenderingContainer = ({ xml, experience, traversalQuery, traversalData }) => {
	return (
		<rendering-container>
			{ experience.render(
				sync(xml.trim()),
				traversalQuery,
				traversalData) }
		</rendering-container>
	);
}

const basicExperience = new Experience();
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ key, node }) => node().nodeValue);



describe('Traversal v2', () => {
	test('Matches configuration on the most specific XPath test that matches', () => {
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

		expect(renderer.create(experience.render(sync(`<div some-attribute="x" />`))).toJSON())
			.toMatchSnapshot();
	});

	test('based on a relative XPath query', () => {
		const experience = new Experience(),
			xml = `
				<div>
					<span>OK</span>
					<span>NOTOK</span>
				</div>
			`;

		// Previously:
		//   experience.register('self::text()', renderer => renderer.getNode().nodeValue);
		experience.register('self::text()', ({ traverse, node, key, query, additionalStuff }) => node().nodeValue);

		experience.register('self::*[not(parent::*)]', ({ traverse, node, key, query, ...additionalStuff }) => (
			<cool-action key={ key() }>
				<node>{node().nodeName}</node>
				<query>{ query('string(./span[1]/@skr)') }</query>
				<additional-stuff>{JSON.stringify(additionalStuff)}</additional-stuff>
				<traverse>{ traverse('./*[1]') }</traverse>
			</cool-action>
		));

		experience.register('self::span', ({ key, traverse }) => (
			<x-ok key={ key() }>{ traverse() }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()).toMatchSnapshot();
	});
});


function collectKeys (obj, stats = {}) {
	if (obj.props['data-key']) {
		stats[obj.props['data-key']] = (stats[obj.props['data-key']] || 0) + 1;
	}

	if (obj.children) {
		obj.children.forEach(child => collectKeys(child, stats));
	}

	return stats;
}

xdescribe('Keys', () => {
	test('are always unique', () => {
		const experience = new Experience(),
			xml = `
				<div>
					<div />
					<div />
					<div>
						<fn />
					</div>
					<div>
						<fn />
					</div>
				</div>
			`;

		experience.register('self::div', renderer => (
			<x key={ key() } data-key={ key() }>
				{ traverse() }
				{ traverse('./fn', 'my-mode') }
			</x>
		));

		experience.register('self::fn', renderer => (
			<x key={ key() } data-key={ key() } />
		));

		const keys = collectKeys(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON());

		// If every key occurs exactly once, the amount of keys is equal to the amount of usages.
		expect(Object.keys(keys).length).toBe(Object.keys(keys).reduce((total, key) => total + keys[key], 0));
	});

	test('are stable', () => {
		const experience = new Experience(),
			xml = `
				<div>
					<div />
				</div>
			`;

		experience.register('self::div', renderer => (
			<x key={ key() } data-key={ key() }>
				{ traverse() }
			</x>
		));

		const keys1 = collectKeys(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()),
			keys2 = collectKeys(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON());

		expect(keys1).toEqual(keys2);
	});

	test('reuse existing identifiers', () => {
		const experience = new Experience(),
			xml = `
				<div>
					<div id="OK">
						<div />
						<div>
							<div />
						</div>
					</div>
				</div>
			`;

		experience.register('self::div', renderer => (
			<x key={ key() } data-key={ key() }>
				{ traverse() }
			</x>
		));

		const keys = collectKeys(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON());

		// Counts the keys starting with "OK". This test might fail while the requirements are still being met if
		// the formatting algorithm no longer puts the identifier at the beginning of the key.
		expect(Object.keys(keys).filter(key => key.indexOf('OK') === 0).length).toBe(4);
	});
});

xdescribe('Custom XPath functions', () => {
	it('can be registered', () => {
		const experience = new Experience(),
			xml = `
				<div>
					<aside>
						<div/>
					</aside>
				</div>
			`;

		experience.registerXPathFunction('node-name-starts-with-vowel', ['node()'], 'xs:boolean', function (domFacade, node) {
			return 'eaouiy'.split('').includes(node.nodeName.charAt(0));
		});

		experience.register('self::element()', renderer => (
			<x key={ key() }>
				{ traverse() }
			</x>
		));

		experience.register('self::*[node-name-starts-with-vowel(.)]', renderer => (
			<x-ok key={ key() }>
				{ traverse() }
			</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()).toMatchSnapshot();
	})

});

xdescribe('Namespaces', () => {
	it('can be targeted by namespace URI', () => {
		const experience = new Experience(),
			xml = `
				<div xmlns:mfns="namespace-1">
					<mfns:div />
					<div />
				</div>
			`;

		experience.register('self::*', renderer => traverse());

		experience.register('self::*[namespace-uri() = "namespace-1"]', renderer => (
			<x-ok key={ key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()).toMatchSnapshot();
	})
});

xdescribe('Rendering callback', () => {
	it('receives name of the rendering mode', () => {
		const experience = new Experience(),
			xml = `
				<div />
			`;

		experience.register('self::*', (renderer, mode) => (
			<div key={ key() }>
				<default-mode-name>{ mode }</default-mode-name>
				{ traverse('.', 'some-mode') }
			</div>
		));
		experience.mode('some-mode').register('self::*', (renderer, mode) => (
			<some-mode-name key={ key() }>
				{ mode }
			</some-mode-name>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()).toMatchSnapshot();
	});

	test('receives the rest arguments passed to traverse() by the parent', () => {
		const experience = new Experience(),
			xml = `
				<div>
					<span>NOTOK</span>
					<span>NOTOK</span>
				</div>
			`;

		experience.register('self::div', renderer => (
			<x key={ key() }>{ traverse(null, null, { skeet: 'OK' }) }</x>
		));

		experience.register('self::span', (renderer, _mode, whatever) => (
			<x-ok key={ key() }>{ whatever.skeet }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } experience={ experience } />).toJSON()).toMatchSnapshot();
	});
});
