import { sync } from 'slimdom-sax-parser'
import Experience from '../src/Experience';

const basicExperience = new Experience();
basicExperience.register('self::node()', ({ traverse }) => traverse());
basicExperience.register('self::text()', ({ node }) => node().nodeValue);

// Turns the keys in a node hierarchy into a key-->total mapping
function collectKeys (nodes, stats = {}) {
	return nodes.reduce((stats, node) => {
		if (node.key !== undefined) {
			stats[node.key] = (stats[node.key] || 0) + 1;
		}

		return node.children ? collectKeys(node.children, stats) : stats;
	}, stats);
}

describe('key()', () => {
	test('is always unique', () => {
		const experience = new Experience(basicExperience);
		const xml = `
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

		experience.register('self::element()', ({ key, traverse, node }) => ({
			key: key(),
			nodeName: node().nodeName,
			// If passing key down the traversal change was not ignored, every element traversed would yield the same
			// key value and this test would fail.
			children: traverse({ key })
		}));

		const keys = collectKeys(experience.render(sync(xml)));

		// If every key occurs exactly once, the amount of keys is equal to the amount of usages.
		expect(Object.keys(keys).length).toBe(Object.keys(keys).reduce((total, key) => total + keys[key], 0));
	});

	test('is stable', () => {
		const experience = new Experience(basicExperience);
		const xml = `
			<div>
				<div />
			</div>
		`;

		experience.register('self::element()', ({ key, traverse, node }) => ({
			key: key(),
			nodeName: node().nodeName,
			children: traverse()
		}));

		const keys1 = collectKeys(experience.render(sync(xml))),
			keys2 = collectKeys(experience.render(sync(xml)));

		expect(keys1).toEqual(keys2);
	});

	test('reuses existing @id when found', () => {
		const experience = new Experience(basicExperience);
		const xml = `
			<div>
				<div id="OK">
					<div />
					<div>
						<div />
					</div>
				</div>
			</div>
		`;

		experience.register('self::element()', ({ key, traverse, node }) => ({
			key: key(),
			nodeName: node().nodeName,
			children: traverse()
		}));

		const keys = collectKeys(experience.render(sync(xml)));

		// Counts the keys starting with "OK". This test might fail while the requirements are still being met if
		// the formatting algorithm no longer puts the identifier at the beginning of the key.
		expect(Object.keys(keys).filter(key => key.indexOf('OK') === 0).length).toBe(4);
	});
});
