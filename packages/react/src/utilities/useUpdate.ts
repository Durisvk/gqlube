import { useState, useCallback } from "react";

export const useUpdate = () => {
  const [, setState] = useState(0);

  const update = useCallback(() => {
    setState((prev) => (prev + 1) % 10000);
  }, []);

  return update;
};
