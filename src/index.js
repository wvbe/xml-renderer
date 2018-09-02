import * as fontoxpath from 'fontoxpath';

const GET_RENDERING_CB = Symbol('rendering callback');
const CONFIGURATION = Symbol('configuration');
const OPTIMIZE_CONFIGURATION = Symbol('optimize configuration');

const CHILD_NODE_TRAVERSAL_QUERY = './node()';

export default class Experience {
	constructor (...mergeExperiences) {
		this[CONFIGURATION] = mergeExperiences.reduce((config, experience) => config.concat(experience[CONFIGURATION]), []);

		this[OPTIMIZE_CONFIGURATION]();
	}
	[OPTIMIZE_CONFIGURATION] () {
		this[CONFIGURATION] = this[CONFIGURATION]
			.sort((a, b) => fontoxpath.compareSpecificity(b.xPathTest, a.xPathTest));
	}
	/**
	 * Register a rendering callback for an XPath test. Any node matching the test (and not a more specific one)
	 * will be transformed using onRender.
	 * @param xPathTest
	 * @param {Mode~onRender} onRender
	 */
	register (xPathTest, onRender) {
		this[CONFIGURATION].push({
			xPathTest,
			onRender
		});

		this[OPTIMIZE_CONFIGURATION]();
	}

	[GET_RENDERING_CB] (node) {
		const contentComponent = this[CONFIGURATION]
			.find(contentComponent => fontoxpath.evaluateXPathToBoolean(
				contentComponent.xPathTest,
				node));
		return contentComponent && contentComponent.onRender;
	}

	render (node, traversalQuery, additionalProps) {
		if (typeof traversalQuery === 'object') {
			if (!additionalProps) {
				additionalProps = traversalQuery;
			}
			traversalQuery = CHILD_NODE_TRAVERSAL_QUERY
		}

		return fontoxpath.evaluateXPathToNodes(traversalQuery || CHILD_NODE_TRAVERSAL_QUERY, node)
			.map(resultNode => {
				const cb = this[GET_RENDERING_CB](resultNode);
				return cb ?
					// the API object that is passed to whatever is rendered as a prop-like object
					cb({
						...additionalProps,

						node: () => resultNode,

						key: () => Experience.getKeyForNode(resultNode),

						// Convenience function
						query: (xPathQuery, fontoxpathOptions) => fontoxpath
							.evaluateXPath(xPathQuery, resultNode, fontoxpathOptions),

						traverse: (configTraversalQuery, configAdditionalProps) => {
							if (typeof configTraversalQuery === 'object') {
								configAdditionalProps = configTraversalQuery;
							}
							return this.render(
								resultNode,
								configTraversalQuery,
								{ ...(configAdditionalProps || additionalProps) });
						}
					}) :
					null;
			})
	}

	static getKeyForNode (targetNode) {
		const pieces = [];

		let node = targetNode;

		while (node && node.parentNode) {
			// If any node has an identifier, assume it to be unique and stop traversing up
			if (node.nodeType === 1 && node.hasAttribute('id')) {
				pieces.push(node.getAttribute('id'));
				break;
			}

			pieces.push(Array.prototype.indexOf.call(node.parentNode.childNodes, node));

			node = node.parentNode
		}

		return pieces.reverse().join('/');
	}

	/**
	 * The callback that produces a rendering of the matching node. The callback is passed an instance of
	 * {@link Renderer} for that node as first and only argument.
	 * @callback Registry~onRender
	 * @param {Object} props
	 * @param {function(query: XPathQuery, ...traversalData): Array.<*>} props.traverse
	 * @param {function(): Node} props.node
	 * @param {function(): Node} props.key
	 * @param {function(query: XPathQuery): *} props.query
	 * @returns {*}
	 */
}
