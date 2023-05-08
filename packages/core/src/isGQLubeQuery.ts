export const ID_FIELD = "______GQLUBE";

export const isGQLubeQuery = <T>(obj: T): boolean => {
  return obj != null && (obj as unknown as any)[ID_FIELD] === true;
};
