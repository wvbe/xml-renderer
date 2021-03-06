**[xml-renderer](README.md)**

> Globals

# xml-renderer

## Index

### Classes

* [GenericRenderer](classes/genericrenderer.md)
* [ReactRenderer](classes/reactrenderer.md)
* [Registry](classes/registry.md)

### Type aliases

* [RecursiveNode](README.md#recursivenode)
* [XmlRendererFactory](README.md#xmlrendererfactory)
* [XmlRendererProps](README.md#xmlrendererprops)
* [XmlRendererReactOutput](README.md#xmlrendererreactoutput)
* [XmlRendererReactProps](README.md#xmlrendererreactprops)
* [XmlRendererReactValueI](README.md#xmlrendererreactvaluei)
* [XmlRendererRestArguments](README.md#xmlrendererrestarguments)
* [XmlRendererSet](README.md#xmlrendererset)
* [XmlRendererTest](README.md#xmlrenderertest)
* [XmlRendererTraverse](README.md#xmlrenderertraverse)

### Functions

* [getKeyForNode](README.md#getkeyfornode)
* [traverseRenderer](README.md#traverserenderer)

## Type aliases

### RecursiveNode

Ƭ  **RecursiveNode**<NodeGeneric\>: NodeGeneric & { childNodes?: [RecursiveNode](README.md#recursivenode)<NodeGeneric\>[] ; getAttribute?: undefined \| (name: string) => string ; hasAttribute?: undefined \| (name: string) => boolean ; parentNode?: [RecursiveNode](README.md#recursivenode)<NodeGeneric\>  }

*Defined in [getKeyForNode.ts:3](https://github.com/wvbe/xml-renderer/blob/414b882/src/getKeyForNode.ts#L3)*

#### Type parameters:

Name |
------ |
`NodeGeneric` |

___

### XmlRendererFactory

Ƭ  **XmlRendererFactory**<NodeGeneric, InputGeneric, OutputGeneric\>: (input: InputGeneric \| undefined, props: [XmlRendererProps](README.md#xmlrendererprops)<NodeGeneric, OutputGeneric\>, ...rest: [XmlRendererRestArguments](README.md#xmlrendererrestarguments)) => OutputGeneric

*Defined in [GenericRenderer.ts:38](https://github.com/wvbe/xml-renderer/blob/414b882/src/GenericRenderer.ts#L38)*

A compatibility layer between the renderer and React or another templating engine. Is given the metadata registered
to the node that being traversed (as well as the node itself and a means to continue traversal), so that this
function may use that metadata (eg. a component) to output something using React or other.

For the [ReactRenderer](classes/reactrenderer.md) this factory is already provided, where it is essentially a wrapper around
`React.createElement`.

#### Type parameters:

Name |
------ |
`NodeGeneric` |
`InputGeneric` |
`OutputGeneric` |

___

### XmlRendererProps

Ƭ  **XmlRendererProps**<NodeGeneric, OutputGeneric\>: { node: NodeGeneric ; traverse: [XmlRendererTraverse](README.md#xmlrenderertraverse)<OutputGeneric\>  }

*Defined in [GenericRenderer.ts:19](https://github.com/wvbe/xml-renderer/blob/414b882/src/GenericRenderer.ts#L19)*

The renderer context information, in React passed as props, given to every rule match. The two props that are always
passed are `node` (the XML node for which the rule is being invoked) and `traverse` (a function to continue rendering
the node's children or related nodes).

See also [XmlRendererTraverse](README.md#xmlrenderertraverse).

#### Type parameters:

Name |
------ |
`NodeGeneric` |
`OutputGeneric` |

#### Type declaration:

Name | Type |
------ | ------ |
`node` | NodeGeneric |
`traverse` | [XmlRendererTraverse](README.md#xmlrenderertraverse)<OutputGeneric\> |

___

### XmlRendererReactOutput

Ƭ  **XmlRendererReactOutput**: ReactElement<any, any\> \| string \| null

*Defined in [ReactRenderer.ts:10](https://github.com/wvbe/xml-renderer/blob/414b882/src/ReactRenderer.ts#L10)*

The output of a ReactRenderer rule should be a React element (eg. `<p>` or `<P>`), a string, or `null`.

___

### XmlRendererReactProps

Ƭ  **XmlRendererReactProps**<NodeGeneric, PropsGeneric\>: [XmlRendererProps](README.md#xmlrendererprops)<NodeGeneric, [XmlRendererReactOutput](README.md#xmlrendererreactoutput)\> & PropsGeneric

*Defined in [ReactRenderer.ts:17](https://github.com/wvbe/xml-renderer/blob/414b882/src/ReactRenderer.ts#L17)*

The props that are passed to every component rendered by ReactRenderer. These include the `node` and `traverse`
props, so that you can query and travel further into the render loop, but also `key` for your convenience, because
most output is actually an array of results mapped from XML nodes.

#### Type parameters:

Name | Type |
------ | ------ |
`NodeGeneric` | - |
`PropsGeneric` | {} |

___

### XmlRendererReactValueI

Ƭ  **XmlRendererReactValueI**<NodeGeneric, PropsGeneric\>: ElementType<[XmlRendererReactProps](README.md#xmlrendererreactprops)<NodeGeneric, PropsGeneric\>\>

*Defined in [ReactRenderer.ts:23](https://github.com/wvbe/xml-renderer/blob/414b882/src/ReactRenderer.ts#L23)*

#### Type parameters:

Name |
------ |
`NodeGeneric` |
`PropsGeneric` |

___

### XmlRendererRestArguments

Ƭ  **XmlRendererRestArguments**: any[]

*Defined in [GenericRenderer.ts:28](https://github.com/wvbe/xml-renderer/blob/414b882/src/GenericRenderer.ts#L28)*

Additional arguments that can be passed down to a renderer callbacks when calling the renderer.

**`todo`** deprecate

___

### XmlRendererSet

Ƭ  **XmlRendererSet**<InputGeneric\>: { input: InputGeneric ; test: [XmlRendererTest](README.md#xmlrenderertest)  }

*Defined in [Registry.ts:13](https://github.com/wvbe/xml-renderer/blob/414b882/src/Registry.ts#L13)*

The metadata associated with nodes that match the correlating test. This metadata input is normally a component
(rendering to React) or another type of function, but is not actually limited to any type.

#### Type parameters:

Name |
------ |
`InputGeneric` |

#### Type declaration:

Name | Type |
------ | ------ |
`input` | InputGeneric |
`test` | [XmlRendererTest](README.md#xmlrenderertest) |

___

### XmlRendererTest

Ƭ  **XmlRendererTest**: string

*Defined in [Registry.ts:7](https://github.com/wvbe/xml-renderer/blob/414b882/src/Registry.ts#L7)*

An XPath expression that must evaluate to truthy or falsy for a given node, which determines wether or not the
metadata input associated with the test applies.

___

### XmlRendererTraverse

Ƭ  **XmlRendererTraverse**<OutputGeneric\>: (query?: undefined \| string) => OutputGeneric[]

*Defined in [GenericRenderer.ts:10](https://github.com/wvbe/xml-renderer/blob/414b882/src/GenericRenderer.ts#L10)*

A function that lets you traverse rendering down into child nodes (default) or another selection of nodes. By default
it will simply traverse into the child nodes of the context node. By passing an XPath expression to `traverse` you
can change that to select any related node.

#### Type parameters:

Name |
------ |
`OutputGeneric` |

## Functions

### getKeyForNode

▸ **getKeyForNode**<NodeGeneric\>(`node`: [RecursiveNode](README.md#recursivenode)<NodeGeneric\> \| null \| undefined, `identifierAttribute?`: string): string

*Defined in [getKeyForNode.ts:13](https://github.com/wvbe/xml-renderer/blob/414b882/src/getKeyForNode.ts#L13)*

Utility function to generate a unique key for a given node. Is automatically used as the `key` prop in case you're
using {@link Registry.createReactRenderer}, but you may find it useful in other scenarios too.

#### Type parameters:

Name | Type |
------ | ------ |
`NodeGeneric` | Node |

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`node` | [RecursiveNode](README.md#recursivenode)<NodeGeneric\> \| null \| undefined | - |
`identifierAttribute` | string | "id" |

**Returns:** string

___

### traverseRenderer

▸ **traverseRenderer**<NodeGeneric, InputGeneric, OutputGeneric\>(`registry`: [Registry](classes/registry.md)<NodeGeneric, InputGeneric\>, `factory`: [XmlRendererFactory](README.md#xmlrendererfactory)<NodeGeneric, InputGeneric, OutputGeneric\>, `node`: NodeGeneric, ...`rest`: [XmlRendererRestArguments](README.md#xmlrendererrestarguments)): OutputGeneric

*Defined in [GenericRenderer.ts:49](https://github.com/wvbe/xml-renderer/blob/414b882/src/GenericRenderer.ts#L49)*

#### Type parameters:

Name | Type |
------ | ------ |
`NodeGeneric` | Node |
`InputGeneric` | - |
`OutputGeneric` | - |

#### Parameters:

Name | Type |
------ | ------ |
`registry` | [Registry](classes/registry.md)<NodeGeneric, InputGeneric\> |
`factory` | [XmlRendererFactory](README.md#xmlrendererfactory)<NodeGeneric, InputGeneric, OutputGeneric\> |
`node` | NodeGeneric |
`...rest` | [XmlRendererRestArguments](README.md#xmlrendererrestarguments) |

**Returns:** OutputGeneric
