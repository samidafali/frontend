import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all courses on component mount
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setCourses(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  // Function to handle course approval or rejection
  const handleApproveReject = (courseId, isapproved) => {
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/approve`,
        { isapproved },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId ? { ...course, isapproved } : course
          )
        );
        setSuccessMessage(`Course ${isapproved ? "approved" : "rejected"} successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error(`Error ${isapproved ? "approving" : "rejecting"} course:`, error);
      });
  };

  // Function to handle course deletion
  const handleDelete = (courseId) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setSuccessMessage("Course deleted successfully!");
        setCourses(courses.filter((course) => course._id !== courseId));
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };

  return (
    <div className={styles.coursesContainer}>
      <h2>Manage Courses</h2>

      {/* Success message */}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

      {courses.length > 0 ? (
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <div key={course._id} className={styles.courseCard}>
              <h3 className={styles.courseTitle}>{course.coursename}</h3>
              <p className={styles.courseDescription}>{course.description}</p>
              <p>
                <strong>Difficulty:</strong> {course.difficulty}
              </p>
              <p>
                <strong>Price:</strong> {course.isFree ? "Free" : `$${course.price}`}
              </p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Schedule:</strong>{" "}
                {course.schedule
                  .map((s) => `${s.day}: ${s.starttime} - ${s.endtime}`)
                  .join(", ")}
              </p>
              <p>
                <strong>Approved:</strong> {course.isapproved ? "Yes" : "No"}
              </p>

              {course.imageUrl && (
                <div className={styles.imageContainer}>
                  <img src={course.imageUrl} alt="Course" className={styles.courseImage} />
                </div>
              )}

              {course.pdfUrl && (
                <div>
                  <a
                    href={course.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pdfLink}
                  >
                    View Course PDF
                  </a>
                </div>
              )}

              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleApproveReject(course._id, true)}
                  className={styles.approveBtn}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveReject(course._id, false)}
                  className={styles.rejectBtn}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default AdminCourses;
