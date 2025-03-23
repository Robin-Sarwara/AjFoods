import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center fixed inset-0">
      <ClipLoader color="#3498db" size={75} cssOverride={{ borderWidth: "8px" }} />
    </div>
  );
};

export default Spinner;
