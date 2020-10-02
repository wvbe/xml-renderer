import { sync } from 'slimdom-sax-parser';

import { GenericRenderer, XmlRendererFactory, XmlRendererProps } from './GenericRenderer';

describe('GenericRenderer', () => {
	type JsonmlInput = (props: XmlRendererProps<JsonmlOutput>) => JsonmlOutput;
	type JsonmlOutput = string | { [name: string]: string } | Array<JsonmlOutput> | null;
	type JsonmlFactory = XmlRendererFactory<JsonmlInput, JsonmlOutput>;

	test('make a JSONML renderer lol', () => {
		const node = sync(`<a><b><wat>werk</wat></b><b foo="bar"/></a>`);
		const registry = new GenericRenderer<JsonmlInput, JsonmlOutput>();

		registry.add('self::document-node()', ({ traverse }) => ['#doc', ...traverse()]);
		registry.add('self::text()', ({ node }) => node.nodeValue);
		registry.add('self::element()', ({ traverse, node }) => [
			node.nodeName,
			Array.from((node as Element).attributes).reduce(
				(obj, attr: Attr) => ({
					...obj,
					[attr.name]: attr.value
				}),
				{}
			),
			...traverse()
		]);
		registry.add('self::*[@foo]', () => null);

		const factory: JsonmlFactory = (fn, props) => (fn ? fn(props) : null);
		expect(registry.render(factory, (node as unknown) as Node)).toEqual([
			'#doc',
			['a', {}, ['b', {}, ['wat', {}, 'werk']], null]
		]);
	});
});
