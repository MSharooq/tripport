import { getPublishedPackages } from '~~/server/utils/public-content'

export default defineEventHandler(event => getPublishedPackages(event))
