// Add GitHub token from environment variables
const GITHUB_TOKEN = SECRETS.GITHUB_TOKEN;
const REPO_URL = 'https://api.github.com/repos/dougsillars/tabac-wiki/dispatches';

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://tabac.wiki",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
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

        // Trigger GitHub workflow to update blend data
        const githubResponse = await fetch(REPO_URL, {
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
        });

        if (!githubResponse.ok) {
          const errorText = await githubResponse.text();
          throw new Error(`Failed to trigger GitHub workflow: ${errorText}`);
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
}; 