// Generic typescript utils
export type Optional<T, K extends keyof T = never> = Omit<T, K> & Partial<Pick<T, K>>;
