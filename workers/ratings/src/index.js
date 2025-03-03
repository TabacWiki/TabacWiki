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
    
    // Get client IP address
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     'unknown';
    
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
    
    // Extract the blend key
    let blendKey = data.blendKey;
    
    // If using the old format with blendId
    if (!blendKey && data.blendId) {
      // Extract the blend key from the blendId (remove file extension)
      blendKey = data.blendId.replace(/\.json$/, '');
    }
    
    // Validate required fields
    if (!blendKey) {
      return new Response(JSON.stringify({ 
        error: "Missing blend identifier", 
        receivedData: data
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // Check if this IP has already rated this blend
    const ipHash = await hashIP(clientIP);
    const ipBlendKey = `${ipHash}:${blendKey}`;
    
    // Get all ratings
    const allRatingsStr = await env.RATINGS_KV.get('all_ratings', { type: 'json' }) || '[]';
    let allRatings;
    try {
      allRatings = JSON.parse(allRatingsStr);
    } catch (e) {
      allRatings = [];
    }
    
    // Check if this IP has already rated this blend
    const existingRating = allRatings.find(r => r.ipBlendKey === ipBlendKey);
    if (existingRating) {
      return new Response(JSON.stringify({ 
        error: "You have already rated this blend", 
        message: "You can only submit one rating per blend"
      }), {
        status: 409, // Conflict
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    
    // Generate a unique ID for this rating
    const ratingId = crypto.randomUUID();
    const timestamp = data.timestamp || new Date().toISOString();
    
    // Prepare the rating object - store exactly what was submitted
    const ratingObject = {
      id: ratingId,
      blendKey: blendKey,
      timestamp: timestamp,
      // Store the raw data as submitted
      starRating: data.rating || null,
      profiles: data.profiles || {},
      // Include other fields if provided
      userName: data.userName || "Anonymous",
      userEmail: data.userEmail || "",
      comments: data.comments || "",
      // Store IP hash and combined key for duplicate checking
      ipHash: ipHash,
      ipBlendKey: ipBlendKey
    };
    
    // Add to all ratings
    allRatings.push(ratingObject);
    
    // Store all ratings in a single KV entry
    await env.RATINGS_KV.put('all_ratings', JSON.stringify(allRatings));
    
    console.log("Successfully stored rating");
    
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

// Helper function to hash IP address for privacy
async function hashIP(ip) {
  // Use a simple hash function for demonstration
  // In production, you might want to use a more secure method
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "TabacWikiSalt");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}