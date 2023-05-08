import React, { createContext, useContext } from "react";
import { FetcherOptions } from "@gqlube/core";

type Props = FetcherOptions;

const Context = createContext<FetcherOptions | null>(null);
export const Provider = (props: React.PropsWithChildren<Props>) => (
  <Context.Provider value={props}>{props.children}</Context.Provider>
);
export const useFetcher = () => useContext(Context);
