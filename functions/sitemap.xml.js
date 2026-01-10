const buildUrlEntry = ({ loc, lastmod, changefreq, priority }) => {
  const safeLoc = loc.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const safeLastmod = lastmod || new Date().toISOString()
  return [
    "  <url>",
    `    <loc>${safeLoc}</loc>`,
    `    <lastmod>${safeLastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>"
  ].join("\n")
}

const fetchPropertyRows = async ({ supabaseUrl, anonKey }) => {
  if (!supabaseUrl || !anonKey) {
    return []
  }
  const endpoint = `${supabaseUrl}/rest/v1/properties?select=id,created_at&order=created_at.desc&limit=10000`
  const response = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  })
  if (!response.ok) {
    return []
  }
  return response.json()
}

export const onRequest = async ({ request, env }) => {
  const origin = new URL(request.url).origin
  const nowIso = new Date().toISOString()
  const entries = [
    buildUrlEntry({
      loc: `${origin}/`,
      lastmod: nowIso,
      changefreq: "weekly",
      priority: "1.0"
    }),
    buildUrlEntry({
      loc: `${origin}/listings`,
      lastmod: nowIso,
      changefreq: "daily",
      priority: "0.8"
    })
  ]

  const rows = await fetchPropertyRows({
    supabaseUrl: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY
  })

  rows.forEach((row) => {
    if (!row?.id) return
    entries.push(
      buildUrlEntry({
        loc: `${origin}/properties/${row.id}`,
        lastmod: row.created_at || nowIso,
        changefreq: "weekly",
        priority: "0.6"
      })
    )
  })

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${entries.join("\n")}\n</urlset>\n`

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600"
    }
  })
}
