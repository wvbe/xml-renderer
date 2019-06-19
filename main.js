import * as fontoxpath from 'fontoxpath';

const CONFIGURATION = Symbol('configuration');
const OPTIMIZE_CONFIGURATION = Symbol('optimize configuration');

const DEFAULT_ID_ATTIBUTE = 'id';
const CHILD_NODE_TRAVERSAL_QUERY = './node()';

export function getKeyForNode(node, identifierAttribute = DEFAULT_ID_ATTIBUTE) {
	const pieces = [];

	let contextNode = node;
	while (contextNode && contextNode.parentNode) {
		// If any contextNode has an identifier, assume it to be unique and stop traversing up
		if (contextNode.nodeType === 1 && contextNode.hasAttribute(identifierAttribute)) {
			pieces.push(contextNode.getAttribute(identifierAttribute));
			break;
		}

		pieces.push(Array.prototype.indexOf.call(contextNode.parentNode.childNodes, contextNode));

		contextNode = contextNode.parentNode;
	}

	return 'xp_' + pieces.reverse().join('_');
}

export class MetadataSet {
	constructor(...sets) {
		this[CONFIGURATION] = sets.reduce((config, experience) => config.concat(experience[CONFIGURATION]), []);

		this[OPTIMIZE_CONFIGURATION]();
	}

	[OPTIMIZE_CONFIGURATION]() {
		this[CONFIGURATION] = this[CONFIGURATION].sort((a, b) => fontoxpath.compareSpecificity(b.test, a.test));
	}

	add(test, data) {
		this[CONFIGURATION].push({
			test,
			data
		});

		this[OPTIMIZE_CONFIGURATION]();
	}

	find(node) {
		const match = this[CONFIGURATION].find((contentComponent) =>
			fontoxpath.evaluateXPathToBoolean(contentComponent.test, node)
		);
		if (!match) {
			throw new Error('There was no match for the given node');
		}

		return match.data;
	}
}

export class RuleSet extends MetadataSet {
	render(node, renderData) {
		const onRender = this.find(node);
		if (!onRender) {
			return null;
		}

		return onRender({
			// @TODO: Deprecate
			...renderData,

			node,

			nodeId: getKeyForNode(node),

			query: (xPathQuery, fontoxpathOptions) => fontoxpath.evaluateXPath(xPathQuery, node, fontoxpathOptions),

			traverse: (configTraversalQuery, additionalRenderData) => {
				// renderData may occur as the first arguemtn
				// @TODO deprecate
				if (configTraversalQuery && typeof configTraversalQuery === 'object') {
					additionalRenderData = configTraversalQuery;
					configTraversalQuery = CHILD_NODE_TRAVERSAL_QUERY;
				}

				return fontoxpath
					.evaluateXPathToNodes(configTraversalQuery || CHILD_NODE_TRAVERSAL_QUERY, node)
					.map((resultNode) =>
						this.render(resultNode, {
							...renderData,
							...additionalRenderData
						})
					);
			}
		});
	}
}
