import dateformat from 'dateformat'
import { JobPriority } from '~~/models/api/resources/enums'
import { NodeIndex } from '~~/server/api/cache/get-active-nodes'
import { UserIndex } from '~~/server/api/cache/get-active-users'

const defaultDateFormat = 'yyyy-mm-dd HH:MM:ss'

export const rndHelper = {
  dateformat: (date: string | number | Date, format = defaultDateFormat) => dateformat(date, format),
  priorityRenderer: new EnumReverser<typeof JobPriority>(JobPriority).get,
  loadUserIndex: async () => await useFetch<UserIndex[]>('/api/cache/get-active-users'),
  loadNodeIndex: async () => await useFetch<NodeIndex[]>('/api/cache/get-active-nodes'),
  baseName: (path: string) => {
    const base = path.substring(path.lastIndexOf('/') + 1)
    return base.lastIndexOf('.') === -1 ? base : base.substring(0, base.lastIndexOf('.'))
  },
}
