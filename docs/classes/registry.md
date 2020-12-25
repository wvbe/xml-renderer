**[xml-renderer](../README.md)**

> [Globals](../README.md) / Registry

# Class: Registry<T\>

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

### Accessors

* [length](registry.md#length)

### Methods

* [add](registry.md#add)
* [find](registry.md#find)
* [merge](registry.md#merge)
* [overwrite](registry.md#overwrite)
* [remove](registry.md#remove)

## Constructors

### constructor

\+ **new Registry**(...`sets`: [Registry](registry.md)<T\>[]): [Registry](registry.md)

*Defined in [Registry.ts:23](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L23)*

A class that you instantiate to contain "metadata" associated with certain XML nodes. The metadata could be anything,
but in context of being an "xml renderer" you'll probably want to use it for templates or React components.

See also [GenericRenderer](genericrenderer.md) and [ReactRenderer](reactrenderer.md) which extend the `Registry` class and add a `.render()`
method to it.

Render functions (metadata) are associated with XML nodes via an XPath test. For any given node, the renderer will
use the metadata associated the most specific test that matches the node.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)<T\>[] |

**Returns:** [Registry](registry.md)

## Accessors

### length

• get **length**(): number

*Defined in [Registry.ts:57](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L57)*

**Returns:** number

## Methods

### add

▸ **add**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: T): void

*Defined in [Registry.ts:80](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L80)*

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

*Defined in [Registry.ts:130](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L130)*

Retrieve the metadata that was associated with this node before. If there are several rules that match, `.find`
gives you only the value of the best match.

#### Parameters:

Name | Type |
------ | ------ |
`node` | Node |

**Returns:** T \| undefined

___

### merge

▸ **merge**(...`sets`: [Registry](registry.md)<T\>[]): void

*Defined in [Registry.ts:64](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L64)*

Merges other registry instances into this one, and optimizes ({@link Registry.optimize}) when done.

#### Parameters:

Name | Type |
------ | ------ |
`...sets` | [Registry](registry.md)<T\>[] |

**Returns:** void

___

### overwrite

▸ **overwrite**(`test`: [XmlRendererTest](../README.md#xmlrenderertest), `value`: T): void

*Defined in [Registry.ts:96](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L96)*

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |
`value` | T |

**Returns:** void

___

### remove

▸ **remove**(`test`: [XmlRendererTest](../README.md#xmlrenderertest)): boolean

*Defined in [Registry.ts:117](https://github.com/wvbe/xml-renderer/blob/d46ed04/src/Registry.ts#L117)*

Remove a test/value set from the registry. This is the opposite of the [Registry.add](registry.md#add) method.

#### Parameters:

Name | Type |
------ | ------ |
`test` | [XmlRendererTest](../README.md#xmlrenderertest) |

**Returns:** boolean
