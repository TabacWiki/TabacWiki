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
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method === "POST") {
      try {
        const rating = await request.json();
        
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

        // Define the repo URL directly
        const repoUrl = 'https://api.github.com/repos/TabacWiki/TabacWiki/dispatches';

        // Trigger GitHub workflow
        const githubResponse = await fetch(repoUrl, {
          method: 'POST',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'TabacWiki-Rating-Worker'
          },
          body: JSON.stringify({
            event_type: 'new_rating',
            client_payload: rating
          })
        });

        if (!githubResponse.ok) {
          const errorText = await githubResponse.text();
          throw new Error(`GitHub API error: ${errorText}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });

      } catch (error) {
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