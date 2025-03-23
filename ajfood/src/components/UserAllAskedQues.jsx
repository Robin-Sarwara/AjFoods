import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { MoreVertical } from "lucide-react";
import Spinner from "./Spinner";
import Swal from "sweetalert2";

const UserAllAskedQues = () => {
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState({ questions: [] });
  const [openIndex, setOpenIndex] = useState(null);
  const [refresher, setRefresher] = useState(false);
  const [openInput, setOpenInput] = useState(null);
  const [inputValue, setInputValue] = useState('')
  const [cancelButton, setCancelButton] = useState(false)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleCancel =()=>{
    setCancelButton(true)
    setOpenInput(null)
  }


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
      try {
        setLoading(true);
        const response = await axiosInstance.delete(
          `/user/asked-questions/delete/question/${id}`
        );
        setLoading(false);
        console.log(response.data);
        showSuccessToast("Question deleted successfully");
        setRefresher((prev) => !prev);
      } catch (error) {
        showErrorToast(
          error.message ||
            error?.response?.data?.message ||
            "Error occured while deleting question"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async(questionText, index) => {
    setOpenIndex(null)
    setOpenInput(index)
    setInputValue(questionText)
  };

  const handleUpdate=async(questionId)=>{
    setLoading(true)
    try {
        const response = await axiosInstance.put(`/user/asked-questions/update/question/${questionId}`,{newQuestion: inputValue})
        setLoading(false)
        showSuccessToast(response.data.message||"Question updated successfully!")
        setOpenInput(null)
        setRefresher(prev=>!prev)
    } catch (error) {
        showErrorToast(error?.response?.data?.message || error.message || "Error while updating your question")
    }
    finally{
        setLoading(false)
        setOpenInput(null)                          
    }
  }

  const fetchQuestionData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user/asked-questions");
      console.log(response.data);
      setQuestionData(response.data);
      setLoading(false);
    } catch (error) {
      showErrorToast(
        error.message ||
          error?.response?.data?.message ||
          "Error fetching questions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionData();
  }, []);
  useEffect(() => {
    fetchQuestionData();
  }, [refresher]);

  return (
    <>
      {loading && <Spinner />}
      <div className="w-[100%] h-auto flex justify-center bg-gray-100">
        <div className="w-[90%] mt-5 bg-white p-5 rounded-md shadow-lg h-auto">
          <h1 className="md:text-4xl text-2xl font font-bold text-center p-5">
            Your All Asked Questions:
          </h1>
          <div className="w-[100%] h-auto mt-10">
            {questionData.questions.map((item, i) => (
              <div
                key={i}
                className="w-[100%] bg-blue-100 shadow-md rounded-md p-2 h-auto mt-5"
              >
                <p className=" gap-2 flex m-2">
                  <span className="font-bold text-lg">Product Name :- </span>{" "}
                  <span className="md:text-xl text-lg font-semibold">
                    {item.productName}
                  </span>
                </p>
                <div className="flex ">
                  {openInput === i ? (
                    <div className="w-[100%] h-auto md:flex justify-between">
                    <form className="w-[100%] h-auto mb-4 md:m-0">
                      <input
                        className="w-[100%] md:w-[90%] p-2 rounded-lg border-2 border-black outline-none"
                        type="text"
                        name="question"
                        onChange={(e)=>setInputValue(e.target.value)}
                        value={inputValue}
                      />
                    </form>
                    <div className="flex w-[100%] md:w-auto justify-center gap-4 mr-4">
                    <button className="w-auto p-2 rounded-lg bg-green-500 text-white hover:bg-green-700" onClick={()=>handleUpdate(item.questionId)}>Update</button>
                    <button  className="w-auto p-2 rounded-lg bg-red-500 text-white hover:bg-red-700" onClick={handleCancel}>cancel</button>
                    </div>
                    </div>
                  ) : (<div className="w-[100%] h-auto flex]">
                    <p className="flex m-2 w-[100%] gap-2">
                      <span className="font-bold flex md:items-center text-lg mr-2  ">
                        Question:
                      </span>
                      <span className="md:text-xl text-lg font-semibold">
                        {item.question}
                      </span>
                    </p>
                    <p className="flex ml-2 w-[100%] gap-2">
                      <span className="font-bold flex md:items-center text-lg mr-2  ">
                        Answer:
                      </span>
                      <span className="md:text-xl text-lg flex items-center font-semibold">
                        <div>{item.answer ? (<p className="text-blue-600">{item.answer }</p>): (<p className="text-sm text-red-700">Not answered yet!</p>) }</div>
                      </span>
                    </p>
                    </div>
                    
                  )}
                  <div className="relative">
                    <button onClick={() => toggle(i)} className="p-1">
                      <MoreVertical size={24} />
                    </button>
                    {openIndex === i && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                        <button
                          onClick={() => handleDelete(item.questionId)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(item.question, i)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAllAskedQues;
