function isObjectOrArray(value: unknown) {
  return value !== null && typeof value === "object";
}

export { isObjectOrArray };
