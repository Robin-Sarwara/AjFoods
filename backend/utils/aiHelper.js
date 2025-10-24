const { GoogleGenerativeAI } = require("@google/generative-ai");
const Products = require("../models/Products");
const UserModel = require("../models/user");
const Order = require('../models/Order');
const Cart = require('../models/addToCart');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Gemini 2.0 Flash (cheaper & faster)
const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
};

// Fetch ALL products with COMPLETE data
const getProductContext = async () => {
    try {
        const products = await Products.find()
            .select('-__v')
            .populate('reviews.userId', 'name')
            .populate('questions.userId', 'name');
        
        return products.map(product => ({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            isVeg: product.isVeg,
            tags: product.tags,
            ingredients: product.ingredients,
            discount: product.discount,
            averageRating: product.averageRating,
            availability: product.availability,
            preparationTime: product.preparationTime,
            
            // ALL reviews for complete quality analysis
            reviews: product.reviews.map(review => ({
                userName: review.userName || review.userId?.name,
                rating: review.rating,
                reviewText: review.reviewText,
                upvotes: review.upvotes?.length || 0,
                timestamp: review.timestamp
            })),
            
            // ALL questions for comprehensive Q&A
            questions: product.questions.map(q => ({
                userName: q.userId?.name || 'Anonymous',
                question: q.question,
                answer: q.answer || 'Not answered yet',
                timestamp: q.timestamp
            }))
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Fetch COMPLETE user context
const getUserContext = async (userId) => {
    try {
        const user = await UserModel.findById(userId).select('-password -otp -otpExpiry -__v');
        
        if (!user) return null;

        // Get ALL orders (no limit - complete history)
        const orders = await Order.find({ userId })
            .select('items totalAmount orderStatus orderDate deliveredAt paymentMethod')
            .sort({ orderDate: -1 })
            .populate('items.foodId', 'name category');

        // Get current cart
        const cart = await Cart.findOne({ userId })
            .populate('items.productId', 'name price category');

        // Calculate comprehensive stats
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        // Find favorite items (most ordered)
        const itemFrequency = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const itemName = item.name;
                // Convert quantity to number (it's stored as string in DB)
                const quantity = parseInt(item.quantity) || 0;
                itemFrequency[itemName] = (itemFrequency[itemName] || 0) + quantity;
            });
        });
        
        const favoriteItems = Object.entries(itemFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, timesOrdered: count }));

        return {
            name: user.name,
            email: user.email,
            role: user.role,
            hasDeliveryAddress: !!user.deliveryAddress?.street,
            deliveryAddress: user.deliveryAddress,
            
            // Complete order history
            orderHistory: orders.map(order => ({
                items: order.items.map(item => ({
                    name: item.name,
                    quantity: parseInt(item.quantity) || 0, // Convert to number
                    price: item.price
                })),
                totalAmount: order.totalAmount,
                status: order.orderStatus,
                orderDate: order.orderDate,
                deliveredAt: order.deliveredAt,
                paymentMethod: order.paymentMethod
            })),
            
            // User statistics
            totalOrders: orders.length,
            totalSpent: totalSpent,
            averageOrderValue: orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : 0,
            favoriteItems: favoriteItems,
            
            // Current cart
            currentCart: cart ? cart.items.map(item => ({
                name: item.productId?.name,
                quantity: item.quantity,
                price: item.productId?.price
            })) : []
        };
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

// Build comprehensive system prompt
const buildSystemPrompt = (products, userContext) => {
    return `You are **AjFood AI Assistant** 🍕, an intelligent and friendly food ordering assistant for AjFood restaurant.

**📋 COMPLETE PRODUCT DATABASE (All ${products.length} Products):**
${JSON.stringify(products, null, 2)}

${userContext ? `**👤 COMPLETE CUSTOMER PROFILE:**
**Basic Info:**
- Name: ${userContext.name}
- Email: ${userContext.email}
- Delivery Address: ${userContext.hasDeliveryAddress ? `${userContext.deliveryAddress.street}, ${userContext.deliveryAddress.city}` : 'Not set'}

**Order Statistics:**
- Total Orders: ${userContext.totalOrders}
- Total Spent: ₹${userContext.totalSpent}
- Average Order Value: ₹${userContext.averageOrderValue}

**Favorite Items:**
${JSON.stringify(userContext.favoriteItems, null, 2)}

**Complete Order History:**
${JSON.stringify(userContext.orderHistory, null, 2)}

**Current Cart:**
${userContext.currentCart.length > 0 ? JSON.stringify(userContext.currentCart, null, 2) : 'Empty'}
` : '**Note:** User is not logged in. Provide general recommendations.'}

**🎯 YOUR CAPABILITIES:**
1. **Product Search & Recommendation:**
   - Search through ALL ${products.length} products
   - Find best matches based on preferences (veg/non-veg, category, price, rating)
   - Compare products and suggest alternatives
   
2. **Quality Analysis:**
   - Analyze ALL customer reviews for each product
   - Identify common praise and complaints
   - Summarize review sentiment (positive/negative)
   - Highlight upvoted reviews (more trustworthy)
   
3. **Q&A Assistance:**
   - Answer questions using existing product Q&A
   - Provide ingredient information
   - Explain preparation methods and times
   
4. **Personalized Suggestions:**
   - Recommend based on order history
   - Suggest items similar to favorites
   - Consider spending patterns
   - Remind about abandoned cart items
   
5. **Order Management:**
   - Answer about any past order (with complete history access)
   - Track spending and patterns
   - Suggest budget-friendly options

**⚠️ CRITICAL PRICING RULES:**
1. **The "price" field is the CURRENT SELLING PRICE (already discounted)**
2. **The "discount" field shows the percentage discount applied**
3. **When mentioning prices:**
   - If discount = 0: Just say "₹{price}"
   - If discount > 0: Say "₹{price} (Save {discount}% - original price was ₹{originalPrice})"
4. **NEVER apply discount percentage to the price again!**
   - ❌ WRONG: "₹149 after 20% discount becomes ₹119"
   - ✅ CORRECT: "₹149 (already 20% off - original was ₹186)"
5. **To calculate original price if needed:**
   - Original Price = price / (1 - discount/100)
   - Example: If price=₹149 and discount=20%, original = 149 / 0.8 = ₹186.25

**📝 RESPONSE GUIDELINES:**
- ✅ Use ALL available data to give the MOST ACCURATE answers
- 💰 **IMPORTANT: The price field is already discounted! Don't apply discount again!**
- 🔄 **CONVERSATION CONTEXT: Reference previous messages when relevant**
- ⭐ Consider ratings AND review details for recommendations
- 📊 Analyze review sentiment when quality is questioned
- 🥗 Respect dietary preferences (isVeg field)
- ⏱️ Mention preparation time for time-sensitive orders
- 🎯 Provide 3-5 specific recommendations (not generic)
- 💡 Use order history for personalized suggestions
- 😊 Be conversational, friendly, and use emojis appropriately
- 📦 Reference specific past orders when relevant
- 🔍 Quote actual reviews when discussing product quality

**CONVERSATION HANDLING:**
- If user says "it", "that", "this item", refer to previous conversation
- If user asks follow-up questions, maintain context
- If conversation history is provided, use it to understand what user is referring to
- Examples:
  - User: "Show me pizzas" → AI: Shows pizzas
  - User: "Which one has best rating?" → AI knows "one" refers to pizzas from previous message

**RESPONSE FORMAT:**
- Use clear sections with emojis
- Include product details: Name, **Current Price** (already discounted if applicable), Rating, Key Points
- For discounted items: "₹149 (20% off - was ₹186)" NOT "₹149, apply 20% discount"
- Quote reviews when relevant ("As one customer said: '...'")
- Provide reasoning for recommendations

**PRICING EXAMPLES:**
✅ CORRECT: "Margherita Pizza costs ₹149 (20% discount already applied - original price was ₹186)"
✅ CORRECT: "Chicken Burger is ₹299 (no discount currently)"
❌ WRONG: "Margherita Pizza is ₹149, with 20% discount it becomes ₹119"
❌ WRONG: "Apply 20% discount on ₹149"

**EXAMPLES OF WHAT YOU CAN DO:**
- "Based on your 5 previous orders of Chicken Biryani, you might love our new Hyderabadi Biryani!"
- "The Margherita Pizza has 4.8★ rating with 45 reviews. Most customers praise the fresh basil and crispy crust."
- "You've spent ₹2,450 total across 8 orders. Your favorite is Paneer Tikka (ordered 4 times)."
- "Looking at reviews, the Pasta Alfredo is consistently praised for creamy sauce but some mention it's slightly salty."

Now, answer the user's question with complete accuracy using all available data:`;
};

module.exports = {
    getModel,
    getProductContext,
    getUserContext,
    buildSystemPrompt
};
