import { IUser } from '~/models/api/user'

const key = 'activeUsers'
export type UserIndex = { label: string; value: string; text: string }

export const useActiveUsers = () => new ActiveUsersStore()

class ActiveUsersStore {
  _state = useState<IUser[]>(key, () => [])

  async load() {
    this._state.value = (await useFetch<IUser[]>('/api/back/users').data.value) || []
  }

  get labels() {
    return (
      this._state.value?.map<UserIndex>((_) => ({
        value: _.name,
        label: _.name,
        text: _.name,
      })) || []
    )
  }
}
