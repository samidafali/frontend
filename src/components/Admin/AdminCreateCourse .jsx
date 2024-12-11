import React, { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Main from "../Main/Main"; // Assuming Main is your navbar component

const AdminCreateCourse = () => {
  const [courseData, setCourseData] = useState({
    coursename: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null); // State to store selected image
  const [videos, setVideos] = useState([{ title: "", file: null }]); // State to store selected videos with titles
  const [pdfFile, setPdfFile] = useState(null); // State to store selected PDF
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Handle input changes for course data
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle video change with title input
  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
  };

  // Add more video fields
  const addVideoInputs = () => {
    setVideos([...videos, { title: "", file: null }]);
  };

  // Handle PDF upload
  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("coursename", courseData.coursename);
    formData.append("description", courseData.description);
    formData.append("category", courseData.category);

    if (image) {
      formData.append("image", image);
    }

    videos.forEach((video, index) => {
      if (video.file) {
        formData.append(`videos`, video.file);
        formData.append(`videoTitles[]`, video.title);
      }
    });

    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    axios
      .post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Course created successfully:", response.data);
        setSuccessMessage("Course created successfully!");
        setCourseData({ coursename: "", description: "", category: "" });
        setImage(null);
        setVideos([{ title: "", file: null }]);
        setPdfFile(null);
      })
      .catch((error) => {
        console.error("Error creating course:", error);
      });
  };

  return (
    <div>
      <Main />
      <div className={styles.create_course_container}>
        <h2>Create a New Course</h2>

        {/* Display success message if exists */}
        {successMessage && <p className={styles.success_message}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {/* Course name */}
          <input
            type="text"
            name="coursename"
            placeholder="Course Name"
            value={courseData.coursename}
            onChange={handleChange}
            required
            className={styles.input}
          />

          {/* Course description */}
          <textarea
            name="description"
            placeholder="Course Description"
            value={courseData.description}
            onChange={handleChange}
            required
            className={styles.textarea}
          />

          {/* Category selection */}
          <div className={styles.inputGroup}>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Course Category"
              value={courseData.category}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          {/* Image input */}
          <div className={styles.file_input}>
            <label htmlFor="image">Course Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Video inputs */}
          <div className={styles.video_inputs_container}>
            <h3>Course Videos</h3>
            {videos.map((video, index) => (
              <div key={index} className={styles.video_input_item}>
                <input
                  type="text"
                  placeholder={`Video Title ${index + 1}`}
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                  className={styles.input}
                />
                <input
                  type="file"
                  name="videos[]"
                  accept="video/*"
                  onChange={(e) => handleVideoChange(index, "file", e.target.files[0])}
                  className={styles.input}
                />
              </div>
            ))}
            {videos.length < 5 && (
              <button
                type="button"
                onClick={addVideoInputs}
                className={styles.add_video_btn}
              >
                Add Another Video
              </button>
            )}
          </div>

          {/* PDF input */}
          <div className={styles.file_input}>
            <label htmlFor="pdf">Course PDF</label>
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={handlePdfChange}
            />
          </div>

          <button type="submit" className={styles.submit_button}>
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateCourse;
