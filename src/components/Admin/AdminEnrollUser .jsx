import React, { useState } from "react";
import axios from "axios";
import Main from "../Main/Main"; // Assuming Main is your navbar component

const AdminEnrollUser = ({ courseId }) => {
  const [userId, setUserId] = useState("");

  const handleEnrollUser = () => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/enroll`, { userId })
      .then((response) => {
        console.log("User enrolled successfully");
      })
      .catch((error) => {
        console.error("Error enrolling user:", error);
      });
  };

  return (
    <div>
      <Main/>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleEnrollUser}>Enroll User</button>
    </div>
  );
};

export default AdminEnrollUser;
