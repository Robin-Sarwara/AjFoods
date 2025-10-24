const { getModel, getProductContext, getUserContext, buildSystemPrompt } = require("../utils/aiHelper");

const chatWithAI = async (req, res) => {
  try {
    const { message, userId, conversationHistory = [] } = req.body;

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Fetch complete context
    console.log("Fetching product context...");
    const products = await getProductContext();
    
    console.log("Fetching user context...");
    const userContext = userId ? await getUserContext(userId) : null;

    // Build comprehensive prompt
    const systemPrompt = buildSystemPrompt(products, userContext);
    
    // Build conversation context
    let conversationContext = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\n**📜 RECENT CONVERSATION HISTORY (Last 5 messages):**\n";
      conversationHistory.forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      conversationContext += "\n**Remember this context when answering the current question.**\n";
    }
    
    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser's Current Question: ${message}`;

    console.log(`Processing query with ${products.length} products and ${conversationHistory.length} context messages...`);

    // Get AI response from Gemini
    const model = getModel();
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    console.log("AI response generated successfully");

    res.status(200).json({
      success: true,
      response: aiMessage,
      context: {
        productsAnalyzed: products.length,
        userLoggedIn: !!userId,
        hasOrderHistory: userContext?.totalOrders > 0,
        conversationLength: conversationHistory.length
      }
    });

  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error: error.message
    });
  }
};

module.exports = {
  chatWithAI
};