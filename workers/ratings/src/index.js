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
    
    // Handle both old and new data formats
    // Map the old format to the new format if needed
    let blendKey = data.blendKey;
    let ratings = data.ratings;
    
    // If using the old format (from the error message)
    if (!blendKey && data.blendId) {
      // Extract the blend key from the blendId (remove file extension)
      blendKey = data.blendId.replace(/\.json$/, '');
    }
    
    // If using the old format with a single rating value
    if (!ratings && data.rating) {
      ratings = {
        overall: data.rating
      };
      
      // If profiles are provided, add them to the ratings
      if (data.profiles) {
        if (data.profiles.strength) ratings.strength = mapTextRatingToNumber(data.profiles.strength);
        if (data.profiles.taste) ratings.taste = mapTextRatingToNumber(data.profiles.taste);
        if (data.profiles.flavoring) ratings.flavoring = mapTextRatingToNumber(data.profiles.flavoring);
        if (data.profiles.roomNote) ratings.roomNote = mapTextRatingToNumber(data.profiles.roomNote);
      }
    }
    
    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!blendKey) missingFields.push("blendKey");
    if (!ratings || Object.keys(ratings).length === 0) missingFields.push("ratings");
    
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
      blendKey: blendKey,
      ratings: ratings,
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
    const existingRatings = await env.RATINGS_KV.get(`blend:${blendKey}`);
    
    if (existingRatings) {
      try {
        blendRatings = JSON.parse(existingRatings);
      } catch (e) {
        console.error("Error parsing existing ratings:", e);
      }
    }
    
    blendRatings.push(ratingId);
    await env.RATINGS_KV.put(`blend:${blendKey}`, JSON.stringify(blendRatings));
    
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

// Helper function to map text ratings to numeric values
function mapTextRatingToNumber(textRating) {
  const strengthMap = {
    'Extremely Mild': 1,
    'Very Mild': 1.5,
    'Mild': 2,
    'Mild to Medium': 2.5,
    'Medium': 3,
    'Medium to Strong': 3.5,
    'Strong': 4,
    'Very Strong': 4.5,
    'Extremely Strong': 5
  };
  
  const tasteMap = {
    'Very Mild': 1,
    'Mild': 2,
    'Mild to Medium': 2.5,
    'Medium': 3,
    'Medium to Full': 3.5,
    'Full': 4,
    'Very Full': 5
  };
  
  const flavoringMap = {
    'None Detected': 1,
    'Extremely Mild': 1.5,
    'Very Mild': 2,
    'Mild': 2.5,
    'Medium': 3,
    'Medium Plus': 3.5,
    'Strong': 4,
    'Very Strong': 4.5,
    'Extremely Strong': 5
  };
  
  const roomNoteMap = {
    'Very Pleasant': 5,
    'Pleasant': 4,
    'Pleasant to Tolerable': 3.5,
    'Tolerable': 3,
    'Tolerable to Strong': 2.5,
    'Strong': 2,
    'Very Strong': 1.5,
    'Overwhelming': 1
  };
  
  // Try to match the text rating to one of the maps
  for (const map of [strengthMap, tasteMap, flavoringMap, roomNoteMap]) {
    if (map[textRating] !== undefined) {
      return map[textRating];
    }
  }
  
  // Default to 3 (medium) if no match is found
  return 3;
}