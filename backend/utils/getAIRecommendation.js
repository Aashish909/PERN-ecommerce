export async function getAIRecommendation(req, res, userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Gemini API failed");
    }

    const aiResponseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Log response for debugging
    if (!aiResponseText) {
      console.error("Empty AI Response. Full Data:", JSON.stringify(data, null, 2));
    }

    const cleanedText = aiResponseText.replace(/```json|```/g, ``).trim();

    if (!cleanedText) {
      return res
        .status(500)
        .json({ success: false, message: "AI response is empty or invalid." });
    }

    let parsedProducts;
    try {
      parsedProducts = JSON.parse(cleanedText);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      console.error("Cleaned Text:", cleanedText);
      return res
        .status(500)
        .json({ success: false, message: "Failed to parse AI response" });
    }
    return { success: true, products: parsedProducts };
  } catch (error) {
    console.error("getAIRecommendation Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error." });
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