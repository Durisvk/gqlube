import React, { createContext, useContext } from "react";
import { instanceRegistry } from "./utilities/instanceRegistry";

const registry = instanceRegistry();

const GQLubeContext = createContext<typeof registry>(registry);

export const Provider = ({ children }: React.PropsWithChildren) => (
  <GQLubeContext.Provider value={registry}>{children}</GQLubeContext.Provider>
);

export const useGQLube = () => {
  return useContext(GQLubeContext);
};
