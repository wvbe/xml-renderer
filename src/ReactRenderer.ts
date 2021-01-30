import { ElementType, ReactElement, createElement as CreateElement } from 'react';

import { getKeyForNode } from './getKeyForNode';
import { Registry } from './Registry';
import { traverseRenderer, XmlRendererProps } from './GenericRenderer';

/**
 * The output of a ReactRenderer rule should be a React element (eg. `<p>` or `<P>`), a string, or `null`.
 */
export type XmlRendererReactOutput = ReactElement<any, any> | string | null;

/**
 * The props that are passed to every component rendered by ReactRenderer. These include the `node` and `traverse`
 * props, so that you can query and travel further into the render loop, but also `key` for your convenience, because
 * most output is actually an array of results mapped from XML nodes.
 */
export type XmlRendererReactProps = XmlRendererProps<XmlRendererReactOutput> & { key: string };

/**
 * The thing that you give to {@link ReactRenderer.add} should be a React component class or function component. It is
 * given two props by xml-renderer automatically, `node` and `traverse`; see also {@link XmlRendererReactProps}.
 */
export type XmlRendererReactInput = ElementType<XmlRendererReactProps>;

/**
 *
 * This is the React-specific sibling of {@link GenericRenderer}.
 */
export class ReactRenderer<P extends {} = {}> extends Registry<XmlRendererReactInput> {
	public render(
		createElement: typeof CreateElement,
		node: Node,
		additionalProps?: P
	): XmlRendererReactOutput {
		return traverseRenderer<XmlRendererReactInput, XmlRendererReactOutput>(
			this,
			(
				Component: XmlRendererReactInput | undefined,
				props: XmlRendererProps<XmlRendererReactOutput>
			) =>
				Component
					? createElement(
							Component,
							Object.assign(props, additionalProps, {
								key: getKeyForNode(props.node)
							})
					  )
					: // Returning null appears to conflict with what this factory function is supposed to do; return
					  // XmlRendererReactOutput or null if no component was found.
					  //
					  // Returning null is not allowed for ElementType
					  null,
			node
		);
	}
}
