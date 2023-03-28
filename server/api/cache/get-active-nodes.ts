import { INode } from '~~/models/api/node'

export type NodeIndex = { label: string; value: string; text: string };

export default defineEventHandler(async () => {
  const nodes = await $fetch<INode[]>('/api/back/nodes')
  return nodes.map<NodeIndex>(_ => ({
    value: _.hostname,
    label: _.hostname,
    text: _.hostname
  }))
})
