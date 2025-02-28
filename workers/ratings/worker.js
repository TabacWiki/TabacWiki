export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://tabac.wiki",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Handle actual POST request
    if (request.method === "POST") {
      try {
        const rating = await request.json();
        console.log('Received rating:', rating);
        
        // Validate the rating data
        if (!rating.blendId || !rating.rating || !rating.profiles) {
          return new Response(JSON.stringify({ error: "Invalid rating data" }), { 
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }

        // Get GitHub token from environment
        const token = env.GITHUB_TOKEN;
        if (!token) {
          throw new Error("GitHub token not configured");
        }

        // Trigger GitHub workflow
        const githubUrl = 'https://api.github.com/repos/decombust/tabac-wiki/dispatches';
        console.log('Sending request to:', githubUrl);

        const githubResponse = await fetch(githubUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'TabacWiki-Rating-Worker'
          },
          body: JSON.stringify({
            event_type: 'new_rating',
            client_payload: rating
          })
        });

        // Log the GitHub response for debugging
        const responseText = await githubResponse.text();
        console.log('GitHub response:', githubResponse.status, responseText);

        if (!githubResponse.ok) {
          throw new Error(`GitHub API error: ${responseText}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });

      } catch (error) {
        console.error('Worker error:', error);
        return new Response(JSON.stringify({ 
          error: error.message,
          stack: error.stack
        }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
}; 