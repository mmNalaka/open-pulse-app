import { v7 as uuid, type Version7Options } from "uuid";

export const newUUID = (prefix?: string, options?: Version7Options) => {
  const id = uuid(options);
  return prefix ? `${prefix}_${id}` : id;
};
