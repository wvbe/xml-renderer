import { evaluateXPathToNodes } from 'fontoxpath';

import { Registry } from './Registry';

/**
 * A function that lets you traverse rendering down into child nodes (default) or another selection of nodes. By default
 * it will simply traverse into the child nodes of the context node. By passing an XPath expression to `traverse` you
 * can change that to select any related node.
 */
export type XmlRendererTraverse<OutpuI> = (query?: string) => OutpuI[];

/**
 * The renderer context information, in React passed as props, given to every rule match. The two props that are always
 * passed are `node` (the XML node for which the rule is being invoked) and `traverse` (a function to continue rendering
 * the node's children or related nodes).
 *
 * See also {@link XmlRendererTraverse}.
 */
export type XmlRendererProps<OutputI> = {
	node: Node;
	traverse: XmlRendererTraverse<OutputI>;
};

/**
 * Additional arguments that can be passed down to a renderer callbacks when calling the renderer.
 * @todo deprecate
 */
export type XmlRendererRestArguments = any[];

/**
 * A compatibility layer between the renderer and React or another templating engine. Is given the metadata registered
 * to the node that being traversed (as well as the node itself and a means to continue traversal), so that this
 * function may use that metadata (eg. a component) to output something using React or other.
 *
 * For the {@link ReactRenderer} this factory is already provided, where it is essentially a wrapper around
 * `React.createElement`.
 */
export type XmlRendererFactory<ValueI, OutputI> = (
	// For ReactRenderer, `value` means the component associated to a context node
	value: ValueI | undefined,

	// Contains the context node, and a function to travere the renderer
	props: XmlRendererProps<OutputI>,

	// @todo deprecate
	...rest: XmlRendererRestArguments
) => OutputI;

export function traverseRenderer<ValueI, OutputI>(
	registry: Registry<ValueI>,
	factory: XmlRendererFactory<ValueI, OutputI>,
	node: Node,
	...rest: XmlRendererRestArguments
): OutputI {
	const value = registry.find(node);
	const props = {
		node,
		traverse: (query = './node()') =>
			evaluateXPathToNodes(query, node).map(n =>
				traverseRenderer<ValueI, OutputI>(registry, factory, n as Node, ...rest)
			)
	};

	return factory(value, props, ...rest);
}

/**
 * A renderer that makes no presumptions on the type of output you want. Using the `factory` argument of {@link
 * GenericRenderer.render} it can be made to output anything, such as a long concatenated string or maybe JSONML.
 *
 * This is the more generic sibling of {@link ReactRenderer}.
 */
export class GenericRenderer<ValueI, OutputI> extends Registry<ValueI> {
	public render(
		factory: XmlRendererFactory<ValueI, OutputI>,
		node: Node,
		...rest: XmlRendererRestArguments
	): OutputI {
		return traverseRenderer<ValueI, OutputI>(this, factory, node, ...rest);
	}
}
