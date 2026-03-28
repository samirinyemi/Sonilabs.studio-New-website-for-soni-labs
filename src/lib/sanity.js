import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID

// Only create the client if a real project ID is configured
export const sanityClient =
  projectId && /^[a-z0-9-]+$/.test(projectId)
    ? createClient({
        projectId,
        dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
        apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
        useCdn: true,
      })
    : null

export function urlFor(source) {
  if (!sanityClient) return null
  return imageUrlBuilder(sanityClient).image(source)
}
