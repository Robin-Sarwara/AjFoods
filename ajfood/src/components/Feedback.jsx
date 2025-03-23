import axios from 'axios';
import React, { useState } from 'react';
import { showErrorToast, showSuccessToast } from '../utils/toastMessage';
import axiosInstance from '../utils/axiosInstance';
import { useRole } from '../utils/useRole';
import Spinner from './Spinner';
import MostAskedQuestion from './MostAskedQuestion';
import { useNavigate } from 'react-router-dom';

const Feedback = ({ id }) => {
  const { userId } = useRole();
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState({
    question: "",
  });
  const [loading, setLoading] = useState(false);
  const [refreshQuestions, setRefreshQuestions] = useState(false);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/products/${id}/feedback`, {
        question: feedbackData.question,
        userId: userId
      });
      showSuccessToast("Question submitted successfully");
      setFeedbackData({ question: "" });
      setRefreshQuestions(prev => !prev);
    } catch (error) {
      showErrorToast(error.response?.data?.error || "Failed to submit your question");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAllQues = () => {
    navigate('/user-all-questions');
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Most Asked Questions */}
          <div className="mb-8">
            <MostAskedQuestion refreshQuestions={refreshQuestions} />
          </div>

          {/* Ask Question Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 
              to-indigo-600 bg-clip-text text-transparent">
              Ask a Question
            </h2>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label 
                    htmlFor="question" 
                    className="block text-lg font-semibold text-gray-700 mb-2"
                  >
                    Your Question
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 
                      focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                      outline-none transition-all duration-300"
                    type="text"
                    name="question"
                    onChange={handleChange}
                    value={feedbackData.question}
                    placeholder="Type your question here..."
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                    text-white rounded-lg font-semibold hover:from-purple-700 
                    hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Question"}
                </button>
              </div>
            </form>

            {/* View All Questions Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUserAllQues}
                className="px-6 py-3 bg-green-600 text-white rounded-lg 
                  font-semibold hover:bg-green-700 transition-all duration-300 
                  transform hover:scale-105"
              >
                View Your Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;