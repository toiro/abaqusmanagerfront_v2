import { INode } from '~/models/api/node'

const key = 'activeNodes'
type NodeIndex = { label: string; value: string; text: string }

export const useActiveNodes = () => new ActiveNodesStore()

class ActiveNodesStore {
  _state = useState<INode[]>(key, () => [])

  async load() {
    this._state.value = (await useFetch<INode[]>('/api/back/nodes').data.value) || []
  }

  get labels() {
    return (
      this._state.value?.map<NodeIndex>((_) => ({
        value: _.hostname,
        label: _.hostname,
        text: _.hostname,
      })) || []
    )
  }
}
