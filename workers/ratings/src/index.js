// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env, ctx) {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method === "POST") {
      return handlePostRequest(request, env);
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

async function handlePostRequest(request, env) {
  try {
    const data = await request.json();
    console.log("Received rating data:", JSON.stringify(data));
    
    // Validate required fields
    if (!data.blendKey || !data.ratings) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // Generate a unique ID for this rating
    const ratingId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    // Prepare the rating object
    const ratingObject = {
      id: ratingId,
      blendKey: data.blendKey,
      ratings: data.ratings,
      timestamp: timestamp,
      // Include other fields if provided
      userName: data.userName || "Anonymous",
      userEmail: data.userEmail || "",
      comments: data.comments || ""
    };
    
    console.log("Storing rating with ID:", ratingId);
    
    // Store in KV
    await env.RATINGS_KV.put(`rating:${ratingId}`, JSON.stringify(ratingObject));
    
    // Also store in a list for this blend
    let blendRatings = [];
    const existingRatings = await env.RATINGS_KV.get(`blend:${data.blendKey}`);
    
    if (existingRatings) {
      try {
        blendRatings = JSON.parse(existingRatings);
      } catch (e) {
        console.error("Error parsing existing ratings:", e);
      }
    }
    
    blendRatings.push(ratingId);
    await env.RATINGS_KV.put(`blend:${data.blendKey}`, JSON.stringify(blendRatings));
    
    console.log("Successfully stored rating and updated blend list");
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Rating submitted successfully",
      ratingId: ratingId
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to process rating", 
      details: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
}