import { evaluateXPathToFirstNode } from 'fontoxpath';
import { sync } from 'slimdom-sax-parser';

import { Registry } from './Registry';

function getNode(nodeOrNull: any) {
	return nodeOrNull as any;
}

describe('Registry', () => {
	describe('#find', () => {
		test('returns metadata for the best matching rule', () => {
			const dom = sync(`<x><a /><a foo="bar"/></x>`);
			const xp = new Registry();
			xp.add('self::a', 1);
			xp.add('self::a[@foo]', 2);

			expect(xp.find(getNode(evaluateXPathToFirstNode('//a', dom)))).toBe(1);
			expect(xp.find(getNode(evaluateXPathToFirstNode('//a[@foo]', dom)))).toBe(2);
		});

		test('returns undefined if no metadata found', () => {
			const dom = sync(`<x><a /><a foo="bar"/></x>`);
			const xp = new Registry();

			expect(xp.find(getNode(evaluateXPathToFirstNode('//x', dom)))).toBe(undefined);
		});
	});

	describe('#remove', () => {
		test('returns true if an item was removed', () => {
			const xp = new Registry();
			xp.add('self::a', 1);
			expect(xp.remove('self::a', 1)).toBe(true);
		});

		test('returns false if an item could not be removed', () => {
			const xp = new Registry();
			xp.add('self::a', 1);
			expect(xp.remove('self::x', 1)).toBe(false);
			expect(xp.remove('self::a', 2)).toBe(false);

			xp.remove('self::a', 1);
			expect(xp.remove('self::a', 1)).toBe(false);
		});
	});
});
