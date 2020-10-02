import { evaluateXPathToFirstNode } from 'fontoxpath';
import { sync } from 'slimdom-sax-parser';

import { getKeyForNode } from './getKeyForNode';

describe('getKeyForNode()', () => {
	test('for nodes without identifiers', () => {
		const dom = sync(`<a><b /><x><c /></x></a>`);
		expect(getKeyForNode(evaluateXPathToFirstNode('//a', dom) as Node)).toBe('node-key--0');
		expect(getKeyForNode(evaluateXPathToFirstNode('//b', dom) as Node)).toBe('node-key--0-0');
		expect(getKeyForNode(evaluateXPathToFirstNode('//c', dom) as Node)).toBe('node-key--0-1-0');
	});

	test('for nodes with identifiers', () => {
		const dom = sync(`<x><a id="foo"><b /></a></x>`);
		expect(getKeyForNode(evaluateXPathToFirstNode('//a', dom) as Node)).toBe('node-key--foo');
		expect(getKeyForNode(evaluateXPathToFirstNode('//b', dom) as Node)).toBe('node-key--foo-0');
	});
});
