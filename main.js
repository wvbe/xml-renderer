import * as fontoxpath from 'fontoxpath';

const CONFIGURATION = Symbol('configuration');
const OPTIMIZE_CONFIGURATION = Symbol('optimize configuration');

const DEFAULT_ID_ATTIBUTE = 'id';
const CHILD_NODE_TRAVERSAL_QUERY = './node()';

/**
 * A class that you instantiate to contain "metadata" associated with certain XML nodes. The metadata could be anything,
 * but in context of being an "xml renderer" you'll probably want to use it for templates or React components. This data
 * is associated with XML nodes via an XPath test. For any given node, the metadata associated with the closest matching
 * test is returned.
 *
 * @param {MetadataRegistry} [...sets] Zero or many other MetadataRegistry instances that should be merged into
 *     a new one. Make sure the contained metadata is of the same type, or you'll run in to trouble later!
 */
export default class MetadataRegistry {
	constructor(...sets) {
		this[CONFIGURATION] = sets.reduce(
			(config, experience) => config.concat(experience[CONFIGURATION]),
			[]
		);

		this[OPTIMIZE_CONFIGURATION]();
	}

	[OPTIMIZE_CONFIGURATION]() {
		this[CONFIGURATION] = this[CONFIGURATION].sort((a, b) =>
			fontoxpath.compareSpecificity(b.test, a.test)
		);
	}

	/**
	 * Add a node/metadata associationto the registry.
	 *
	 * @param    {string}    test    An XPath test that returns TRUE or FALSE given a node
	 * @param    {*}         data    The metadata associated with nodes matching the test
	 */
	add(test, data) {
		if (data === undefined) {
			return;
		}
		this[CONFIGURATION].push({
			test,
			data
		});

		this[OPTIMIZE_CONFIGURATION]();
	}

	/**
	 * Remove a node/metadata association from the registry. This is the opposite of the {@link Metadata.add} method.
	 *
	 * @param     {string}    test     An XPath test that returns TRUE or FALSE given a node
	 * @param     {*}         data     The metadata associated with nodes matching the test
	 * @return    {boolean}            `true` if the metadata was removed, `false` otherwise.
	 */
	remove(test, data) {
		const index = this[CONFIGURATION].findIndex(c => c.test === test && c.data === data);
		if (index < 0) {
			return false;
		}

		return this[CONFIGURATION].splice(index, 1).length === 1;
	}

	/**
	 * Retrieve the metadata that was associated with this node before. Gives you only the metadata of the test/data
	 * pair that has the best match. For example `<b>` could match tests self::b` as well as `self::b[not(child::*)]`,
	 * but the latter is more specific so it wins.
	 *
	 * @param      {Node}    node    The XML node to retrieve associated metadata for.
	 * @return     {*}               The metadata associated with this node
	 */
	find(node) {
		const match = this[CONFIGURATION].find(contentComponent =>
			fontoxpath.evaluateXPathToBoolean(contentComponent.test, node)
		);
		if (!match) {
			return undefined;
		}

		return match.data;
	}

	/**
	 * Creates a function to transform a DOM structure using the `factory` argument function and the test/data pairs
	 * known to this registry instance.
	 *
	 * @param     {function (data: *, { node: Node, traverse: function(query: string): Array.<*>}): *}    factory    The
	 *     visitor function
	 * @return    {function(node: Node): *}    A function to start rendering with
	 */
	createRenderer(factory) {
		const metadataRegistry = this;
		return function transform(node) {
			const data = metadataRegistry.find(node);
			const traverse = (query = CHILD_NODE_TRAVERSAL_QUERY) =>
				fontoxpath.evaluateXPathToNodes(query, node).map(transform);

			return factory(data, {
				node,
				traverse
			});
		};
	}

	/**
	 * Creates a function to transform a DOM structure using React, which you have to pass as the only argument so that
	 * `xml-renderer` itself does not have to depend on it.
	 *
	 * @param     {React}                                 React    The React class.
	 * @return    {function(node: Node): ReactElement}             A function to start rendering with
	 */
	createReactRenderer(React) {
		return this.createRenderer((Component, props) => {
			if (!Component) {
				return null;
			}

			props.key = getKeyForNode(props.node);
			return React.createElement(Component, props);
		});
	}
}

/**
 * Utility function to generate a unique key for a given node. Is automatically used as the `key` prop in case you're
 * using {MetadataRegistry.createReactRenderer}, but you may find it useful in other scenarios too.
 *
 * @param     {Node}      node                     The XML node
 * @param     {string}    [identifierAttribute]    The name of a uniquely identifying attribute. Defaults to `"id"`, set
 *     to `null` to disable using uniquely identifying attributes in the generated key.
 * @return    {string}
 */
export function getKeyForNode(node, identifierAttribute = DEFAULT_ID_ATTIBUTE) {
	const pieces = [];

	let contextNode = node;
	while (contextNode && contextNode.parentNode) {
		// If any contextNode has an identifier, assume it to be unique and stop traversing up
		if (
			identifierAttribute &&
			contextNode.nodeType === 1 &&
			contextNode.hasAttribute(identifierAttribute)
		) {
			pieces.push(contextNode.getAttribute(identifierAttribute));
			break;
		}

		pieces.push(Array.prototype.indexOf.call(contextNode.parentNode.childNodes, contextNode));

		contextNode = contextNode.parentNode;
	}

	return 'xp_' + pieces.reverse().join('_');
}