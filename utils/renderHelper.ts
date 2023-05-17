import dateformat from 'dateformat'
import { JobPriority } from '~/sharedDefinitions/model/resources/enums'

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
  /**
   * path ライブラリをクライアント側に透過できないバグに対応するためのもの
   * @param path
   */
  baseName: (path: string) => {
    const base = path.substring(path.lastIndexOf('/') + 1)
    return base.lastIndexOf('.') === -1 ? base : base.substring(0, base.lastIndexOf('.'))
  },
}
