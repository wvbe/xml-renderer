**[xml-renderer](../README.md)**

> [Globals](../README.md) / ReactRenderer

# Class: ReactRenderer

This is the React-specific sibling of [GenericRenderer](genericrenderer.md).

## Hierarchy

* [Registry](registry.md)\<[XmlRendererReactInput](../README.md#xmlrendererreactinput)>

  ↳ **ReactRenderer**

## Index

### Constructors

* [constructor](reactrenderer.md#constructor)

### Methods

* [add](reactrenderer.md#add)
* [find](reactrenderer.md#find)
* [merge](reactrenderer.md#merge)
* [remove](reactrenderer.md#remove)
* [render](reactrenderer.md#render)

## Constructors

### constructor

\+ **new ReactRenderer**(...`sets`: [Registry](registry.md)\<[XmlRendererReactInput](../README.md#xmlrendererreactinput)>[]): [ReactRenderer](reactrenderer.md)

*Inherited from [Registry](registry.md).[constructor](registry.md#constructor)*

*Defined in [Registry.ts:23](https://github.com/wvbe/xml-renderer/blob/08d7385/src/Registry.ts#L23)*

A class that you instantiate to contain "metadata" associated with certain XML nodes. The metadata could be anything,
but in context of being an "xml renderer" you'll probably want to use it for templates or React components.

See also [GenericRenderer](genericrenderer.md) and [ReactRenderer](reactrenderer.md) which extend the `Registry` class and add a `.render()`
method to it.

Render functions (metadata) are associated with XML nodes via an XPath test. For any given node, the renderer will
use the metadata associated the most specific test that matches the node.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)\<[XmlRendererReactInput](../README.md#xmlrendererreactinput)>[] |

**Returns:** [ReactRenderer](reactrenderer.md)

## Methods

### add

▸ **add**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: [XmlRendererReactInput](../README.md#xmlrendererreactinput)): void

*Inherited from [Registry](registry.md).[add](registry.md#add)*

*Defined in [Registry.ts:70](https://github.com/wvbe/xml-renderer/blob/08d7385/src/Registry.ts#L70)*

Add a test/value set to the registry, and optimizes ({@link Registry.optimize}).

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | [XmlRendererReactInput](../README.md#xmlrendererreactinput) |

**Returns:** void

___

### find

▸ **find**(`node`: Node): [XmlRendererReactInput](../README.md#xmlrendererreactinput) \| undefined

*Inherited from [Registry](registry.md).[find](registry.md#find)*

*Defined in [Registry.ts:98](https://github.com/wvbe/xml-renderer/blob/08d7385/src/Registry.ts#L98)*

Retrieve the metadata that was associated with this node before. If there are several rules that match, `.find`
gives you only the value of the best match.

#### Parameters:

Name | Type |
------ | ------ |
`node` | Node |

**Returns:** [XmlRendererReactInput](../README.md#xmlrendererreactinput) \| undefined

___

### merge

▸ **merge**(...`sets`: [Registry](registry.md)\<[XmlRendererReactInput](../README.md#xmlrendererreactinput)>[]): void

*Inherited from [Registry](registry.md).[merge](registry.md#merge)*

*Defined in [Registry.ts:58](https://github.com/wvbe/xml-renderer/blob/08d7385/src/Registry.ts#L58)*

Merges other registry instances into this one, and optimizes ({@link Registry.optimize}) when done.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)\<[XmlRendererReactInput](../README.md#xmlrendererreactinput)>[] |

**Returns:** void

___

### remove

▸ **remove**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: [XmlRendererReactInput](../README.md#xmlrendererreactinput)): boolean

*Inherited from [Registry](registry.md).[remove](registry.md#remove)*

*Defined in [Registry.ts:85](https://github.com/wvbe/xml-renderer/blob/08d7385/src/Registry.ts#L85)*

Remove a test/value set from the registry. This is the opposite of the [Registry.add](registry.md#add) method.

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | [XmlRendererReactInput](../README.md#xmlrendererreactinput) |

**Returns:** boolean

___

### render

▸ **render**(`createElement`: *typeof* CreateElement, `node`: Node, `additionalProps?`: undefined \| object): [XmlRendererReactOutput](../README.md#xmlrendererreactoutput)

*Defined in [ReactRenderer.ts:30](https://github.com/wvbe/xml-renderer/blob/08d7385/src/ReactRenderer.ts#L30)*

#### Parameters:

Name | Type |
------ | ------ |
`createElement` | *typeof* CreateElement |
`node` | Node |
`additionalProps?` | undefined \| object |

**Returns:** [XmlRendererReactOutput](../README.md#xmlrendererreactoutput)