import type { H3Event } from 'h3'
import { destinations as staticDestinations } from '~/data/destinations'
import { itineraries as staticPackages } from '~/data/itineraries'
import { testimonials as staticTestimonials } from '~/data/testimonials'
import { travelGuides as staticGuides } from '~/data/travelGuides'
import type { Destination } from '~/data/destinations'
import type { TripPackage } from '~/data/packages/types'
import type { Testimonial } from '~/data/testimonials'
import type { TravelGuide } from '~/data/travelGuides'
import { publicContentClient } from './supabase-content'

export async function getPublishedPackages(event: H3Event): Promise<TripPackage[]> {
  try {
    const client = publicContentClient(event)
    const { data, error } = await client
      .from('packages')
      .select('data')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (error || !data?.length) return staticPackages.filter(item => item.status === 'published')
    return data.map(row => row.data as TripPackage)
  } catch {
    return staticPackages.filter(item => item.status === 'published')
  }
}

export async function getPublishedPackage(event: H3Event, slug: string) {
  const packages = await getPublishedPackages(event)
  return packages.find(item => item.slug === slug)
}

export async function getPublishedGuides(event: H3Event): Promise<TravelGuide[]> {
  try {
    const client = publicContentClient(event)
    const { data, error } = await client
      .from('travel_guides')
      .select('data')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (error || !data?.length) return staticGuides
    return data.map(row => row.data as TravelGuide)
  } catch {
    return staticGuides
  }
}

export async function getPublishedGuide(event: H3Event, slug: string) {
  const guides = await getPublishedGuides(event)
  return guides.find(item => item.slug === slug)
}

export async function getPublishedDestinations(event: H3Event): Promise<Destination[]> {
  try {
    const client = publicContentClient(event)
    const { data, error } = await client
      .from('destinations')
      .select('data')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (error) return staticDestinations.filter(item => item.status === 'published')
    return (data ?? []).map(row => row.data as Destination)
  } catch {
    return staticDestinations.filter(item => item.status === 'published')
  }
}

export async function getPublishedDestination(event: H3Event, slug: string) {
  const destinations = await getPublishedDestinations(event)
  return destinations.find(item => item.slug === slug)
}

export async function getPublishedTestimonials(event: H3Event): Promise<Testimonial[]> {
  try {
    const client = publicContentClient(event)
    const { data, error } = await client
      .from('testimonials')
      .select('data')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('updated_at', { ascending: false })

    if (error) return staticTestimonials.filter(item => item.status === 'published')
    return (data ?? []).map(row => row.data as Testimonial)
  } catch {
    return staticTestimonials.filter(item => item.status === 'published')
  }
}
