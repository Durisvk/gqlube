import { appendIncrementalPostfix } from './string';

type Aliases<TKey extends string, TAlias extends string = TKey> = Record<TKey, TAlias>;

export const uniqueRegistry = <TKey extends string, TValue = unknown>() => {
  type RegistryType = Record<TKey, TValue>;
  let registry: RegistryType = {} as RegistryType;
  return {
    addMany(values: RegistryType, existingAliases: Aliases<TKey> = {} as Aliases<TKey>) {
      let aliases: Aliases<TKey> = {} as Aliases<TKey>;

      for (const key of Object.keys(values)) {
        const alias = this.add(key as TKey, values[key as TKey], existingAliases[key as TKey]);
        if (alias) {
          aliases = { ...aliases, [key as TKey]: alias };
        }
      }

      return aliases;
    },

    add(key: TKey, value: unknown, existingAlias?: string) {
      let uniqueKey = existingAlias || key;

      while (Object.keys(registry).includes(uniqueKey)) {
        uniqueKey = appendIncrementalPostfix(uniqueKey);
      }

      registry = { ...registry, [uniqueKey]: value };

      if (uniqueKey !== key) return uniqueKey;

      return;
    },

    getUniquelyNamedRecords() {
      return registry;
    },
  };
};
