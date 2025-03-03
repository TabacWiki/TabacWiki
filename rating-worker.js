// KV namespace binding should be set up in your Cloudflare dashboard
// Name it RATINGS_KV

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return handleCORS(request)
  }

  if (request.method === 'POST' && new URL(request.url).pathname === '/submit-rating') {
    return handleRating(request)
  }

  return new Response('Not Found', { status: 404 })
}

async function handleRating(request) {
  try {
    const rating = await request.json()
    
    // Basic validation with half-star support
    if (!rating.blendId || !rating.rating) {
      return new Response('Invalid rating data', { status: 400 })
    }

    // Validate rating value
    const ratingValue = parseFloat(rating.rating);
    if (isNaN(ratingValue) || ratingValue < 0.5 || ratingValue > 4 || (ratingValue * 2) % 1 !== 0) {
      return new Response('Invalid rating value. Must be between 0.5 and 4 in half-star increments.', { status: 400 })
    }

    // Get client IP for abuse prevention
    const clientIP = request.headers.get('cf-connecting-ip')
    
    // Create a unique key for today's ratings
    const today = new Date().toISOString().split('T')[0]
    const key = `ratings_${today}`

    // Get existing ratings for today
    let todaysRatings = await RATINGS_KV.get(key, 'json') || []
    
    // Add new rating with IP
    todaysRatings.push({
      ...rating,
      ip: clientIP,
      timestamp: new Date().toISOString()
    })

    // Store updated ratings
    await RATINGS_KV.put(key, JSON.stringify(todaysRatings))

    return new Response('Rating submitted successfully', {
      status: 200,
      headers: corsHeaders
    })
  } catch (error) {
    return new Response('Error processing rating', { status: 500 })
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://tabac.wiki',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function handleCORS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  })
} 