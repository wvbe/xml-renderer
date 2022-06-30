import React, { createElement, Fragment } from 'https://esm.sh/react@18.2.0';
import { renderToString } from 'https://esm.sh/react-dom@18.2.0/server';
import { describe, expect, it, run } from 'https://deno.land/x/tincan@1.0.1/mod.ts';
import { sync } from 'https://raw.githubusercontent.com/wvbe/slimdom-sax-parser/deno/src/index.ts';

import { GenericRenderer, ReactRenderer } from './GenericRenderer.ts';

type JsonmlOutput = string | { [name: string]: string } | Array<JsonmlOutput> | null;
describe('GenericRenderer', () => {
	it('make a JSONML renderer lol', () => {
		const node = sync(`<a><b><wat>werk</wat></b><b foo="bar"/></a>`);
		const output = new GenericRenderer<JsonmlOutput>()
			.add('self::document-node()', ({ traverse }) => ['#doc', ...traverse()])
			.add('self::text()', ({ node }) => node.nodeValue)
			.add('self::element()', ({ traverse, node }) => [
				node.nodeName,
				Array.from((node as Element).attributes).reduce(
					(obj, attr: Attr) => ({
						...obj,
						[attr.name]: attr.value,
					}),
					{},
				),
				...traverse(),
			])
			.add('self::*[@foo]', () => null)
			.render(node as unknown as Node);
		expect(output).toEqual(['#doc', ['a', {}, ['b', {}, ['wat', {}, 'werk']], null]]);
	});
});

describe('ReactRenderer', () => {
	it('returns the expected result', () => {
		const node = sync(`<a><b /><b foo="bar"/></a>`);
		const output = new ReactRenderer(createElement)
			.add('self::document-node()', ({ traverse }) => <>{traverse()}</>)
			.add('self::a', ({ traverse }) => <a>{traverse('./*[@foo]')}</a>)
			.add('self::b', () => <em />)
			.add('self::b[@foo]', () => <b />)
			.render(node as unknown as Node);
		expect(output ? renderToString(output) : output).toEqual(`<a><b></b></a>`);
	});
});

run();
