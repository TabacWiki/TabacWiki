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

    // For GET requests, return a simple status message
    if (request.method === "GET") {
      return new Response(JSON.stringify({ 
        status: "Rating service is running",
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
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
    // Log the raw request for debugging
    const clonedRequest = request.clone();
    const rawBody = await clonedRequest.text();
    console.log("Raw request body:", rawBody);
    
    // Parse the JSON data
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return new Response(JSON.stringify({ 
        error: "Invalid JSON data", 
        details: e.message,
        rawBody: rawBody.substring(0, 200) + (rawBody.length > 200 ? "..." : "")
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    console.log("Received rating data:", JSON.stringify(data));
    
    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!data.blendKey) missingFields.push("blendKey");
    if (!data.ratings) missingFields.push("ratings");
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: "Missing required fields", 
        missingFields: missingFields,
        receivedData: data
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // Generate a unique ID for this rating
    const ratingId = crypto.randomUUID();
    const timestamp = data.timestamp || new Date().toISOString();
    
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
      details: error.message,
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