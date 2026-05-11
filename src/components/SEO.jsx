import { Helmet } from 'react-helmet-async'

// Per-page SEO helper. Drop one of these at the top of each route page.
// Title is appended with " — Soni Labs" automatically (except the home
// page, which uses the bare brand title). Description, OG, and Twitter
// tags all get sensible defaults from the props.
const SITE_NAME = 'Soni Labs'
const SITE_URL = 'https://sonilabs.studio'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

export default function SEO({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  jsonLd = null,
}) {
  // jsonLd: one object or an array of schema.org JSON-LD objects to
  // inject into <head> as additional structured data. Used by per-project
  // pages to declare CreativeWork + Breadcrumb schemas on top of the
  // Organization schema in index.html.
  const jsonLdScripts = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : []
  const fullTitle = title
    ? (title.endsWith(SITE_NAME) ? title : `${title} — ${SITE_NAME}`)
    : `${SITE_NAME} — Brand, product, and websites, built under one roof.`
  const canonical = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdScripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
