type InstanceId = string;

export const instanceRegistry = <TInstance>() => {
  const internals: {
    instances: { [id: InstanceId]: TInstance };
    suspense: { [id: InstanceId]: { execute: () => unknown } };
  } = {
    instances: {},
    suspense: {},
  };

  return {
    register: (id: InstanceId, instance: TInstance) => {
      internals.instances[id] = instance;
      return instance;
    },

    instanceExists: (id: InstanceId) => {
      return !!internals.instances[id];
    },

    registerSuspense: (id: InstanceId, execute: () => unknown) => {
      internals.suspense[id] = { execute };
      return execute;
    },

    suspenseExists: (id: InstanceId) => {
      return !!internals.suspense[id];
    },

    getSuspense: (id: InstanceId) => {
      return internals.suspense[id];
    },

    getInstance: (id: InstanceId) => {
      return internals.instances[id] as unknown as TInstance;
    },
  };
};
