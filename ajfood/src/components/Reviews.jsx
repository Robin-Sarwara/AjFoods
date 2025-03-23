import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "../utils/useRole";
import StarRating from "./StarRating";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { FaArrowUp } from "react-icons/fa";
import { MoreVertical } from "lucide-react";
import Swal from "sweetalert2";

const Reviews = ({ loading, setLoading }) => {
  const { userId, username, role } = useRole();
  const navigate = useNavigate();
  const { id } = useParams();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState({ reviews: [] });
  const [refresher, setRefresher] = useState(false);
  const [upvotedReviews, setUpvotedReviews] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [reviewId, setReviewId] = useState("");

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const handleEdit = (reviewText, rating, id) => {
    setRating(rating);
    setReview(reviewText);
    setReviewId(id);
    setCheckUpdate(true);
    setOpenIndex(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (checkUpdate) {
        await axiosInstance.put(`/products/review/${reviewId}`, {
          newRating: rating,
          newReviewText: review,
          userId,
        });
        showSuccessToast("Review updated successfully");
      } else {
        const response = await axiosInstance.post(`/products/${id}/review`, {
          userId,
          userName: username,
          reviewText: review,
          rating,
        });
        showSuccessToast(response?.data?.message || "Review added successfully");
      }
      setReview("");
      setRating(0);
      setCheckUpdate(false);
      setRefresher((prev) => !prev);
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axiosInstance.delete(`/products/review/${id}`, { data: { userId, role } });
        showSuccessToast("Review deleted successfully");
        setRefresher((prev) => !prev);
      } catch (error) {
        showErrorToast(error?.response?.data?.message || "Error deleting review");
      } finally {
        setLoading(false);
        setOpenIndex(null);
      }
    }
  };

  const fetchReview = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/products/${id}/sortedReview?limit=5`);
      setReviewData(response.data);
      const updatedUpvoted = {};
      response.data.reviews.forEach((review) => {
        updatedUpvoted[review._id] = review.upvotes.includes(userId);
      });
      setUpvotedReviews(updatedUpvoted);
    } catch (error) {
      showErrorToast(error?.response?.data?.error || "Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reviewId) => {
    setLoading(true);
    try {
      if (!upvotedReviews[reviewId]) {
        await axiosInstance.post(`products/review/${reviewId}`, { userId });
        setUpvotedReviews((prev) => ({ ...prev, [reviewId]: true }));
      } else {
        await axiosInstance.delete(`/products/review/${reviewId}/remove-upvote`, {
          data: { userId },
        });
        setUpvotedReviews((prev) => ({ ...prev, [reviewId]: false }));
      }
      setRefresher((prev) => !prev);
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Error with upvote");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => navigate(`/all-reviews/${id}`);

  useEffect(() => {
    fetchReview();
  }, [refresher]);

  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center 
            bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Customer Reviews
          </h1>

          {/* Review Form */}
          <div className="space-y-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-700">Share Your Experience</h2>
            <textarea
              rows={4}
              className="w-full p-4 rounded-lg border-2 border-gray-300 focus:border-purple-500 
                focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-300"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="flex items-center justify-between flex-wrap gap-4">
              <StarRating rating={rating} onRatingChange={setRating} />
              <button
                onClick={handleSubmit}
                disabled={!review || !rating || loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                  rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkUpdate ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewData.reviews.length > 0 ? (
              reviewData.reviews.map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg p-4 relative hover:bg-gray-100 
                    transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <StarRating rating={item.rating} />
                      <p className="text-lg text-gray-800 break-words">{item.reviewText}</p>
                    </div>
                    {(role === "admin" || item.userId === userId) && (
                      <div className="relative">
                        <button
                          onClick={() => toggle(i)}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {openIndex === i && (
                          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg 
                            rounded-md border border-gray-100 z-10 animate-fade-in">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="w-full text-left px-4 py-2 text-red-600 
                                hover:bg-gray-100 transition-colors"
                            >
                              Delete
                            </button>
                            {item.userId === userId && (
                              <button
                                onClick={() => handleEdit(item.reviewText, item.rating, item._id)}
                                className="w-full text-left px-4 py-2 text-gray-700 
                                  hover:bg-gray-100 transition-colors"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-sm text-gray-600">By:</span>
                    <p className="text-sm font-medium text-gray-700">
                      {item.userName || `User${item.userId.slice(0, 6)}`}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => handleUpvote(item._id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 
                        border-gray-300 transition-all duration-300 ${
                          upvotedReviews[item._id]
                            ? "bg-purple-100 text-purple-600"
                            : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      <FaArrowUp size={16} />
                      Helpful
                    </button>
                    <p className="text-sm text-gray-600">
                      {item.upvotes.length} found this helpful
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-8">No reviews yet. Be the first!</p>
            )}
          </div>

          {/* Show All Button */}
          {reviewData.reviews.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleShowAll}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold 
                  hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                Show All Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reviews;