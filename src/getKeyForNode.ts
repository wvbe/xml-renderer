/**
 * Utility function to generate a unique key for a given node. Is automatically used as the `key` prop in case you're
 * using {@link Registry.createReactRenderer}, but you may find it useful in other scenarios too.
 */
export function getKeyForNode(
	node: Node & {
		hasAttribute?: (name: string) => boolean;
		getAttribute?: (name: string) => string;
	},
	identifierAttribute = 'id',
) {
	const pieces = [];

	let contextNode = node;
	while (contextNode && contextNode.parentNode) {
		// If any contextNode has an identifier, assume it to be unique and stop traversing up
		if (
			identifierAttribute &&
			contextNode.nodeType === 1 &&
			contextNode.hasAttribute &&
			contextNode.getAttribute &&
			contextNode.hasAttribute(identifierAttribute)
		) {
			pieces.push(contextNode.getAttribute(identifierAttribute));
			break;
		}

		pieces.push(Array.prototype.indexOf.call(contextNode.parentNode.childNodes, contextNode));

		contextNode = contextNode.parentNode;
	}

	return 'node-key--' + pieces.reverse().join('-');
}
