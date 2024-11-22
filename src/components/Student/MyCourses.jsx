import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import Main from '../Main/Main';
import ChatWithCourse from './ChatWithCourse'; // ChatPDF functionality
import Quiz from './Quiz'; // Quiz functionality
import Footer from '../Footer/Footer';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [videosVisibility, setVideosVisibility] = useState({});
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false);

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  // Fetch enrolled courses for the student
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/students/${studentId}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(response.data.data || []);
        setError("");
      } catch (error) {
        setError("Failed to fetch your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [studentId, token]);

  // Fetch videos for a specific course
  const fetchVideosForCourse = async (courseId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/videos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.videos;
    } catch {
      setError("Failed to fetch course videos.");
      return [];
    }
  };

  // Handle course selection and fetch videos
  const handleSelectCourse = async (courseId) => {
    if (!videosVisibility[courseId]) {
      const videos = await fetchVideosForCourse(courseId);
      setVideosVisibility((prevState) => ({
        ...prevState,
        [courseId]: videos,
      }));
      setSuccess("!");
    }
    setSelectedCourseId(courseId);
    setShowQuiz(false); // Hide quiz when viewing a course
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setShowQuiz(false); // Hide quiz when going back
  };

  const handleShowQuiz = () => {
    setShowQuiz(true); // Show quiz when selected
  };

  // Fetch messages for the selected course and teacher
  const fetchMessagesFromTeacher = async (courseId, teacherId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/messages/student/${courseId}/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data.messages || []);
      setError("");
    } catch {
      setError("Failed to fetch messages from the teacher.");
    }
  };

  // Send a message to a teacher
  const sendMessage = async (courseId, teacherId) => {
    if (!messageContent.trim()) {
      setError("Message content cannot be empty.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/messages`,
        { courseId, teacherId, content: messageContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Message sent successfully!");
      setMessageContent("");
      fetchMessagesFromTeacher(courseId, teacherId);
    } catch {
      setError("Failed to send the message.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Main />
      <div className={styles.courses_container}>
        <h1>My Enrolled Courses</h1>
        {error && <div className={styles.error_msg}>{error}</div>}
        {success && <div className={styles.success_msg}>{success}</div>}
        {courses.length === 0 && <p>No courses found. You haven't enrolled in any courses yet.</p>}

        <div className={styles.courses_list}>
          {courses.map((course) => (
            <div
              key={course._id}
              className={`${styles.course_item} ${
                selectedCourseId && selectedCourseId !== course._id ? styles.hide : ''
              } ${selectedCourseId === course._id ? styles.fullscreen : ''}`}
            >
              <h3>{course.coursename}</h3>
              <p>{course.description}</p>
              {course.imageUrl && <img src={course.imageUrl} alt={course.coursename} className={styles.course_image} />}
              {course.pdfUrl && (
                <div>
                  <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">
                    Download Course PDF
                  </a>
                </div>
              )}
              {course.enrolledteacher && course.enrolledteacher.length > 0 ? (
                <p>
                  <strong>Teacher:</strong> {`${course.enrolledteacher[0].firstName} ${course.enrolledteacher[0].lastName}`}
                </p>
              ) : (
                <p className={styles.error_msg}>No teacher assigned to this course.</p>
              )}

              {selectedCourseId !== course._id && (
                <button
                  className={styles.toggle_videos_btn}
                  onClick={() => handleSelectCourse(course._id)}
                >
                  View Course
                </button>
              )}

              {selectedCourseId === course._id && (
                <>
                  <div className={styles.video_section}>
                    <h4>Course Videos</h4>
                    {videosVisibility[course._id]?.map((video, index) => (
                      <div key={index}>
                        <h4>{video.title}</h4>
                        <video controls>
                          <source src={video.url} type="video/mp4" />
                        </video>
                      </div>
                    ))}
                    <button className={styles.back_btn} onClick={handleBackToCourses}>
                      Back to Courses
                    </button>
                  </div>

                  <div className={styles.chat_section}>
                    <ChatWithCourse courseId={course._id} />
                  </div>

                  <div className={styles.messaging_section}>
                    <h4>Message Teacher</h4>
                    <textarea
                      placeholder="Type your message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      className={styles.textarea}
                    />
                    <button
                      onClick={() =>
                        course.enrolledteacher && course.enrolledteacher[0]
                          ? sendMessage(course._id, course.enrolledteacher[0]._id)
                          : setError("No teacher assigned to this course.")
                      }
                      className={styles.send_message_btn}
                    >
                      Send Message
                    </button>
                  </div>

                  <div className={styles.messages_section}>
                    <h4>Messages from Teacher</h4>
                    <button
                      onClick={() =>
                        course.enrolledteacher && course.enrolledteacher[0]
                          ? fetchMessagesFromTeacher(course._id, course.enrolledteacher[0]._id)
                          : setError("No teacher assigned to this course.")
                      }
                      className={styles.view_messages_btn}
                    >
                      View Messages
                    </button>

                    {messages.length > 0 ? (
                      <ul className={styles.messages_list}>
                        {messages.map((message) => (
                          <li key={message._id}>
                            <p><strong>Message:</strong> {message.content}</p>
                            {message.pdfUrl && (
                              <p>
                                <strong>Attachment:</strong>{" "}
                                <a href={message.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  View PDF
                                </a>
                              </p>
                            )}
                            <p><em>Sent at: {new Date(message.timestamp).toLocaleString()}</em></p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No messages received from the teacher yet.</p>
                    )}
                  </div>

                  <button className={styles.quiz_btn} onClick={handleShowQuiz}>
                    Take Quiz
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {showQuiz && selectedCourseId && (
          <Quiz courseId={selectedCourseId} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyCourses;
