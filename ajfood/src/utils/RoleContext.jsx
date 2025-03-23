import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { RoleContext } from "./useRole";

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)

  // Fetch user details from the backend on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axiosInstance.get("/user-info");
        setRole(response.data.role);
        setUsername(response.data.name);
        setUserId(response.data.id)
        setEmail(response.data.email)
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  

  return (
    <RoleContext.Provider value={{ role,setUserId ,userId, email, setRole, username, setUsername }}>
      {children}
    </RoleContext.Provider>
  );
};
