addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "https://tabac.wiki",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      }
    });
  }

  // Handle actual POST request
  if (request.method === "POST") {
    try {
      const rating = await request.json();
      
      // Validate the rating data
      if (!rating.blendId || !rating.rating || !rating.profiles) {
        return new Response("Invalid rating data", { 
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "https://tabac.wiki",
            "Content-Type": "application/json"
          }
        });
      }

      // Store the rating in KV
      const timestamp = new Date().toISOString().split('T')[0]; // Get current date
      const key = `ratings_${timestamp}`;
      
      // Get existing ratings for today
      let todaysRatings = [];
      try {
        const existing = await RATINGS.get(key);
        if (existing) {
          todaysRatings = JSON.parse(existing);
        }
      } catch (e) {
        console.error('Error reading existing ratings:', e);
      }

      // Add new rating
      todaysRatings.push(rating);

      // Store updated ratings
      await RATINGS.put(key, JSON.stringify(todaysRatings));

      // Trigger GitHub workflow to update blend data
      const githubResponse = await fetch(
        'https://api.github.com/repos/your-username/your-repo/dispatches',
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'new_rating',
            client_payload: rating
          })
        }
      );

      if (!githubResponse.ok) {
        throw new Error('Failed to trigger GitHub workflow');
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Access-Control-Allow-Origin": "https://tabac.wiki",
          "Content-Type": "application/json"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://tabac.wiki",
          "Content-Type": "application/json"
        }
      });
    }
  }

  // Handle invalid methods
  return new Response("Method not allowed", { 
    status: 405,
    headers: {
      "Access-Control-Allow-Origin": "https://tabac.wiki",
      "Content-Type": "application/json"
    }
  });
} 