import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError, getHeader } from 'h3'
import { destinationValidationIssues, guideValidationIssues, packageValidationIssues, testimonialValidationIssues, validationMessage, type ManagerProfile, type ManagedDestinationRow, type ManagedGuideRow, type ManagedPackageRow, type ManagedTestimonialRow } from '~/data/manager'
import type { Destination } from '~/data/destinations'
import type { TripPackage } from '~/data/packages/types'
import type { Testimonial } from '~/data/testimonials'
import type { TravelGuide } from '~/data/travelGuides'

type ManagerContext = {
  client: SupabaseClient
  profile: ManagerProfile
}

function getConfig(event: H3Event) {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl
  const key = config.public.supabasePublishableKey

  if (!url || !key) {
    throw createError({ statusCode: 503, statusMessage: 'Tripport Manager has not been connected to Supabase yet.' })
  }

  return { url, key }
}

function requestToken(event: H3Event) {
  const header = getHeader(event, 'authorization')
  if (!header?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Please sign in to continue.' })
  }
  return header.slice('Bearer '.length)
}

export function publicContentClient(event: H3Event) {
  const { url, key } = getConfig(event)
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function requireManager(event: H3Event): Promise<ManagerContext> {
  const { url, key } = getConfig(event)
  const token = requestToken(event)
  const client = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userError } = await client.auth.getUser(token)
  if (userError || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Your sign-in session has expired. Please sign in again.' })
  }

  const { data: profileData, error: profileError } = await client
    .from('profiles')
    .select('id, email, role')
    .eq('id', userData.user.id)
    .maybeSingle()

  if (profileError || !profileData || !['manager', 'editor'].includes(profileData.role)) {
    throw createError({ statusCode: 403, statusMessage: 'This account does not have access to Tripport Manager.' })
  }

  return { client, profile: profileData as ManagerProfile }
}

function packageStatus(value: unknown) {
  if (value === 'draft' || value === 'published' || value === 'archived') return value
  return 'draft'
}

function guideStatus(value: unknown) {
  if (value === 'draft' || value === 'published' || value === 'archived') return value
  return 'draft'
}

export function packageRowFromDocument(input: TripPackage) {
  const document = structuredClone(input)
  document.status = packageStatus(document.status)
  document.slug = document.slug.trim()
  document.title = document.title.trim()

  if (!document.id) throw createError({ statusCode: 400, statusMessage: 'A package needs an ID.' })
  const issues = packageValidationIssues(document, document.status === 'published' ? 'published' : 'draft')
  if (issues.length) throw createError({ statusCode: 400, statusMessage: validationMessage('package', issues, document.status === 'published' ? 'publish' : 'save') })

  return {
    id: document.id,
    slug: document.slug,
    title: document.title,
    status: document.status,
    package_type: document.packageType,
    destination_state: document.destination.state,
    duration_days: document.duration.days,
    duration_nights: document.duration.nights,
    cover_image: document.images.cover.url,
    data: document,
  }
}

export function guideRowFromDocument(input: TravelGuide) {
  const document = structuredClone(input)
  document.status = guideStatus(document.status)
  document.slug = document.slug.trim()
  document.title = document.title.trim()

  const issues = guideValidationIssues(document, document.status === 'published' ? 'published' : 'draft')
  if (issues.length) throw createError({ statusCode: 400, statusMessage: validationMessage('travel guide', issues, document.status === 'published' ? 'publish' : 'save') })

  return {
    slug: document.slug,
    title: document.title,
    status: document.status,
    cover_image: document.image,
    data: document,
  }
}

export function destinationRowFromDocument(input: Destination) {
  const document = structuredClone(input)
  document.status = packageStatus(document.status)
  document.slug = document.slug.trim()
  document.name = document.name.trim()

  const issues = destinationValidationIssues(document, document.status === 'published' ? 'published' : 'draft')
  if (issues.length) throw createError({ statusCode: 400, statusMessage: validationMessage('destination', issues, document.status === 'published' ? 'publish' : 'save') })

  return {
    slug: document.slug,
    name: document.name,
    status: document.status,
    region: document.region,
    ideal_nights: document.idealNights,
    cover_image: document.image,
    data: document,
  }
}

export function testimonialRowFromDocument(input: Testimonial) {
  const document = structuredClone(input)
  document.status = packageStatus(document.status)
  document.id = document.id.trim()
  document.name = document.name.trim()

  if (!document.id) throw createError({ statusCode: 400, statusMessage: 'A testimonial needs an ID.' })
  const issues = testimonialValidationIssues(document, document.status === 'published' ? 'published' : 'draft')
  if (issues.length) throw createError({ statusCode: 400, statusMessage: validationMessage('testimonial', issues, document.status === 'published' ? 'publish' : 'save') })

  return {
    id: document.id,
    name: document.name,
    status: document.status,
    rating: document.rating,
    featured: document.featured,
    image: document.image || '',
    consent_confirmed: document.permissionConfirmed,
    sort_order: document.sortOrder,
    data: document,
  }
}

export function packageDocument(row: { data: TripPackage }): TripPackage {
  return row.data
}

export function guideDocument(row: { data: TravelGuide }): TravelGuide {
  return row.data
}

export function destinationDocument(row: { data: Destination }): Destination {
  return row.data
}

export function testimonialDocument(row: { data: Testimonial }): Testimonial {
  return row.data
}

export type PackageRow = ManagedPackageRow
export type GuideRow = ManagedGuideRow
export type DestinationRow = ManagedDestinationRow
export type TestimonialRow = ManagedTestimonialRow
