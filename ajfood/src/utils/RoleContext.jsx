import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import { RoleContext } from "./useRole";

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialize as null if you're expecting an object
  const [userData, setuserData] = useState(null);

  const fetchUserDetails = async () => {  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get("/user-info");
      setRole(response.data.role);
      setUserEmail(response.data.email);
      setUsername(response.data.name);
      setUserId(response.data.id);
      setuserData(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUserDetails();
  }, []);
  
  return (
    <RoleContext.Provider value={{ role, setUserId, loading, userId, userEmail, setRole, username, setUserEmail, setUsername }}>
      {children}
    </RoleContext.Provider>
  );
};
