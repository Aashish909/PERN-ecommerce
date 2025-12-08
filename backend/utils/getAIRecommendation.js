export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  // If no API key is set, return fallback
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY not set. Falling back to SQL-filtered results.");
    return { 
      success: false, 
      error: "AI service not configured",
      fallback: true 
    };
  }

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const geminiPrompt = `
        Here is a list of avaiable products:
        ${JSON.stringify(products, null, 2)}

        Based on the following user request, filter and suggest the best matching products:
        "${userPrompt}"

        Only return the matching products in JSON format.
    `;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Check for quota errors
      const errorMessage = data.error?.message || "Gemini API failed";
      const isQuotaError = errorMessage.includes("quota") || errorMessage.includes("Quota exceeded");
      
      console.error("Gemini API Error:", errorMessage);
      
      // Return fallback flag for quota errors
      if (isQuotaError) {
        return { 
          success: false, 
          error: "AI service quota exceeded. Using filtered results instead.",
          fallback: true 
        };
      }
      
      throw new Error(errorMessage);
    }

    const aiResponseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Log response for debugging
    if (!aiResponseText) {
      console.error("Empty AI Response. Full Data:", JSON.stringify(data, null, 2));
      return { 
        success: false, 
        error: "AI response is empty or invalid.",
        fallback: true 
      };
    }

    const cleanedText = aiResponseText.replace(/```json|```/g, ``).trim();

    if (!cleanedText) {
      return { 
        success: false, 
        error: "AI response is empty or invalid.",
        fallback: true 
      };
    }

    let parsedProducts;
    try {
      parsedProducts = JSON.parse(cleanedText);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      console.error("Cleaned Text:", cleanedText);
      return { 
        success: false, 
        error: "Failed to parse AI response",
        fallback: true 
      };
    }
    return { success: true, products: parsedProducts };
  } catch (error) {
    console.error("getAIRecommendation Error:", error.message);
    // Return fallback instead of throwing
    return { 
      success: false, 
      error: error.message || "AI service unavailable",
      fallback: true 
    };
  }
}



// curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \
//   -H 'Content-Type: application/json' \
//   -H 'X-goog-api-key: AIzaSyD95nWHyBJCpOQEqGphnqerMmqupwW9cE8' \
//   -X POST \
//   -d '{
//     "contents": [
//       {
//         "parts": [
//           {
//             "text": "Explain how AI works in a few words"
//           }
//         ]
//       }
//     ]
//   }'