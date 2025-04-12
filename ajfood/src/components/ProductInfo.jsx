import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { Minus, Plus } from "lucide-react";
import Feedback from "./Feedback";
import Reviews from "./Reviews";
import { useRole } from "../utils/useRole";
import axiosInstance from "../utils/axiosInstance";
import RazorpayPayment from "./RazorpayPayment";
import RelatedProducts from "./RelatedProducts";

const ProductInfo = () => {
  const initialQuantity = 1;
  const maxQuantity = 10;
  const minQuantity = 1;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { id } = useParams();
  const { userId } = useRole();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductInfo();
  }, [id]);

  const fetchProductInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Error fetching product info");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = () => quantity > minQuantity && setQuantity(quantity - 1);
  const handleIncrement = () => quantity < maxQuantity && setQuantity(quantity + 1);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/product/${id}/addtocart`, { quantity, userId });
      setQuantity(initialQuantity);
      showSuccessToast(`${quantity} items added to cart successfully`);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => setShowPaymentModal(true);

  const handlePaymentSuccess = (response) => {
    console.log("Payment Success:", response);
    setShowPaymentModal(false);
    showSuccessToast("Order placed successfully!");
  };

  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 
        bg-white/90 rounded-full shadow-md flex items-center justify-center
        hover:bg-white transition-all duration-300"
    >
      <FaArrowLeft className="text-gray-600" />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 
        bg-white/90 rounded-full shadow-md flex items-center justify-center
        hover:bg-white transition-all duration-300"
    >
      <FaArrowRight className="text-gray-600" />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
        {product ? (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-[400px] md:h-[500px] object-cover 
                    transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                {product.discount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white 
                    px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Description:</span> {product.description}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Ingredients:</span>{" "}
                    {product.ingredients?.join(", ")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Veg:</span>{" "}
                    <span className={product.isVeg ? "text-green-600" : "text-red-600"}>
                      {product.isVeg ? "Yes" : "No"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-4xl font-bold text-purple-600">
                    ₹{product.price.toLocaleString()}
                  </p>
                  {product.discount > 0 && (
                    <span className="text-gray-500 line-through">
                      ₹{(product.price / (1 - product.discount / 100)).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Quantity Selector & Buttons */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
                    <button 
                      onClick={handleDecrement}
                      disabled={quantity <= minQuantity}
                      className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button 
                      onClick={handleIncrement}
                      disabled={quantity >= maxQuantity}
                      className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 bg-purple-600 text-white 
                      px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300"
                  >
                    <FaShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                    text-white py-3 rounded-lg font-semibold hover:from-indigo-700 
                    hover:to-purple-700 transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Image Slider */}
            {product.imageUrls?.length > 0 && (
              <div className="max-w-4xl mx-auto mt-12">
                <Slider {...settings}>
                  {product.imageUrls.map((img, i) => (
                    <div key={i} className="px-4">
                      <img
                        src={img}
                        alt={`Product view ${i + 1}`}
                        className="w-full h-[300px] md:h-[400px] object-contain rounded-xl"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No product found</p>
          </div>
        )}

        {/* Related Products, Feedback, and Reviews Section */}
        <div className="max-w-6xl mx-auto mt-12 space-y-12">
          {/* Related Products with Distinct Background */}
          <div
            className="relative bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100 
              py-12 px-6 rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-80 h-80 bg-purple-300 rounded-full blur-3xl -top-10 -left-10"></div>
              <div className="w-80 h-80 bg-indigo-300 rounded-full blur-3xl -bottom-10 -right-10"></div>
            </div>
            {/* Subtle Pattern Overlay */}
            <div
              className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2240%22%20height=%2240%22%20viewBox=%220%200%2040%2040%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M0%200h20v20H0zM20%2020h20v20H20z%22%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22/%3E%3C/svg%3E')] 
                opacity-30"
            ></div>

            <RelatedProducts
              id={id}
              product={product}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

          <Feedback id={id} />
          <Reviews loading={loading} setLoading={setLoading} />
        </div>
      </div>

      {showPaymentModal && product && (
        <RazorpayPayment
          productName={product.name}
          productPrice={product.price * quantity}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
};

export default ProductInfo;