import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "../utils/useRole";
import StarRating from "./StarRating";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import Spinner from "./Spinner";
import { FaArrowUp } from "react-icons/fa";
import { MoreVertical } from "lucide-react";
import Swal from "sweetalert2";

const AllReviews = () => {
  const { userId, username, role } = useRole();

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState('')
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState({ review: [] });
  const [refresher, setRefresher] = useState(false);
  const [upvotedReviews, setUpvotedReviews] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [reviewId, setReviewId] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleEdit = (reviewText, rating) => {
    setLoading(true);
    setRating(rating);
    setReview(reviewText);
    setLoading(false);
    setOpenIndex(null);
    setCheckUpdate(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (checkUpdate) {
      try {
        const response = await axiosInstance.put(
          `/products/review/${reviewId}`,
          {
            newRating: rating,
            newReviewText: review,
            userId,
          }
        );
        console.log(response.data);
        setLoading(false);
        setReview("");
        setRefresher((prev) => !prev);
        setRating(0);
        showSuccessToast("Review updated successfully");
      } catch (error) {
        showErrorToast(
          error?.response?.data?.message ||
            error.message ||
            "Error occured while updating your review"
        );
      } finally {
        setLoading(false);
        setRating("");
        setReview("");
        setCheckUpdate(false);
      }
    } else {
      try {
        const response = await axiosInstance.post(`/products/${id}/review`, {
          userId,
          userName: username,
          reviewText: review,
          rating,
        });
        showSuccessToast(
          response?.data?.message || "Review added successfully"
        );
        setLoading(false);
        setReview("");
        setRefresher((prev) => !prev);
        setRating(0);
        setReviewId("");
      } catch (error) {
        showErrorToast(
          error?.response?.data?.error ||
            error.message ||
            "Error occured while adding your review"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    setOpenIndex(null);
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
        const response = await axiosInstance.delete(`/products/review/${id}`, {
          data: {
            userId,
            role,
          },
        });
        console.log(response.data);
        showSuccessToast(
          response.data.message || "Review deleted successfully"
        );
        setRefresher((prev) => !prev);
        setLoading(false);
      } catch (error) {
        showErrorToast(error.response.data.message || "Internal server error");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchReview = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/products/${id}/review`
      );
      setReviewData(response.data);
      const updatedUpvoted = {};
      response.data.review.forEach((review) => {
        updatedUpvoted[review._id] = review.upvotes.includes(userId);
      });
      setUpvotedReviews(updatedUpvoted);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.error ||
          "An error occurred while fetching product reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reviewId) => {
    setLoading(true);
    const isUpvoted = upvotedReviews[reviewId] || false;
    if (!isUpvoted) {
      try {
        const response = await axiosInstance.post(
          `products/review/${reviewId}`,
          { userId }
        );
        console.log(response.data);
        setUpvotedReviews((prev) => ({ ...prev, [reviewId]: true }));
        setRefresher((prev) => !prev);
        setLoading(false);
      } catch (error) {
        showErrorToast(error.response.data.message || "Internal server error");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axiosInstance.delete(
          `/products/review/${reviewId}/remove-upvote`,
          { data: { userId } }
        );
        console.log(response.data);
        setLoading(false);
        setUpvotedReviews((prev) => ({ ...prev, [reviewId]: false }));
        setRefresher((prev) => !prev);
      } catch (error) {
        showErrorToast(error.response.data.message || "Internal server error");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);
  useEffect(() => {
    fetchReview();
  }, [refresher]);

  return (
    <>
      {loading && <Spinner />}
      <div className=" p-4 h-auto w-[100%] ">   
        <h1 className="text-4xl font-bold text-center">All Reviews</h1>
        <div className="w-[100%] shadow-lg rounded-lg bg-white p-2 mt-7 h-auto">
          {reviewData.review.length > 0 ? (
            reviewData.review.map((item, i) => (
              <div
                className="md:ml-20 flex flex-col mb-20 mt-5 w-[100%]"
                key={i}
              >
                <div className="flex flex-col max-w-[80%] break-all whitespace-normal h-auto bg-blue-50 p-2 gap-4">
                  <StarRating rating={item.rating} />
                  <div className="flex w-[100%] justify-between">
                    <p className="font-bold text-lg sm:text-xl md:text-2xl">
                      {item.reviewText}
                    </p>
                    {(role === "admin" || item.userId === userId) ?(
                    <div className="relative">
                      <button onClick={() => toggle(i)} className="p-1">
                        <MoreVertical size={24} />
                      </button>
                      {openIndex === i && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                          {item.userId===userId &&
                          <button
                            onClick={() => {
                              handleEdit(item.reviewText, item.rating, i);
                              setReviewId(item._id);
                              console.log("Review ID:", item._id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>}
                        </div>
                      )}
                    </div>):null
                    }
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold flex items-center text-sm">
                    by:
                  </span>
                  <p className="font-semibold text-sm sm:text-md">
                    {item.userName ? item.userName : "user" + item.userId}
                  </p>
                </div>
                <span className="mt-2">
                  <button
                    onClick={() => handleUpvote(item._id)}
                    className={`flex border-2 rounded-md border-gray-400 p-1 ${
                      upvotedReviews[item._id] ? "bg-blue-200" : "bg-white"
                    }`}
                  >
                    <FaArrowUp size={20} /> Helpful
                  </button>

                  <p className="text-gray-700">
                    {item.upvotes.length} people found this helpful
                  </p>
                </span>
              </div>
            ))
          ) : (
            <p>No Reviews...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllReviews;
