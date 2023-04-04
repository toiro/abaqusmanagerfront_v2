function reverseRecord<K extends string | number | symbol, T extends string | number | symbol>(input: {
  [key in K]: T
}) {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [value, key])) as { [key in T]: K }
}
