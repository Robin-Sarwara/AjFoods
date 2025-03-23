import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Spinner from "./Spinner";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { ToastContainer } from "react-toastify";
import { useRole } from "../utils/useRole";
import { MoreVertical } from "lucide-react";
import Swal from "sweetalert2";

const ProductQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refresher, setRefresher] = useState(false);
  const [answerData, setAnswerData] = useState({});
  const [editIndex, setEditIndex] = useState(null);


  const { role } = useRole();
  const { id } = useParams();

  const checkAdmin = () => {
    setIsAdmin(role === "admin");
  };

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleOnchange = (e, questionId) => {
    setAnswerData({ ...answerData, [questionId]: e.target.value });
  };

  const fetchQuestionData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/products/${id}/feedback`);
      setQuestionData(response.data.questionsData);
      console.log(response.data.questionsData);
      setLoading(false);
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          error.message ||
          "Error fetching Questions"
      );
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
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
        const response = await axiosInstance.delete(
          `/products/${id}/question/${questionId}`
        );
        console.log(response.data.message);
        showSuccessToast(response.data.message);
        setLoading(false);
        setRefresher(!refresher);
      } catch (error) {
        showErrorToast(
          error.response.data.message ||
            error.message ||
            "Error occured while deleting question"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (questionId, index) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/products/${id}/question/${questionId}/get-answer`
      );
      console.log(response.data);
      console.log(response.data.question.answer);
      setAnswerData((prev)=>({...prev, [questionId]:response.data.question.answer}))
      setOpenIndex(null)
      setEditIndex(index);
      setLoading(false);
      setRefresher(!refresher)
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          error.message ||
          "Error occurred, please try later"
      );
      setLoading(false);
    }
  };
  
  const handleAnswer = async (questionId) => {
    setLoading(true);
    if(editIndex!==null){
      try {
        const payload = {answer:answerData[questionId]};
        const response = await axiosInstance.put(`/products/${id}/question/${questionId}/update-answer`, payload)
        setAnswerData((prev)=>({...prev, [questionId]:""}))
        setLoading(false)
        setEditIndex(null)
        setRefresher(prev=>!prev)
        showSuccessToast("Answer updated successfully")
      } catch (error) {
        console.log(error)
        showErrorToast(error.response.data.message || error.message || "Error occured while updating answer")
      }
      finally{
        setLoading(false)
      }
    }
    else{
      try {
        const payload = { answer: answerData[questionId] };
        const response = await axiosInstance.post(
          `/products/${id}/question/${questionId}/answer`,
          payload
        );
        console.log(response.data);
        showSuccessToast("Answer added successfully");
        setAnswerData((prev) => ({ ...prev, [questionId]: "" }));
        setEditIndex(null)
        setLoading(false);
        setRefresher(prev=>!prev);
      } catch (error) {
        showErrorToast(
          error?.response?.data?.message ||
            error.message ||
            "An error occured while adding answer"
        );
      } finally {
        setLoading(false);
      }
    }
    
  };
  useEffect(()=>{
    checkAdmin();
  },[])

  useEffect(() => {
    fetchQuestionData();
  }, [refresher]);

  return (
    <>
      {loading && <Spinner />}
      <div className="w-full flex flex-col items-center h-full bg-gray-100">
        <h1 className="w-full text-3xl mt-5 p-2 text-center md:text-4xl font-bold">
          All asked questions:
        </h1>
        <div className="w-11/12 bg-white shadow-lg rounded-lg p-5 mt-7 h-auto">
          {questionData.length > 0 ? (
            questionData.map((item, i) => (
              <div className="mt-5 w-full" key={i}>
                {/* Header section with question and MoreVertical icon */}
                <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">Question:</span>
                    <p className="font-bold text-lg sm:text-xl md:text-2xl">
                      {item.question}
                    </p>
                  </div>
                  {isAdmin && (
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
                          <button
                            onClick={() => handleEdit(item._id,i)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Answer section */}
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-bold flex items-center text-lg">
                    Answer:
                  </span>
                  {!item.answer || item.answer.length < 1 || editIndex === i ? (
                    <div className="flex justify-between mt-2 w-[70%]">
                      <input
                        className="outline-none font-semibold rounded-md border-2 border-black p-1 w-[90%]"
                        type="text"
                        name="answer"
                        placeholder="Enter answer here"
                        onChange={(e) => handleOnchange(e, item._id)}
                        value={answerData[item._id] || ""}
                      />
                      <button
                        onClick={() => handleAnswer(item._id)}
                        className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 w-auto"
                      >
                        {item.answer ? "Save" : "Submit"}
                      </button>
                      {editIndex === i && (
                        <button
                          onClick={() => setEditIndex(null)}
                          className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-800 w-auto ml-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold text-lg sm:text-xl">
                      {item.answer}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No questions...</p>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductQuestion;
