import React from 'react';
import renderer from 'react-test-renderer';
import { sync } from 'slimdom-sax-parser'
import Experience from '../src/Experience';

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
