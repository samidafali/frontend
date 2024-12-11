import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import ChatWithCourse from './ChatWithCourse';
import Quiz from './Quiz';
import axios from 'axios';

const CourseDetails = ({ course, onBack }) => {
  const [videos, setVideos] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${course._id}/videos`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setVideos(response.data?.videos || []);
      } catch {
        setError("Failed to load videos for this course.");
      }
    };

    fetchVideos();
  }, [course._id]);

  const toggleVideos = () => {
    setShowVideos((prev) => !prev);
  };

  return (
    <div className={styles.courseDetails}>
      <button onClick={onBack} className={styles.backButton}>
        Back to Courses
      </button>
      <h2>{course.coursename}</h2>
      <p>{course.description}</p>

      <div className={styles.actions}>
        {course.pdfUrl && (
          <a
            href={course.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.actionButton}
          >
            Download PDF
          </a>
        )}
       
        <button
          onClick={toggleVideos}
          className={styles.actionButton}
        >
          {showVideos ? "Masquer les vidéos" : "Afficher les vidéos"}
        </button>
      </div>

      {showQuiz && <Quiz courseId={course._id} />}
      <ChatWithCourse courseId={course._id} />

      {showVideos && (
        <div className={styles.videoSection}>
          <h3>Course Videos</h3>
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={index} className={styles.videoItem}>
                <h5>{video.title || `Video ${index + 1}`}</h5>
                <video controls className={styles.videoPlayer}>
                  <source src={video.url} type="video/mp4" />
                </video>
              </div>
            ))
          ) : (
            <p>{error || "No videos available."}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
