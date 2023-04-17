import { INode } from '~/models/api/node'

const key = 'activeNodes'
type NodeIndex = { label: string; value: string; text: string }

export const useActiveNodes = () => new ActiveNodesStore()

function load() {
  return useLazyFetch<INode[]>('/api/back/nodes').data.value || []
}

class ActiveNodesStore {
  _state = useState<INode[]>(key, () => load())

  get labels() {
    return (
      this._state.value?.map<NodeIndex>((_) => ({
        value: _.hostname,
        label: _.hostname,
        text: _.hostname,
      })) || []
    )
  }

  refresh() {
    load()
  }
}
