import { IUser } from '~~/models/api/user'

export type UserIndex = { label: string; value: string; text: string };

export default defineEventHandler(async () => {
  const users = await $fetch<IUser[]>('/api/back/users')
  return users.map<UserIndex>(_ => ({
    value: _.name,
    label: _.name,
    text: _.name
  }))
})
