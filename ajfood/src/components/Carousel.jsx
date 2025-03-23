import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { showErrorToast } from '../utils/toastMessage';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Carousel = () => {
  const [products, setProducts] = useState([]);

  const fetchDiscountedProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/filter/discounted');
      setProducts(response.data);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Error fetching discounted products");
    }
  };

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  // Custom Prev Arrow
  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
        bg-white/90 rounded-full shadow-lg flex items-center justify-center
        hover:bg-white transition-all duration-300 group"
    >
      <FaArrowLeft className="text-gray-600 text-xl group-hover:text-purple-600 
        transition-colors duration-300" />
    </button>
  );

  // Custom Next Arrow
  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 
        bg-white/90 rounded-full shadow-lg flex items-center justify-center
        hover:bg-white transition-all duration-300 group"
    >
      <FaArrowRight className="text-gray-600 text-xl group-hover:text-purple-600 
        transition-colors duration-300" />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: "slick-dots custom-dots",
    customPaging: () => (
      <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-purple-600 
        transition-colors duration-300" />
    )
  };

  return (
    <div className="relative max-w-5xl mx-auto mt-12 mb-16 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 
          bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Hot Deals on Food Items
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Grab these discounts before they're gone!</p>
      </div>

      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
        {products.length > 0 ? (
          <Slider {...settings}>
            {products.map((product, i) => (
              <Link to={`/product/${product._id}`} key={i} className="outline-none">
                <div className="relative h-[450px] md:h-[500px] group">
                  {/* Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 
                        group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white 
                    px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {product.discount}% OFF
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 
                      drop-shadow-lg transform transition-transform duration-300 
                      group-hover:-translate-y-1">
                      {product.name}
                    </h3>
                    <p className="text-lg md:text-xl font-medium drop-shadow-md">
                      Starting at just{' '}
                      <span className="text-yellow-300">Rs {product.price.toLocaleString()}</span>
                    </p>
                    <button className="mt-4 bg-white text-purple-600 px-6 py-2 
                      rounded-full font-semibold hover:bg-purple-600 hover:text-white 
                      transition-all duration-300 transform hover:scale-105 shadow-md">
                      Shop Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        ) : (
          <div className="h-[450px] flex items-center justify-center">
            <p className="text-xl text-gray-600 animate-pulse">Loading amazing deals...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;