import { getPublishedDestination } from '~~/server/utils/public-content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) return null
  return getPublishedDestination(event, slug)
})
