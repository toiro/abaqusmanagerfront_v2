import { IJob } from '~/sharedDefinitions/model/job'

const apiPath = '/api/back/jobs'

export const jobFetch = {
  delete(job: IJob, waitingFlag?: Ref<boolean>) {
    return template(() => $fetch<IJob>(`${apiPath}/${job._id}`, { method: 'DELETE' }), waitingFlag)
  },
  terminate(job: IJob, waitingFlag?: Ref<boolean>) {
    return template(
      () => $fetch<{ accept: boolean }>(`${apiPath}/${job._id}/terminate`, { method: 'POST' }),
      waitingFlag,
    )
  },
  lazyFetch() {
    return useLazyFetch<IJob[]>(apiPath)
  },
}

async function template<T>(process: () => Promise<T>, flag?: Ref<boolean>) {
  if (flag) {
    flag.value = true
    try {
      return await process()
    } finally {
      flag.value = false
    }
  } else {
    return await process()
  }
}
