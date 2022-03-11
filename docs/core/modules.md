[@gqlube/core](README.md) / Exports

# @gqlube/core

## Table of contents

### Classes

- [GraphQLError](classes/GraphQLError.md)

### Type aliases

- [DefaultFetcherOptions](modules.md#defaultfetcheroptions)
- [Fetcher](modules.md#fetcher)
- [FetcherInput](modules.md#fetcherinput)
- [FetcherOptions](modules.md#fetcheroptions)
- [GraphQLResult](modules.md#graphqlresult)
- [GraphQLResultError](modules.md#graphqlresulterror)
- [InitialQueryOptions](modules.md#initialqueryoptions)
- [InstanceOptions](modules.md#instanceoptions)
- [QueryControls](modules.md#querycontrols)
- [RootType](modules.md#roottype)
- [SchedulerStatus](modules.md#schedulerstatus)
- [VariablesType](modules.md#variablestype)

### Functions

- [instance](modules.md#instance)

## Type aliases

### DefaultFetcherOptions

Ƭ **DefaultFetcherOptions**: `Omit`<`RequestInit`, ``"body"``\> & { `url`: `string`  }

#### Defined in

[fetcher.ts:4](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/fetcher.ts#L4)

___

### Fetcher

Ƭ **Fetcher**<`TResult`, `TVariables`, `TQuery`, `TOperationName`\>: (`input`: [`FetcherInput`](modules.md#fetcherinput)<`TVariables`, `TQuery`, `TOperationName`\>) => `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | extends [`GraphQLResult`](modules.md#graphqlresult) = [`GraphQLResult`](modules.md#graphqlresult) |
| `TVariables` | extends [`VariablesType`](modules.md#variablestype) = [`VariablesType`](modules.md#variablestype) |
| `TQuery` | extends `string` = `string` |
| `TOperationName` | extends `string` = `string` |

#### Type declaration

▸ (`input`): `Promise`<`TResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`FetcherInput`](modules.md#fetcherinput)<`TVariables`, `TQuery`, `TOperationName`\> |

##### Returns

`Promise`<`TResult`\>

#### Defined in

[types.ts:54](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/types.ts#L54)

___

### FetcherInput

Ƭ **FetcherInput**<`TVariables`, `TQuery`, `TOperationName`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TVariables` | extends [`VariablesType`](modules.md#variablestype) |
| `TQuery` | extends `string` = `string` |
| `TOperationName` | extends `string` = `string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `operationName?` | `TOperationName` |
| `query` | `TQuery` |
| `variables?` | `TVariables` |

#### Defined in

[types.ts:48](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/types.ts#L48)

___

### FetcherOptions

Ƭ **FetcherOptions**<`TResult`, `TVariables`\>: [`Fetcher`](modules.md#fetcher)<`TResult`, `TVariables`\> \| [`DefaultFetcherOptions`](modules.md#defaultfetcheroptions)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | extends [`GraphQLResult`](modules.md#graphqlresult)<`object`\> = [`GraphQLResult`](modules.md#graphqlresult)<`object`\> |
| `TVariables` | extends [`VariablesType`](modules.md#variablestype) = [`VariablesType`](modules.md#variablestype) |

#### Defined in

[fetcher.ts:5](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/fetcher.ts#L5)

___

### GraphQLResult

Ƭ **GraphQLResult**<`TDataShape`, `TErrorShape`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TDataShape` | extends `object` = `object` |
| `TErrorShape` | extends [`GraphQLResultError`](modules.md#graphqlresulterror) = [`GraphQLResultError`](modules.md#graphqlresulterror) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `TDataShape` |
| `errors` | `TErrorShape`[] |

#### Defined in

[types.ts:16](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/types.ts#L16)

___

### GraphQLResultError

Ƭ **GraphQLResultError**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `extensions` | { `code`: `string`  } |
| `extensions.code` | `string` |
| `locations` | { `column`: `number` ; `line`: `number`  }[] |
| `message` | `string` |

#### Defined in

[types.ts:10](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/types.ts#L10)

___

### InitialQueryOptions

Ƭ **InitialQueryOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `operationName?` | `string` |
| `rootType` | [`RootType`](modules.md#roottype) |

#### Defined in

[query.ts:8](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/query.ts#L8)

___

### InstanceOptions

Ƭ **InstanceOptions**<`TResult`\>: [`InitialQueryOptions`](modules.md#initialqueryoptions) & { `fetcher`: [`FetcherOptions`](modules.md#fetcheroptions)<`TResult`\> ; `onError?`: (`error`: [`GraphQLError`](classes/GraphQLError.md)) => `unknown`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | extends [`GraphQLResult`](modules.md#graphqlresult) = [`GraphQLResult`](modules.md#graphqlresult) |

#### Defined in

[instance.ts:12](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/instance.ts#L12)

___

### QueryControls

Ƭ **QueryControls**<`TResult`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | extends [`GraphQLResult`](modules.md#graphqlresult) = [`GraphQLResult`](modules.md#graphqlresult) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `promise` | () => `Promise`<`undefined` \| `TResult`\> |
| `refetch` | () => `void` |
| `status` | () => [`SchedulerStatus`](modules.md#schedulerstatus) |

#### Defined in

[instance.ts:17](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/instance.ts#L17)

___

### RootType

Ƭ **RootType**: ``"Query"`` \| ``"Mutation"`` \| ``"Subscription"``

#### Defined in

[types.ts:5](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/types.ts#L5)

___

### SchedulerStatus

Ƭ **SchedulerStatus**: ``"HARVESTING"`` \| ``"FETCHING"`` \| ``"DONE"`` \| ``"ERROR"`` \| ``"REFETCHING"``

#### Defined in

[scheduler.ts:6](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/scheduler.ts#L6)

___

### VariablesType

Ƭ **VariablesType**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[types.ts:29](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/types.ts#L29)

## Functions

### instance

▸ **instance**<`TQuery`, `TResult`\>(`options`): [`TQuery`, [`QueryControls`](modules.md#querycontrols)<[`GraphQLResult`](modules.md#graphqlresult)<`object`, [`GraphQLResultError`](modules.md#graphqlresulterror)\>\>]

**`example`**
```ts
const [q, { promise }] = instance({
  rootType: 'Query',
  fetcher: { url: 'https://countries.trevorblades.com' },
  operationName: 'SimpleCountryQuery',
});

const countries = q.countries({ 'filter: CountryFilterInput': { code: { eq: 'CZ' } } })
countries[0].name;

await promise();

countries[0].name; // Czech Republic

```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TQuery` | extends `object` |
| `TResult` | extends [`GraphQLResult`](modules.md#graphqlresult)<`object`, [`GraphQLResultError`](modules.md#graphqlresulterror)\> = [`GraphQLResult`](modules.md#graphqlresult)<`object`, [`GraphQLResultError`](modules.md#graphqlresulterror)\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`InstanceOptions`](modules.md#instanceoptions)<`TResult`\> |

#### Returns

[`TQuery`, [`QueryControls`](modules.md#querycontrols)<[`GraphQLResult`](modules.md#graphqlresult)<`object`, [`GraphQLResultError`](modules.md#graphqlresulterror)\>\>]

#### Defined in

[instance.ts:41](https://github.com/Durisvk/gqlube/blob/1e20aea/packages/core/src/instance.ts#L41)
