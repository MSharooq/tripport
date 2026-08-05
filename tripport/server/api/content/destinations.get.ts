import { getPublishedDestinations } from '~~/server/utils/public-content'

export default defineEventHandler(event => getPublishedDestinations(event))
