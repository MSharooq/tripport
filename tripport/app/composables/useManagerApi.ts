import type { FetchOptions } from 'ofetch'

type HttpMethod = 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE'
  | 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'
type ManagerRequestOptions = Omit<FetchOptions, 'method'> & { method?: HttpMethod }

export function useManagerApi() {
  const { session, initialise } = useManagerAuth()

  async function request<T>(path: string, options: ManagerRequestOptions = {}) {
    await initialise()
    const token = session.value?.access_token
    if (!token) throw new Error('Please sign in to Tripport Manager.')

    return $fetch<T>(path, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return { request }
}
