import { createElement as CreateElement, ElementType, ReactElement } from 'react';
import { traverseRenderer, XmlRendererProps } from './GenericRenderer';
import { getKeyForNode } from './getKeyForNode';
import { Registry } from './Registry';

/**
 * The output of a ReactRenderer rule should be a React element (eg. `<p>` or `<P>`), a string, or `null`.
 */
export type XmlRendererReactOutput = ReactElement<any, any> | string | null;

/**
 * The props that are passed to every component rendered by ReactRenderer. These include the `node` and `traverse`
 * props, so that you can query and travel further into the render loop, but also `key` for your convenience, because
 * most output is actually an array of results mapped from XML nodes.
 */
export type XmlRendererReactProps<AdditionalPropsI extends {} = {}> = XmlRendererProps<
	XmlRendererReactOutput
> &
	AdditionalPropsI & { key: string };

export type XmlRendererReactValueI<AdditionalPropsI> = ElementType<
	XmlRendererReactProps<AdditionalPropsI>
>;
// | ((props: XmlRendererReactProps<AdditionalPropsI>) => XmlRendererReactOutput);

/**
 *
 * This is the React-specific sibling of {@link GenericRenderer}.
 */
export class ReactRenderer<AdditionalPropsI extends {} = {}> extends Registry<
	XmlRendererReactValueI<AdditionalPropsI>
> {
	public render(
		createElement: typeof CreateElement,
		node: Node,
		additionalProps?: AdditionalPropsI
	): XmlRendererReactOutput {
		return traverseRenderer(
			this,
			(Component, props) =>
				Component
					? createElement(
							Component,
							Object.assign(props, additionalProps, {
								key: getKeyForNode(props.node)
							})
					  )
					: null,
			node
		);
	}
}
