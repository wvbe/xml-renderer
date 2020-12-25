**[xml-renderer](README.md)**

> Globals

# xml-renderer

## Index

### Classes

* [GenericRenderer](classes/genericrenderer.md)
* [ReactRenderer](classes/reactrenderer.md)
* [Registry](classes/registry.md)

### Type aliases

* [XmlRendererFactory](README.md#xmlrendererfactory)
* [XmlRendererProps](README.md#xmlrendererprops)
* [XmlRendererReactInput](README.md#xmlrendererreactinput)
* [XmlRendererReactOutput](README.md#xmlrendererreactoutput)
* [XmlRendererReactProps](README.md#xmlrendererreactprops)
* [XmlRendererRestArguments](README.md#xmlrendererrestarguments)
* [XmlRendererSet](README.md#xmlrendererset)
* [XmlRendererTest](README.md#xmlrenderertest)
* [XmlRendererTraverse](README.md#xmlrenderertraverse)

### Functions

* [getKeyForNode](README.md#getkeyfornode)
* [traverseRenderer](README.md#traverserenderer)

## Type aliases

### XmlRendererFactory

Ƭ  **XmlRendererFactory**<T, U\>: (value: T \| undefined, props: [XmlRendererProps](README.md#xmlrendererprops)<U\>, ...rest: [XmlRendererRestArguments](README.md#xmlrendererrestarguments)) => U

*Defined in [GenericRenderer.ts:38](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/GenericRenderer.ts#L38)*

A compatibility layer between the renderer and React or another templating engine. Is given the metadata registered
to the node that being traversed (as well as the node itself and a means to continue traversal), so that this
function may use that metadata (eg. a component) to output something using React or other.

For the [ReactRenderer](classes/reactrenderer.md) this factory is already provided, where it is essentially a wrapper around
`React.createElement`.

#### Type parameters:

Name |
------ |
`T` |
`U` |

___

### XmlRendererProps

Ƭ  **XmlRendererProps**<U\>: { node: Node ; traverse: [XmlRendererTraverse](README.md#xmlrenderertraverse)<U\>  }

*Defined in [GenericRenderer.ts:19](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/GenericRenderer.ts#L19)*

The renderer context information, in React passed as props, given to every rule match. The two props that are always
passed are `node` (the XML node for which the rule is being invoked) and `traverse` (a function to continue rendering
the node's children or related nodes).

See also [XmlRendererTraverse](README.md#xmlrenderertraverse).

#### Type parameters:

Name |
------ |
`U` |

#### Type declaration:

Name | Type |
------ | ------ |
`node` | Node |
`traverse` | [XmlRendererTraverse](README.md#xmlrenderertraverse)<U\> |

___

### XmlRendererReactInput

Ƭ  **XmlRendererReactInput**: ElementType<[XmlRendererReactProps](README.md#xmlrendererreactprops)\>

*Defined in [ReactRenderer.ts:23](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/ReactRenderer.ts#L23)*

The thing that you give to [ReactRenderer.add](classes/reactrenderer.md#add) should be a React component class or function component. It is
given two props by xml-renderer automatically, `node` and `traverse`; see also [XmlRendererReactProps](README.md#xmlrendererreactprops).

___

### XmlRendererReactOutput

Ƭ  **XmlRendererReactOutput**: ReactElement<any, any\> \| string \| null

*Defined in [ReactRenderer.ts:10](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/ReactRenderer.ts#L10)*

The output of a ReactRenderer rule should be a React element (eg. `<p>` or `<P>`), a string, or `null`.

___

### XmlRendererReactProps

Ƭ  **XmlRendererReactProps**: [XmlRendererProps](README.md#xmlrendererprops)<[XmlRendererReactOutput](README.md#xmlrendererreactoutput)\> & { key: string  }

*Defined in [ReactRenderer.ts:17](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/ReactRenderer.ts#L17)*

The props that are passed to every component rendered by ReactRenderer. These include the `node` and `traverse`
props, so that you can query and travel further into the render loop, but also `key` for your convenience, because
most output is actually an array of results mapped from XML nodes.

___

### XmlRendererRestArguments

Ƭ  **XmlRendererRestArguments**: any[]

*Defined in [GenericRenderer.ts:28](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/GenericRenderer.ts#L28)*

Additional arguments that can be passed down to a renderer callbacks when calling the renderer.

**`todo`** deprecate

___

### XmlRendererSet

Ƭ  **XmlRendererSet**<T\>: { test: [XmlRendererTest](README.md#xmlrenderertest) ; value: T  }

*Defined in [Registry.ts:13](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L13)*

The metadata associated with nodes that match the correlating test. This metadata value is normally a component
(rendering to React) or another type of function, but is not actually limited to any type.

#### Type parameters:

Name |
------ |
`T` |

#### Type declaration:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](README.md#xmlrenderertest) |
`value` | T |

___

### XmlRendererTest

Ƭ  **XmlRendererTest**: string

*Defined in [Registry.ts:7](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L7)*

An XPath expression that must evaluate to truthy or falsy for a given node, which determines wether or not the
metadata value associated with the test applies.

___

### XmlRendererTraverse

Ƭ  **XmlRendererTraverse**<U\>: (query?: undefined \| string) => U[]

*Defined in [GenericRenderer.ts:10](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/GenericRenderer.ts#L10)*

A function that lets you traverse rendering down into child nodes (default) or another selection of nodes. By default
it will simply traverse into the child nodes of the context node. By passing an XPath expression to `traverse` you
can change that to select any related node.

#### Type parameters:

Name |
------ |
`U` |

## Functions

### getKeyForNode

▸ **getKeyForNode**(`node`: Node & { getAttribute?: undefined \| (name: string) => string ; hasAttribute?: undefined \| (name: string) => boolean  }, `identifierAttribute?`: string): string

*Defined in [getKeyForNode.ts:5](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/getKeyForNode.ts#L5)*

Utility function to generate a unique key for a given node. Is automatically used as the `key` prop in case you're
using {@link Registry.createReactRenderer}, but you may find it useful in other scenarios too.

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`node` | Node & { getAttribute?: undefined \| (name: string) => string ; hasAttribute?: undefined \| (name: string) => boolean  } | - |
`identifierAttribute` | string | "id" |

**Returns:** string

___

### traverseRenderer

▸ **traverseRenderer**<T, U\>(`registry`: [Registry](classes/registry.md)<T\>, `factory`: [XmlRendererFactory](README.md#xmlrendererfactory)<T, U\>, `node`: Node, ...`rest`: [XmlRendererRestArguments](README.md#xmlrendererrestarguments)): U

*Defined in [GenericRenderer.ts:49](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/GenericRenderer.ts#L49)*

#### Type parameters:

Name |
------ |
`T` |
`U` |

#### Parameters:

Name | Type |
------ | ------ |
`registry` | [Registry](classes/registry.md)<T\> |
`factory` | [XmlRendererFactory](README.md#xmlrendererfactory)<T, U\> |
`node` | Node |
`...rest` | [XmlRendererRestArguments](README.md#xmlrendererrestarguments) |

**Returns:** U
