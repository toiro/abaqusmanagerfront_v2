import {
  defineEventHandler,
  getHeaders,
  getMethod,
  getQuery,
  readBody
} from 'h3'

const config = useRuntimeConfig()
const baseURL = config.public.backendUri

// noinspection JSUnusedGlobalSymbols
export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const params = getQuery(event)

  const headers = getHeaders(event)

  // /back -> / にプロキシしたいので replaceで消す
  const url = (event.node.req.url as string).replace(/^\/api\/back/, '')

  const body = method === 'GET' ? undefined : await readBody(event)

  return await $fetch(url, {
    headers: {
      'Content-Type': headers['content-type'] as string
    },
    baseURL,
    method,
    params,
    body
  })
})
