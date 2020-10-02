**[xml-renderer](../README.md)**

> [Globals](../README.md) / Registry

# Class: Registry\<**T**>

## Type parameters

Name |
------ |
`T` |

## Hierarchy

* **Registry**

  ↳ [GenericRenderer](genericrenderer.md)

  ↳ [ReactRenderer](reactrenderer.md)

## Index

### Constructors

* [constructor](registry.md#constructor)

### Methods

* [add](registry.md#add)
* [find](registry.md#find)
* [merge](registry.md#merge)
* [remove](registry.md#remove)

## Constructors

### constructor

\+ **new Registry**(...`sets`: [Registry](registry.md)\<T>[]): [Registry](registry.md)

*Defined in [Registry.ts:23](https://github.com/wvbe/xml-renderer/blob/2673be3/src/Registry.ts#L23)*

A class that you instantiate to contain "metadata" associated with certain XML nodes. The metadata could be anything,
but in context of being an "xml renderer" you'll probably want to use it for templates or React components.

See also [GenericRenderer](genericrenderer.md) and [ReactRenderer](reactrenderer.md) which extend the `Registry` class and add a `.render()`
method to it.

Render functions (metadata) are associated with XML nodes via an XPath test. For any given node, the renderer will
use the metadata associated the most specific test that matches the node.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)\<T>[] |

**Returns:** [Registry](registry.md)

## Methods

### add

▸ **add**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: T): void

*Defined in [Registry.ts:70](https://github.com/wvbe/xml-renderer/blob/2673be3/src/Registry.ts#L70)*

Add a test/value set to the registry, and optimizes ({@link Registry.optimize}).

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | T |

**Returns:** void

___

### find

▸ **find**(`node`: Node): T \| undefined

*Defined in [Registry.ts:98](https://github.com/wvbe/xml-renderer/blob/2673be3/src/Registry.ts#L98)*

Retrieve the metadata that was associated with this node before. If there are several rules that match, `.find`
gives you only the value of the best match.

#### Parameters:

Name | Type |
------ | ------ |
`node` | Node |

**Returns:** T \| undefined

___

### merge

▸ **merge**(...`sets`: [Registry](registry.md)\<T>[]): void

*Defined in [Registry.ts:58](https://github.com/wvbe/xml-renderer/blob/2673be3/src/Registry.ts#L58)*

Merges other registry instances into this one, and optimizes ({@link Registry.optimize}) when done.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)\<T>[] |

**Returns:** void

___

### remove

▸ **remove**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: T): boolean

*Defined in [Registry.ts:85](https://github.com/wvbe/xml-renderer/blob/2673be3/src/Registry.ts#L85)*

Remove a test/value set from the registry. This is the opposite of the [Registry.add](registry.md#add) method.

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | T |

**Returns:** boolean
