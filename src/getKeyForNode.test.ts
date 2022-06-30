import { describe, expect, it, run } from 'https://deno.land/x/tincan@1.0.1/mod.ts';

import { evaluateXPathToFirstNode } from 'https://esm.sh/fontoxpath@3.26.0';
import { sync } from 'https://raw.githubusercontent.com/wvbe/slimdom-sax-parser/deno/src/index.ts';

import { getKeyForNode } from './getKeyForNode.ts';

describe('getKeyForNode()', () => {
	it('for nodes without identifiers', () => {
		const dom = sync(`<a><b /><x><c /></x></a>`);
		expect(getKeyForNode(evaluateXPathToFirstNode('//a', dom) as Node)).toBe('node-key--0');
		expect(getKeyForNode(evaluateXPathToFirstNode('//b', dom) as Node)).toBe('node-key--0-0');
		expect(getKeyForNode(evaluateXPathToFirstNode('//c', dom) as Node)).toBe('node-key--0-1-0');
	});

	it('for nodes with identifiers', () => {
		const dom = sync(`<x><a id="foo"><b /></a></x>`);
		expect(getKeyForNode(evaluateXPathToFirstNode('//a', dom) as Node)).toBe('node-key--foo');
		expect(getKeyForNode(evaluateXPathToFirstNode('//b', dom) as Node)).toBe('node-key--foo-0');
	});
});

run();
