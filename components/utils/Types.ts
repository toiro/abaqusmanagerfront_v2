export type ColumnDef<R> = {
  label: string
  prop: string
  sortable?: boolean
  filters?: { text: string; value: string }[]
  'filter-method'?: (value: string, row: R) => boolean
  formatter?: (row: R) => string
}

export const OutputFileExt = {
  STA: 'sta',
  DAT: 'dat',
  LOG: 'log',
  MSG: 'msg',
} as const
export type OutputFileExt = (typeof OutputFileExt)[keyof typeof OutputFileExt]
