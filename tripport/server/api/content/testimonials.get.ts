import { getPublishedTestimonials } from '~~/server/utils/public-content'

export default defineEventHandler(event => getPublishedTestimonials(event))
