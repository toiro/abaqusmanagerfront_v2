import dateformat from 'dateformat'
import { JobPriority } from '~~/models/api/resources/enums'
import { NodeIndex } from '~~/server/api/cache/get-active-nodes'
import { UserIndex } from '~~/server/api/cache/get-active-users'

const defaultDateFormat = 'yyyy-mm-dd HH:MM:ss'

export const rndHelper = {
  /**
   * 日付をフォーマットする。
   * @param date 日付
   * @param format
   */
  dateformat: (date: string | number | Date, format = defaultDateFormat) => dateformat(date, format),
  /** JobPriority を数値から表示名に変換する */
  priorityRenderer: new EnumReverser<typeof JobPriority>(JobPriority).get,
  /** ユーザー選択用のリスト */
  loadUserIndex: async () => await useFetch<UserIndex[]>('/api/cache/get-active-users'),
  /** ノード選択用リスト */
  loadNodeIndex: async () => await useFetch<NodeIndex[]>('/api/cache/get-active-nodes'),
  /**
   * path ライブラリをクライアント側に透過できないバグに対応するためのもの
   * @param path
   */
  baseName: (path: string) => {
    const base = path.substring(path.lastIndexOf('/') + 1)
    return base.lastIndexOf('.') === -1 ? base : base.substring(0, base.lastIndexOf('.'))
  },
}
