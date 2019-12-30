import React from 'react';
import reactTestRenderer from 'react-test-renderer';
import { evaluateXPathToFirstNode } from 'fontoxpath';
import { sync } from 'slimdom-sax-parser';

import MetadataRegistry, { getKeyForNode } from './main';

describe('getKeyForNode()', () => {
	test('for nodes without identifiers', () => {
		const dom = sync(`<a><b /><x><c /></x></a>`);
		expect(getKeyForNode(evaluateXPathToFirstNode('//a', dom))).toBe('xp_0');
		expect(getKeyForNode(evaluateXPathToFirstNode('//b', dom))).toBe('xp_0_0');
		expect(getKeyForNode(evaluateXPathToFirstNode('//c', dom))).toBe('xp_0_1_0');
	});

	test('for nodes with identifiers', () => {
		const dom = sync(`<x><a id="foo"><b /></a></x>`);
		expect(getKeyForNode(evaluateXPathToFirstNode('//a', dom))).toBe('xp_foo');
		expect(getKeyForNode(evaluateXPathToFirstNode('//b', dom))).toBe('xp_foo_0');
	});
});

describe('MetadataRegistry', () => {
	describe('#find', () => {
		test('returns metadata for the best matching rule', () => {
			const dom = sync(`<x><a /><a foo="bar"/></x>`);
			const xp = new MetadataRegistry();
			xp.add('self::a', 1);
			xp.add('self::a[@foo]', 2);

			expect(xp.find(evaluateXPathToFirstNode('//a', dom))).toBe(1);
			expect(xp.find(evaluateXPathToFirstNode('//a[@foo]', dom))).toBe(2);
		});

		test('returns undefined if no metadata found', () => {
			const dom = sync(`<x><a /><a foo="bar"/></x>`);
			const xp = new MetadataRegistry();

			expect(xp.find(evaluateXPathToFirstNode('//x', dom))).toBe(undefined);
		});
	});

	describe('#remove', () => {
		test('returns true if an item was removed', () => {
			const xp = new MetadataRegistry();
			xp.add('self::a', 1);
			expect(xp.remove('self::a', 1)).toBe(true);
		});

		test('returns false if an item could not be removed', () => {
			const xp = new MetadataRegistry();
			xp.add('self::a', 1);
			expect(xp.remove('self::x', 1)).toBe(false);
			expect(xp.remove('self::a', 2)).toBe(false);

			xp.remove('self::a', 1);
			expect(xp.remove('self::a', 1)).toBe(false);
		});
	});

	describe('#createRenderer', () => {
		test('returns the expected result', () => {
			const dom = sync(`<a><b /><b foo="bar"/></a>`);
			const xp = new MetadataRegistry();

			xp.add('self::document-node()', ({ traverse }) => [ '#doc', ...traverse() ]);
			xp.add('self::a', ({ traverse }) => [ 'rendered-a', ...traverse('./*[@foo]') ]);
			xp.add('self::b', () => [ 'rendered-b' ]);
			xp.add('self::b[@foo]', () => [ 'rendered-b-foo' ]);

			expect(xp.createRenderer((fn, props) => (fn ? fn(props) : null))(dom)).toEqual([
				'#doc',
				[ 'rendered-a', [ 'rendered-b-foo' ] ]
			]);
		});
	});

	describe('#createReactRenderer', () => {
		test('returns the expected result', () => {
			const dom = sync(`<a><b /><b foo="bar"/></a>`);
			const xp = new MetadataRegistry();

			xp.add('self::document-node()', ({ traverse }) => traverse());
			xp.add('self::a', ({ traverse }) => <a>{traverse('./*[@foo]')}</a>);
			xp.add('self::b', () => <x />);
			xp.add('self::b[@foo]', () => <b />);

			expect(reactTestRenderer.create(xp.createReactRenderer(React)(dom))).toMatchInlineSnapshot(
				'\n<a>\n  <b />\n</a>\n'
			);
		});
	});
});
