type EnumReverseDict<E extends object> = {
  [key in E[keyof E] as string | number | symbol]: string
}

export class EnumReverser<T extends object> {
  _dict: EnumReverseDict<T>
  constructor(def: T) {
    this._dict = Object.assign({}, ...Object.entries(def).map((e) => ({ [e[1]]: e[0] as string })))
  }

  get = (value: string | number | symbol) => this._dict[value]
}
