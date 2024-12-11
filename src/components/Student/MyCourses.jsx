import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import Main from '../Main/Main';
import CourseDetails from './CourseDetails';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/students/${studentId}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(response.data?.data || []);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId, token]);

  return (
    <>
      <Main />
      <div className={styles.container}>
        {!selectedCourse ? (
          <>
            <header className={styles.header}>
              <h1 className={styles.headerTitle}>Your Courses</h1>
            </header>

            <div className={styles.gridContainer}>
              {loading && <p className={styles.loading}>Loading...</p>}
              {error && <p className={styles.error}>{error}</p>}

              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course._id}
                    className={styles.courseCard}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <h3 className={styles.courseTitle}>{course.coursename}</h3>
                    <p className={styles.courseDescription}>
                      {course.description?.slice(0, 100)}...
                    </p>
                  </div>
                ))
              ) : (
                !loading && !error && (
                  <p className={styles.placeholder}>No courses found.</p>
                )
              )}
            </div>
          </>
        ) : (
          <CourseDetails course={selectedCourse} onBack={() => setSelectedCourse(null)} />
        )}
      </div>
    </>
  );
};

export default MyCourses;
