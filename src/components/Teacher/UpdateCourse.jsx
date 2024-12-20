import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Main from "../Main/Main"; // Assuming Main is your navbar component

const UpdateCourse = () => {
  const [allCourses, setAllCourses] = useState([]); // List of all courses
  const [selectedCourseId, setSelectedCourseId] = useState(""); // Selected course ID
  const [courseData, setCourseData] = useState({
    coursename: "",
    description: "",
    schedule: [],
    difficulty: "easy", // Default difficulty
    isFree: "true", // Default to free course
    price: "", // Price for paid courses
    category: "", // New field for category
    image: null, // Course image
  });
  const [videos, setVideos] = useState([{ title: "", file: null }]); // Dynamic video fields
  const [pdf, setPdf] = useState(null); // State to handle PDF upload
  const [error, setError] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true); // Loading state for courses
  const [loadingDetails, setLoadingDetails] = useState(false); // Loading state for course details
  const [updateSuccess, setUpdateSuccess] = useState(false); // State for success message

  // Fetch all courses for the dropdown
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses`);
        setAllCourses(response.data.data);
        setLoadingCourses(false);
      } catch (error) {
        setError("Failed to fetch courses");
        setLoadingCourses(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Fetch the selected course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!selectedCourseId) return;

      try {
        setLoadingDetails(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${selectedCourseId}`);
        setCourseData(response.data);
        setLoadingDetails(false);
      } catch (error) {
        setError("Failed to fetch course details");
        setLoadingDetails(false);
      }
    };

    fetchCourseDetails();
  }, [selectedCourseId]);

  const handleCourseSelect = (e) => {
    setSelectedCourseId(e.target.value);
    setError(null); // Reset error on new course selection
    setUpdateSuccess(false); // Hide success message when a new course is selected
  };

  const handleInputChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.files[0], // Handle single file (for image)
    });
  };

  const handlePdfChange = (e) => {
    setPdf(e.target.files[0]); // Handle PDF file input
  };

  // Handle video fields changes
  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
  };

  // Add more video fields
  const addVideoInputs = () => {
    setVideos([...videos, { title: "", file: null }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourseId) {
      setError("Please select a course to update.");
      return;
    }

    const formData = new FormData();
    formData.append("coursename", courseData.coursename);
    formData.append("description", courseData.description);
    formData.append("schedule", JSON.stringify(courseData.schedule));
    formData.append("difficulty", courseData.difficulty);
    formData.append("isFree", courseData.isFree);
    formData.append("category", courseData.category); // Append category
    if (courseData.isFree === "false") {
      formData.append("price", courseData.price);
    }

    // Append image if selected
    if (courseData.image) {
      formData.append("image", courseData.image);
    }

    // Append videos and titles
    videos.forEach((video, index) => {
      if (video.file) {
        formData.append(`videos`, video.file);
        formData.append(`videoTitles[]`, video.title); // Append the corresponding title
      }
    });

    // Append PDF if selected
    if (pdf) {
      formData.append("pdf", pdf); // Append the PDF file
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${selectedCourseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUpdateSuccess(true); // Show success message
      setError(null); // Clear any previous errors
      console.log("Course updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating course:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.message || "Failed to update the course");
      } else if (error.request) {
        // Request was made but no response received
        setError("No response from server");
      } else {
        // Something else caused the error
        setError("An unexpected error occurred");
      }
      setUpdateSuccess(false); // Hide success message if there's an error
    }
  };

  return (
    <>
      <Main />
      <div className={styles.update_course_container}>
        <h2>Update Course</h2>

        {/* Success Message */}
        {updateSuccess && <p className={styles.success}>Course updated successfully!</p>}

        {/* Error Display */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Dropdown to select a course */}
        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : (
          <div className={styles.dropdown_container}>
            <label htmlFor="courseSelect">Select a course to update:</label>
            <select
              id="courseSelect"
              onChange={handleCourseSelect}
              value={selectedCourseId}
              className={styles.select}
            >
              <option value="" disabled>
                -- Choose a course --
              </option>
              {allCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.coursename}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Course Update Form */}
        {loadingDetails ? (
          <p>Loading course details...</p>
        ) : (
          selectedCourseId && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="coursename"
                placeholder="Course Name"
                value={courseData.coursename}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
              <textarea
                name="description"
                placeholder="Course Description"
                value={courseData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                required
              />

              <label htmlFor="difficulty">Difficulty</label>
              <select
                name="difficulty"
                value={courseData.difficulty}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <label htmlFor="isFree">Is this course free?</label>
              <select
                name="isFree"
                value={courseData.isFree}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              {courseData.isFree === "false" && (
                <input
                  type="number"
                  name="price"
                  placeholder="Course Price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              )}

              <label htmlFor="category">Category</label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                {/* Add more categories as needed */}
              </select>

              <label htmlFor="image">Upload Image</label>
              <input type="file" name="image" onChange={handleFileChange} className={styles.file_input} />

              <label htmlFor="pdf">Upload Course PDF</label>
              <input type="file" name="pdf" onChange={handlePdfChange} className={styles.file_input} />

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
                    />
                    <input
                      type="file"
                      name="videos[]"
                      accept="video/*"
                      onChange={(e) => handleVideoChange(index, "file", e.target.files[0])}
                    />
                  </div>
                ))}
                {videos.length < 5 && (
                  <button type="button" onClick={addVideoInputs} className={styles.add_video_btn}>
                    Add Another Video
                  </button>
                )}
              </div>

              <button type="submit" className={styles.submit_button}>
                Update Course
              </button>
            </form>
          )
        )}
      </div>
    </>
  );
};

export default UpdateCourse;
