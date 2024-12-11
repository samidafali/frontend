import React, { useState, useEffect } from "react";
import axios from "axios";
import Main from "../Main/Main";
import styles from "./styles.module.css";

const AdminUpdateCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseData, setCourseData] = useState({});
  const [image, setImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Récupérer tous les cours au chargement
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCourses(res.data.data || []))
      .catch(() =>
        setStatusMessage({ type: "error", text: "Erreur lors du chargement des cours." })
      );
  }, []);

  // Récupérer les détails d'un cours sélectionné
  const fetchCourseDetails = (courseId) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCourseData(res.data.data))
      .catch(() =>
        setStatusMessage({ type: "error", text: "" })
      );
  };

  // Gestion de la sélection du cours
  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    if (courseId) fetchCourseDetails(courseId);
  };

  // Gestion des modifications dans les inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de l'image
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Envoi des modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(courseData).forEach((key) => formData.append(key, courseData[key]));
    if (image) formData.append("image", image);

    axios
      .put(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${selectedCourseId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() =>
        setStatusMessage({ type: "success", text: "Le cours a été mis à jour avec succès." })
      )
      .catch(() =>
        setStatusMessage({ type: "error", text: "Erreur lors de la mise à jour du cours." })
      );
  };

  return (
    <div>
      <Main />
      <div className={styles.container}>
        <h2>Gestion des cours</h2>

        {statusMessage.text && (
          <p
            className={
              statusMessage.type === "error" ? styles.errorMessage : styles.successMessage
            }
          >
            {statusMessage.text}
          </p>
        )}

        <select
          value={selectedCourseId || ""}
          onChange={handleCourseSelect}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Sélectionnez un cours
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.coursename}
            </option>
          ))}
        </select>

        {selectedCourseId && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="coursename"
              value={courseData.coursename || ""}
              onChange={handleInputChange}
              placeholder="Nom du cours"
              className={styles.input}
            />
            <textarea
              name="description"
              value={courseData.description || ""}
              onChange={handleInputChange}
              placeholder="Description"
              className={styles.textarea}
            />

            <div className={styles.inputGroup}>
              <label htmlFor="category">Catégorie</label>
              <input
                type="text"
                name="category"
                value={courseData.category || ""}
                onChange={handleInputChange}
                placeholder="Catégorie"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="image">Image</label>
              <input type="file" name="image" onChange={handleImageChange} />
            </div>

            <button type="submit" className={styles.submitButton}>
              Mettre à jour
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminUpdateCourse;
