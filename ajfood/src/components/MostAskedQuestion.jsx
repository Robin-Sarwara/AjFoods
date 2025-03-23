import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast } from "../utils/toastMessage";
import Spinner from "./Spinner";
import { useRole } from "../utils/useRole";
import AnswerApi from "../utils/AnswerApi";

const MostAskedQuestion = ({ refreshQuestions }) => {
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { role } = useRole();

  const navigate = useNavigate();

  const checkAdmin = () => {
    if (role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleSeeMore = () => {
    navigate(`/all-questions/${id}`);
  };

  const { id } = useParams();

  const fetchMostAskedQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/products/${id}/most-asked-questions`
      );
      console.log(response.data.top5Questions);
      setQuestionData(response.data.top5Questions);
      setLoading(false);
    } catch (error) {
      showErrorToast(
        error.response.data.message ||
          error.message ||
          "Error fetching Question data"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMostAskedQuestions();
  }, [refreshQuestions]);

  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <>
      {loading && <Spinner />}
      <h1 className=" w-[100%] text-3xl text-center md:text-4xl shadow-lg rounded-lg font-bold bg-white p-2">
        Most asked questions:
      </h1>
      <div className="w-[100%] shadow-lg rounded-lg bg-white p-2 mt-7 h-auto">
        {questionData.length > 0 ? (
          questionData.map((item, i) => (
            <div className="md:ml-20 mt-5 w-full" key={i}>
              <div className="flex w-[80%]  bg-blue-50 p-2 gap-4">
                <span className="font-bold flex items-center text-lg">
                  Question:
                </span>
                <p className="font-bold text-lg sm:text-xl md:text-2xl">
                  {item.question}
                </p>
              </div>
              <div className="flex gap-4">
                <span className="font-bold flex items-center text-lg">
                  Answer:
                </span>
                  <p className="font-semibold text-lg sm:text-xl">
                    {item.answer}
                  </p>
                
              </div>
            </div>
          ))
        ) : (
          <p>No questions...</p>
        )}
        <div className="w-[100%] flex justify-center mt-4 mb-2">
          <button
            onClick={handleSeeMore}
            className="p-2 text-white bg-gray-600 rounded-lg hover:bg-gray-800 w-auto"
          >
            Show All
          </button>
        </div>
      </div>
    </>
  );
};

export default MostAskedQuestion;
