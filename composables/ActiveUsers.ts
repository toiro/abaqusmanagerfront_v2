import { IUser } from '~/models/api/user'

const key = 'activeUsers'
export type UserIndex = { label: string; value: string; text: string }

export const useActiveUsers = () => new ActiveUsersStore()

function load() {
  return useLazyFetch<IUser[]>('/api/back/users').data.value || []
}

class ActiveUsersStore {
  _state = useState<IUser[]>(key, () => load())

  get labels() {
    return (
      this._state.value?.map<UserIndex>((_) => ({
        value: _.name,
        label: _.name,
        text: _.name,
      })) || []
    )
  }

  refresh() {
    load()
  }
}
