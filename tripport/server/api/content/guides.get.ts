import { getPublishedGuides } from '~~/server/utils/public-content'

export default defineEventHandler(event => getPublishedGuides(event))
