import * as fontoxpath from 'fontoxpath';

const CONFIGURATION = Symbol('configuration');
const OPTIMIZE_CONFIGURATION = Symbol('optimize configuration');

const CHILD_NODE_TRAVERSAL_QUERY = './node()';

export default class Experience {
	constructor (...mergeExperiences) {
		this[CONFIGURATION] = mergeExperiences.reduce(
			(config, experience) => config.concat(experience[CONFIGURATION]),
			[]);

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

	render (node, renderData) {
		const contentComponent = this[CONFIGURATION]
			.find(contentComponent => fontoxpath.evaluateXPathToBoolean(
				contentComponent.xPathTest,
				node));
		const onRender = contentComponent && contentComponent.onRender;

		if (!onRender) {
			return null;
		}
		// the API object that is passed to whatever is rendered as a prop-like object
		return onRender({
			...renderData,

			node: () => node,

			key: () => Experience.getKeyForNode(node),

			// Convenience function
			query: (xPathQuery, fontoxpathOptions) => fontoxpath
				.evaluateXPath(xPathQuery, node, fontoxpathOptions),

			traverse: (configTraversalQuery, additionalRenderData) => {
				if (configTraversalQuery && typeof configTraversalQuery === 'object') {
					additionalRenderData = configTraversalQuery;
					configTraversalQuery = null;
				}

				return fontoxpath.evaluateXPathToNodes(configTraversalQuery || CHILD_NODE_TRAVERSAL_QUERY, node)
					.map(resultNode => this.render(resultNode, {
						...renderData,
						...additionalRenderData
					}));
			}
		});
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

		return 'xp_' + pieces.reverse().join('_');
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
