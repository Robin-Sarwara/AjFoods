import React, { useEffect, useState } from "react";
import axios from "axios";
import { Flag, MoreVertical } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Swal from "sweetalert2";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import axiosInstance from "../utils/axiosInstance";
import { useRole } from "../utils/useRole";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { role, userId, setUserId } = useRole();

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const response = await axiosInstance.get("/products");
    setProducts(response.data);
    setLoading(false);
  };

  const checkAdmin = () => {
    setIsAdmin(role === "admin");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    checkAdmin();
  }, [role]);

  const handleDelete = async (id) => {
    setOpenIndex(null);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:9090/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          showSuccessToast("Product deleted successfully");
          setProducts(products.filter((product) => product._id !== id));
        }
      } catch (error) {
        showErrorToast(error.response?.data?.message || "Error deleting product");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id) => {
    navigate("/add-product", { state: { productId: id } });
  };

  const handleViewMore = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <Carousel />
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800 
          bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 animate-fade-in">
          Discover Our Products
        </h1>

        <div className="max-w-7xl mx-auto">
          {products.length >= 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((item, i) => (
                <div 
                  key={i}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl 
                    transform transition-all duration-300 hover:-translate-y-2 
                    overflow-hidden relative"
                >
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10">
                      <button 
                        onClick={() => toggle(i)} 
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>
                      {openIndex === i && (
                        <div className="absolute top-10 right-0 w-40 bg-white rounded-md 
                          shadow-lg border border-gray-100 animate-fade-in">
                          <button 
                            onClick={() => handleEdit(item._id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 
                              hover:bg-gray-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 
                              hover:bg-gray-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      className="w-full h-64 object-cover transition-transform duration-300 
                        group-hover:scale-105" 
                      src={item.thumbnail} 
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 
                      transition-all duration-300" />
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-lg font-medium text-purple-600 mt-1">
                      Rs {item.price.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => handleViewMore(item._id)}
                      className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 
                        text-white py-2 px-4 rounded-lg font-medium
                        hover:from-purple-700 hover:to-indigo-700 
                        transition-all duration-300 transform hover:scale-105"
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl md:text-3xl font-semibold text-gray-600">
                No Products Found
              </p>
              <p className="text-gray-500 mt-2">
                Check back later for exciting new items!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;