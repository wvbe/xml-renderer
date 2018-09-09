import * as fontoxpath from 'fontoxpath';

const CONFIGURATION = Symbol('configuration');
const OPTIMIZE_CONFIGURATION = Symbol('optimize configuration');

const CHILD_NODE_TRAVERSAL_QUERY = './node()';

/**
 * An instance of Experience is essentially a set of rendering callbacks each attached to an XPath test, and provides
 * the APIs to add new rendering rules and of course render an output.
 */
export default class Experience {
	/**
	 * @param {Experience}  [...mergeExperiences]  Any amount of other Experience instances that should also be part of
	 *                                             this rule set. Allows you to reuse configurations across different
	 *                                             rendering setups.
	 */
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
	 *
	 * @param {XPathTest}            xPathTest
	 * @param {Experience~onRender}  onRender
	 */
	register (xPathTest, onRender) {
		this[CONFIGURATION].push({
			xPathTest,
			onRender
		});

		this[OPTIMIZE_CONFIGURATION]();
	}

	/**
	 * Returns the rendering result for the given node and any node that its rendering rule traverses in to. Also allows
	 * you to pass extra contextual information that ends up in a rendering callback.
	 *
	 * @param {Node}    node        The XML node to start rendering from
	 * @param {object}  renderData  An object of contextual information that is passed to every rendering callback. Any
	 *                              `key`, `node`, `traverse` or `query` property will be overwritten since those are
	 *                              part of xml-renderer's API.
	 */
	render (node, renderData) {
		const contentComponent = this[CONFIGURATION]
			.find(contentComponent => fontoxpath.evaluateXPathToBoolean(
				contentComponent.xPathTest,
				node));
		const onRender = contentComponent && contentComponent.onRender;

		if (!onRender) {
			return null;
		}

		return onRender({
			...renderData,

			node: () => node,

			key: () => Experience.getKeyForNode(node),

			query: (xPathQuery, fontoxpathOptions) => fontoxpath
				.evaluateXPath(xPathQuery, node, fontoxpathOptions),

			traverse: (configTraversalQuery, additionalRenderData) => {
				if (configTraversalQuery && typeof configTraversalQuery === 'object') {
					additionalRenderData = configTraversalQuery;
					configTraversalQuery = CHILD_NODE_TRAVERSAL_QUERY;
				}

				return fontoxpath.evaluateXPathToNodes(configTraversalQuery || CHILD_NODE_TRAVERSAL_QUERY, node)
					.map(resultNode => this.render(resultNode, {
						...renderData,
						...additionalRenderData
					}));
			}
		});
	}

	/**
	 * Convenience method to get a unique, stable identifier for the given XML node. Is useful to pass to React as the
	 * key prop, or to use as a page anchor.
	 *
	 * @static
	 * @param {Node}  node
	 * @returns {string}
	 */
	static getKeyForNode (node) {
		const pieces = [];

		let contextNode = node;
		while (contextNode && contextNode.parentNode) {
			// If any contextNode has an identifier, assume it to be unique and stop traversing up
			if (contextNode.nodeType === 1 && contextNode.hasAttribute('id')) {
				pieces.push(contextNode.getAttribute('id'));
				break;
			}

			pieces.push(Array.prototype.indexOf.call(contextNode.parentNode.childNodes, contextNode));

			contextNode = contextNode.parentNode
		}

		return 'xp_' + pieces.reverse().join('_');
	}

	/**
	 * The callback that produces a rendering of the matching node. The callback is passed an instance of
	 * {@link Experience} for that node as first and only argument.
	 * @callback Experience~onRender
	 * @param {Object} props
	 * @param {function(query: XPathQuery, renderData: object): Array.<*>} props.traverse
	 * @param {function(): Node} props.node
	 * @param {function(): string} props.key
	 * @param {function(query: XPathQuery): *} props.query
	 * @param {*}
	 * @returns {*}
	 */
}
