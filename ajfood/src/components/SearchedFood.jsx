import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { showErrorToast } from "../utils/toastMessage";
import Spinner from "./Spinner";

const SearchedFood = () => {
  const [searchedFood, setSearchedFood] = useState([]);
  const [loading, setLoading] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get("query");

  const getSearchedFood = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/search?query=${query}`);
      setSearchedFood(response.data.results || []);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.error || "Error Fetching Searched Food"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      getSearchedFood();
    }
  }, [query]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Search Results for <span className="text-blue-600">"{query || ''}"</span>
          </h2>
          {searchedFood.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-medium">No products found for your search.</p>
              <p className="text-gray-500 mt-2">Try a different search term!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {searchedFood.map((item, i) => (
                <div
                  key={item._id || i}
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.discount && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {item.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-2xl font-bold text-green-600">
                        ₹{item.price?.toFixed(2) || "N/A"}
                      </p>
                      {item.averageRating && (
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-lg">★</span>
                          <span className="text-sm font-medium text-gray-600 ml-1">
                            {item.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleProductClick(item._id)}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transform transition-transform duration-200 hover:scale-105"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchedFood;