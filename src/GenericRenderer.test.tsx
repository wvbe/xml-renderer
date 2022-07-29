import { describe, expect, it, run } from 'https://deno.land/x/tincan@1.0.1/mod.ts';
import { renderToString } from 'https://esm.sh/react-dom@18.2.0/server';
import React, { createElement } from 'https://esm.sh/react@18.2.0';
import { parseXmlDocument } from 'https://esm.sh/slimdom@4.0.1';

import { GenericRenderer, ReactRenderer } from './GenericRenderer.ts';

type JsonmlOutput = string | { [name: string]: string } | Array<JsonmlOutput> | null;
describe('GenericRenderer', () => {
	it('make a JSONML renderer lol', () => {
		const node = parseXmlDocument(`<a><b><wat>werk</wat></b><b foo="bar"/></a>`);
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
			.render(node as unknown as Node, undefined);
		expect(output).toEqual(['#doc', ['a', {}, ['b', {}, ['wat', {}, 'werk']]]]);
	});
});

describe('ReactRenderer', () => {
	it('returns the expected result', () => {
		const node = parseXmlDocument(`<a><b /><b foo="bar"/></a>`);
		const output = new ReactRenderer(createElement)
			.add('self::document-node()', ({ traverse }) => <>{traverse()}</>)
			.add('self::a', ({ traverse }) => <a>{traverse('./*[@foo]')}</a>)
			.add('self::b', () => <em />)
			.add('self::b[@foo]', () => <b />)
			.render(node as unknown as Node, undefined);
		expect(output ? renderToString(output) : output).toEqual(`<a><b></b></a>`);
	});
});

describe('nodesFactory', () => {
	it('returns the expected result', () => {
		const node = parseXmlDocument(`<a/>`);
		const output = new ReactRenderer(createElement)
			.add('self::document-node()', ({ traverse }) => <>{traverse()}</>)
			.add('self::a', ({ traverse }) => <a>{traverse('<virtual-element />')}</a>)
			.add('self::virtual-element', () => <em />)
			.render(node as unknown as Node, undefined);
		expect(output ? renderToString(output) : output).toEqual(`<a><em></em></a>`);
	});
});

run();
