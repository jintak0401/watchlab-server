export const isEqualSet = (a: Set<any>, b: Set<any>) =>
  a.size === b.size && [...a].every((value) => b.has(value));
