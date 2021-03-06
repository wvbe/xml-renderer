**[xml-renderer](../README.md)**

> [Globals](../README.md) / GenericRenderer

# Class: GenericRenderer<ValueI, OutputI\>

A renderer that makes no presumptions on the type of output you want. Using the `factory` argument of [GenericRenderer.render](genericrenderer.md#render) it can be made to output anything, such as a long concatenated string or maybe JSONML.

This is the more generic sibling of [ReactRenderer](reactrenderer.md).

## Type parameters

Name |
------ |
`ValueI` |
`OutputI` |

## Hierarchy

* [Registry](registry.md)<ValueI\>

  ↳ **GenericRenderer**

## Index

### Constructors

* [constructor](genericrenderer.md#constructor)

### Accessors

* [length](genericrenderer.md#length)

### Methods

* [add](genericrenderer.md#add)
* [find](genericrenderer.md#find)
* [merge](genericrenderer.md#merge)
* [overwrite](genericrenderer.md#overwrite)
* [remove](genericrenderer.md#remove)
* [render](genericrenderer.md#render)

## Constructors

### constructor

\+ **new GenericRenderer**(...`sets`: [Registry](registry.md)<ValueI\>[]): [GenericRenderer](genericrenderer.md)

*Inherited from [Registry](registry.md).[constructor](registry.md#constructor)*

*Defined in [Registry.ts:23](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L23)*

A class that you instantiate to contain "metadata" associated with certain XML nodes. The metadata could be anything,
but in context of being an "xml renderer" you'll probably want to use it for templates or React components.

See also [GenericRenderer](genericrenderer.md) and [ReactRenderer](reactrenderer.md) which extend the `Registry` class and add a `.render()`
method to it.

Render functions (metadata) are associated with XML nodes via an XPath test. For any given node, the renderer will
use the metadata associated the most specific test that matches the node.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)<ValueI\>[] |

**Returns:** [GenericRenderer](genericrenderer.md)

## Accessors

### length

• get **length**(): number

*Inherited from [Registry](registry.md).[length](registry.md#length)*

*Defined in [Registry.ts:57](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L57)*

**Returns:** number

## Methods

### add

▸ **add**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: ValueI): void

*Inherited from [Registry](registry.md).[add](registry.md#add)*

*Defined in [Registry.ts:80](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L80)*

Add a test/value set to the registry, and optimizes ({@link Registry.optimize}).

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | ValueI |

**Returns:** void

___

### find

▸ **find**(`node`: Node): ValueI \| undefined

*Inherited from [Registry](registry.md).[find](registry.md#find)*

*Defined in [Registry.ts:135](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L135)*

Retrieve the metadata that was associated with this node before. If there are several rules that match, `.find`
gives you only the value of the best match.

#### Parameters:

Name | Type |
------ | ------ |
`node` | Node |

**Returns:** ValueI \| undefined

___

### merge

▸ **merge**(...`sets`: [Registry](registry.md)<ValueI\>[]): void

*Inherited from [Registry](registry.md).[merge](registry.md#merge)*

*Defined in [Registry.ts:64](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L64)*

Merges other registry instances into this one, and optimizes ({@link Registry.optimize}) when done.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)<ValueI\>[] |

**Returns:** void

___

### overwrite

▸ **overwrite**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: ValueI): void

*Inherited from [Registry](registry.md).[overwrite](registry.md#overwrite)*

*Defined in [Registry.ts:99](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L99)*

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | ValueI |

**Returns:** void

___

### remove

▸ **remove**(`test`: [XmlRendererTest](../README.md#xmlrenderertest)): boolean

*Inherited from [Registry](registry.md).[remove](registry.md#remove)*

*Defined in [Registry.ts:122](https://github.com/wvbe/xml-renderer/blob/87ca029/src/Registry.ts#L122)*

Remove a test/value set from the registry. This is the opposite of the [Registry.add](registry.md#add) method.

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |

**Returns:** boolean

___

### render

▸ **render**(`factory`: [XmlRendererFactory](../README.md#xmlrendererfactory)<ValueI, OutputI\>, `node`: Node, ...`rest`: [XmlRendererRestArguments](../README.md#xmlrendererrestarguments)): OutputI

*Defined in [GenericRenderer.ts:74](https://github.com/wvbe/xml-renderer/blob/87ca029/src/GenericRenderer.ts#L74)*

#### Parameters:

Name | Type |
------ | ------ |
`factory` | [XmlRendererFactory](../README.md#xmlrendererfactory)<ValueI, OutputI\> |
`node` | Node |
`...rest` | [XmlRendererRestArguments](../README.md#xmlrendererrestarguments) |

**Returns:** OutputI
