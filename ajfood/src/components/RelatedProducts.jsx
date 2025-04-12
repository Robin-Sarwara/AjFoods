import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { showErrorToast } from '../utils/toastMessage';
import Spinner from './Spinner';

const RelatedProducts = ({ id, loading, setLoading, product }) => {
  const [relatedFood, setRelatedFood] = useState([]);
  const navigate = useNavigate();

  const fetchRelatedProductsData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/related-products?tags=${product.tags.join(',')}&exclude=${id}`
      );
      setRelatedFood(response.data.relatedProducts);
    } catch (error) {
      showErrorToast(error?.response?.data?.error || 'Error fetching related products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product !== null) {
      fetchRelatedProductsData();
    }
  }, [product]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  return (
    <div className="w-full h-auto py-8">
      {loading && <Spinner />}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Related Products
      </h2>
      {relatedFood.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {relatedFood.map((item) => (
            <div
              key={item._id}
              onClick={() => handleProductClick(item._id)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
                transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Product Thumbnail */}
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                {item.discount > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white 
                    px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    {item.discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xl font-bold text-purple-600">
                    ₹{item.price.toLocaleString()}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{(item.price / (1 - item.discount / 100)).toFixed(0)}
                    </span>
                  )}
                </div>
                <button
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg 
                    text-sm font-semibold hover:bg-purple-700 transition-all duration-300"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-600">No related products found.</p>
        )
      )}
    </div>
  );
};

export default RelatedProducts;