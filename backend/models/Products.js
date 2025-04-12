const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrls: { type: [String], required: true },
  thumbnail: { type: String, required: true },
  tags: { type: [String] },
  isVeg: { type: Boolean, required: true },
  ingredients: { type: [String] },

  questions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      question: { type: String, required: true },
      answer: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],

  reviews: [
    {
      userName: { type: String },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      reviewText: { type: String },
      timestamp: { type: Date, default: Date.now },
      upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    },
  ],

  averageRating: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  discount: { type: Number, default: 0 },
  preparationTime: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to normalize tags: convert each tag to lowercase
productSchema.pre("save", function (next) {
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags.map((tag) => tag.toLowerCase());
  }
  next();
});

// If you're also updating the product via methods like findOneAndUpdate,
// consider adding a middleware or manually normalizing the tags in your update logic.

module.exports = mongoose.model("Product", productSchema);
