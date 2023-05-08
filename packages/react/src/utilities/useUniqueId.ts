import { useRef } from "react";
import { generateUniqueId } from "./generateUniqueId";

export const useUniqueId = () => {
  return useRef(generateUniqueId()).current;
};
