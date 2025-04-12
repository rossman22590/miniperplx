// Export metadata for the Twitter image
export const alt = 'Datavibes AI Search Engine'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Redirects to the external image URL
export default function Image() {
  return new Response('', {
    status: 302,
    headers: {
      'Location': 'https://pixiomedia.nyc3.digitaloceanspaces.com/uploads/1744495018676-opengraph-image.png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
