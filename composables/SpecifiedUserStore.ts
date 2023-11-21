const key = 'selectedUser'

type UserState = {
  name: string
}

export const useSpecifiedUser = () => new UserStore()

class UserStore {
  _cookie
  _state
  constructor() {
    this._cookie = useCookie(key, {
      default: () => ({ name: '' }),
    })
    this._state = useState<UserState>(key, () => this._cookie.value)
  }

  get name() {
    return this._state.value.name
  }

  get ref() {
    return readonly(this._state)
  }

  setUser(name: string) {
    const newState = { name }
    this._cookie.value = newState
    this._state.value = newState
  }
}
