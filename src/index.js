import * as fontoxpath from 'fontoxpath';

const REGISTRY = Symbol('registry');
const NODE = Symbol('node');
const KEY = Symbol('key');
const MODE = Symbol('mode');

const GET_RENDERING_CB = Symbol('rendering callback');
const DEFAULT_MODE = Symbol('default mode');

function getUniqueKeyForNode (targetNode) {
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
 * The rendering API for a specific XML node.
 */
class Renderer {
	constructor (registry, mode, node) {
		this[REGISTRY] = registry;
		this[MODE] = mode;
		this[NODE] = node;
	}

	/**
	 * Returns the XML node for which this renderer was instantiated.
	 * @returns {Node}
	 */
	getNode () {
		return this[NODE];
	}

	/**
	 * Returns a string which is uniquely identifying for the renderer node amongst its siblings. Intended to be used
	 * as React's key property.
	 * @returns {string}
	 */
	key () {
		if (!this[KEY]) {
			this[KEY] = getUniqueKeyForNode(this[NODE]) + (this[MODE] === DEFAULT_MODE ? '' : ':' + this[MODE]);
		}

		return this[KEY];
	}

	/**
	 * Returns the rendering of the specific XML node this Renderer is for.
	 * @returns {*}
	 */
	render () {
		const registeredContent = this[REGISTRY][GET_RENDERING_CB](this[NODE], this[MODE]);

		return registeredContent ?
			registeredContent(this) :
			null;
	}

	/**
	 * Returns an array of renderings for a collection of XML nodes, queried relative from the node of this Renderer.
	 * @param {string} xPathQuery
	 * @returns {Array.<*>}
	 */
	traverse (xPathQuery, mode = this[MODE]) {
		if (!xPathQuery) {
			xPathQuery = './node()';
		}

		// If mode is set to falsy (but not undefined), reset to default mode
		if (!mode) {
			mode = DEFAULT_MODE;
		}

		return fontoxpath.evaluateXPathToNodes(xPathQuery, this[NODE])
			.map(childNode => new Renderer(this[REGISTRY], mode, childNode).render());
	}
}

class RendererIndex {
	constructor () {
		this.contentComponents = [];
	}

	register (xPathTest, onRender) {
		this.contentComponents.push({
			xPathTest,
			onRender
		});
	}

	get (node) {
		const contentComponent = this.contentComponents
			.sort((a, b) => fontoxpath.compareSpecificity(b.xPathTest, a.xPathTest))
			.find(contentComponent => fontoxpath.evaluateXPathToBoolean(
				contentComponent.xPathTest,
				node));

		return contentComponent && contentComponent.onRender;
	}
}

/**
 * Holds the list of xPath tests per rendering callback, and gives you access to the top-level Renderer for a given
 * DOM.
 */
const MODES = Symbol('modes');
class Registry {
	constructor () {
		this[MODES] = {
			[DEFAULT_MODE]: new RendererIndex()
		};
	}

	/**
	 * Register a render callback for an XPath test. The callback will be used for any node that matches the XPath and
	 * not a more specific match.
	 * @param {string} xPathTest - For example, `self::section`
	 * @param {Registry~onRender} onRender
	 */
	register (xPathTest, onRender) {
		return this.mode().register(xPathTest, onRender);
	}

	/**
	 * The callback that produces a rendering of the matching node. The callback is passed an instance of
	 * {@link Renderer} for that node as first and only argument.
	 * @callback Registry~onRender
	 * @param {Renderer} renderer
	 * @returns {*}
	 */

	/**
	 * Gives you the Renderer for the top-level node of a given DOM.
	 * @param node
	 * @returns {Renderer}
	 */
	node (node, mode = DEFAULT_MODE) {
		return new Renderer(this, mode, node);
	}

	mode (name = DEFAULT_MODE) {
		if (!this[MODES][name]) {
			this[MODES][name] = new RendererIndex();
		}

		return this[MODES][name];
	}

	[GET_RENDERING_CB] (node, mode) {
		if (!this[MODES][mode]) {
			mode = DEFAULT_MODE;
		}

		const renderingCb = this[MODES][mode].get(node);

		if (mode !== DEFAULT_MODE && !renderingCb) {
			return this[GET_RENDERING_CB](node, DEFAULT_MODE);
		}

		return renderingCb;
	}
}

export default Registry;
