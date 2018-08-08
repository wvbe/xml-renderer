import React from 'react';
import renderer from 'react-test-renderer';

import Registry from '../src/index';

const domParser = new window.DOMParser();
const RenderingContainer = ({ xml, registry, traversalQuery, traversalData }) => {
	return (
		<rendering-container>
			{ registry.render(
				domParser.parseFromString(xml.trim(), 'application/xml'),
				traversalQuery,
				traversalData) }
		</rendering-container>
	);
}
xdescribe('Rendering', () => {
	test('for elements', () => {
		const registry = new Registry(),
			xml = `
				<div />
			`;

		registry.register('self::element()', renderer => (
			<x-ok key={ renderer.key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('for text', () => {
		const registry = new Registry(),
			xml = `
				OK
			`;

		registry.register('self::text()', renderer => (
			<x key={ renderer.key() }>{ renderer.getNode().nodeValue }</x>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('for processing instructions', () => {
		const registry = new Registry(),
			xml = `
				<?OK ?>
			`;

		registry.register('self::processing-instruction()', renderer => (
			<x key={ renderer.key() }>{ renderer.getNode().target }</x>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('for comments', () => {
		const registry = new Registry(),
			xml = `
				<!-- OK -->
			`;

		registry.register('self::comment()', renderer =>  (
			<x key={ renderer.key() }>{ renderer.getNode().data }</x>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('for nested structures', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<div />
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>{ renderer.traverse() }</x>
		));

		registry.register('self::div[parent::div]', renderer => (
			<x-ok key={ renderer.key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});
});

xtest('Will use the most specific selector', () => {
	const registry = new Registry(),
		xml = `
			<div some-attribute="x" />
		`;

	registry.register('self::div', renderer => (
		<x-notok key={ renderer.key() } />
	));

	registry.register('self::div[@some-attribute]', renderer => (
		<x-ok key={ renderer.key() } />
	));

	registry.register('self::div', renderer => (
		<x-notok key={ renderer.key() } />
	));

	expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
});

xdescribe('Traversal', () => {
	test('based on a relative XPath query', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<span>OK</span>
					<span>NOTOK</span>
				</div>
			`;

		registry.register('self::text()', renderer => renderer.getNode().nodeValue);

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>{ renderer.traverse('./*[1]') }</x>
		));

		registry.register('self::span', renderer => (
			<x-ok key={ renderer.key() }>{ renderer.traverse() }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});
});

describe('Traversal v2', () => {
	test('based on a relative XPath query', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<span>OK</span>
					<span>NOTOK</span>
				</div>
			`;

		// Previously:
		//   registry.register('self::text()', renderer => renderer.getNode().nodeValue);
		registry.register('self::text()', ({ traverse, node, key, query, additionalStuff }) => node().nodeValue);

		registry.register('self::*[not(parent::*)]', ({ traverse, node, key, query, ...additionalStuff }) => (
			<cool-action key={ key() }>
				<node>{node().nodeName}</node>
				<query>{ query('string(./span[1]/@skr)') }</query>
				<additional-stuff>{JSON.stringify(additionalStuff)}</additional-stuff>
				<traverse>{ traverse('./*[1]') }</traverse>
			</cool-action>
		));

		registry.register('self::span', ({ key, traverse }) => (
			<x-ok key={ key() }>{ traverse() }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});
});

xdescribe('Modes', () => {
	test('are usable to render out-of-order', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<fn>
						<span />
					</fn>
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>
				{ renderer.traverse() }
				{ renderer.traverse('./fn', 'my-mode') }
			</x>
		));

		registry.register('self::fn', renderer => (
			<x key={ renderer.key() }>once</x>
		));

		registry.mode('my-mode').register('self::fn', renderer => (
			<x key={ renderer.key() }>{ renderer.traverse() }</x>
		));

		registry.register('self::span', renderer => (
			<x-ok key={ renderer.key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('traverse in the same mode per default', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<fn>
						<p>
							<span />
						</p>
					</fn>
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>
				{ renderer.traverse('./fn', 'my-mode') }
			</x>
		));

		registry.register('self::p', renderer => (
			<x key={ renderer.key() }>
				{ renderer.traverse() }
			</x>
		));

		registry.mode('my-mode').register('self::fn', renderer => (
			<x key={ renderer.key() }>{ renderer.traverse() }</x>
		));

		registry.mode('my-mode').register('self::span', renderer => (
			<x-ok key={ renderer.key() } />
		));

		registry.register('self::span', renderer => (
			<x-notok key={ renderer.key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('fall back to the default mode for unregistered nodes', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<fn />
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>
				{ renderer.traverse('./fn', 'my-mode') }
			</x>
		));

		registry.register('self::fn', renderer => (
			<x-ok key={ renderer.key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('reset traversal mode to default', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<fn>
						<span>
							<span />
						</span>
					</fn>
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>
				{ renderer.traverse('./fn', 'my-mode') }
			</x>
		));

		registry.mode('my-mode').register('self::fn', (renderer, mode) => (
			<x key={ renderer.key() }>
				{ mode }
				{ renderer.traverse(null, null) }
			</x>
		));

		registry.mode('my-mode').register('self::span', renderer => (
			<x-notok key={ renderer.key() }>{ renderer.traverse() }</x-notok>
		));

		registry.register('self::span', renderer => (
			<x-ok key={ renderer.key() }>{ renderer.traverse() }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
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
		const registry = new Registry(),
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

		registry.register('self::div', renderer => (
			<x key={ renderer.key() } data-key={ renderer.key() }>
				{ renderer.traverse() }
				{ renderer.traverse('./fn', 'my-mode') }
			</x>
		));

		registry.register('self::fn', renderer => (
			<x key={ renderer.key() } data-key={ renderer.key() } />
		));

		const keys = collectKeys(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON());

		// If every key occurs exactly once, the amount of keys is equal to the amount of usages.
		expect(Object.keys(keys).length).toBe(Object.keys(keys).reduce((total, key) => total + keys[key], 0));
	});

	test('are stable', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<div />
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() } data-key={ renderer.key() }>
				{ renderer.traverse() }
			</x>
		));

		const keys1 = collectKeys(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()),
			keys2 = collectKeys(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON());

		expect(keys1).toEqual(keys2);
	});

	test('reuse existing identifiers', () => {
		const registry = new Registry(),
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

		registry.register('self::div', renderer => (
			<x key={ renderer.key() } data-key={ renderer.key() }>
				{ renderer.traverse() }
			</x>
		));

		const keys = collectKeys(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON());

		// Counts the keys starting with "OK". This test might fail while the requirements are still being met if
		// the formatting algorithm no longer puts the identifier at the beginning of the key.
		expect(Object.keys(keys).filter(key => key.indexOf('OK') === 0).length).toBe(4);
	});
});

xdescribe('Custom XPath functions', () => {
	it('can be registered', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<aside>
						<div/>
					</aside>
				</div>
			`;

		registry.registerXPathFunction('node-name-starts-with-vowel', ['node()'], 'xs:boolean', function (domFacade, node) {
			return 'eaouiy'.split('').includes(node.nodeName.charAt(0));
		});

		registry.register('self::element()', renderer => (
			<x key={ renderer.key() }>
				{ renderer.traverse() }
			</x>
		));

		registry.register('self::*[node-name-starts-with-vowel(.)]', renderer => (
			<x-ok key={ renderer.key() }>
				{ renderer.traverse() }
			</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	})

});

xdescribe('Namespaces', () => {
	it('can be targeted by namespace URI', () => {
		const registry = new Registry(),
			xml = `
				<div xmlns:mfns="namespace-1">
					<mfns:div />
					<div />
				</div>
			`;

		registry.register('self::*', renderer => renderer.traverse());

		registry.register('self::*[namespace-uri() = "namespace-1"]', renderer => (
			<x-ok key={ renderer.key() } />
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	})
});

xdescribe('Rendering callback', () => {
	it('receives name of the rendering mode', () => {
		const registry = new Registry(),
			xml = `
				<div />
			`;

		registry.register('self::*', (renderer, mode) => (
			<div key={ renderer.key() }>
				<default-mode-name>{ mode }</default-mode-name>
				{ renderer.traverse('.', 'some-mode') }
			</div>
		));
		registry.mode('some-mode').register('self::*', (renderer, mode) => (
			<some-mode-name key={ renderer.key() }>
				{ mode }
			</some-mode-name>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});

	test('receives the rest arguments passed to traverse() by the parent', () => {
		const registry = new Registry(),
			xml = `
				<div>
					<span>NOTOK</span>
					<span>NOTOK</span>
				</div>
			`;

		registry.register('self::div', renderer => (
			<x key={ renderer.key() }>{ renderer.traverse(null, null, { skeet: 'OK' }) }</x>
		));

		registry.register('self::span', (renderer, _mode, whatever) => (
			<x-ok key={ renderer.key() }>{ whatever.skeet }</x-ok>
		));

		expect(renderer.create(<RenderingContainer xml={ xml } registry={ registry } />).toJSON()).toMatchSnapshot();
	});
});
