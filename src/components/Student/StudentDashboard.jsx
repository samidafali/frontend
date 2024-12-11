import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import HashLoader from 'react-spinners/HashLoader';
import styles from './dashboard.module.css';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = localStorage.getItem('studentId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.data || []);
      setFilteredCourses(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError("Une erreur s'est produite lors de la récupération des cours.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const isEnrolled = (course) =>
    course.enrolledUsers?.includes(studentId);

  const handleEnroll = async (courseId, isFree) => {
    try {
      if (isFree) {
        await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/${courseId}/enroll`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCourses();
      } else {
        navigate(`/payment/${courseId}`);
      }
    } catch {
      setError("Impossible de s'inscrire au cours.");
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCourses(
      courses.filter((course) =>
        course.coursename.toLowerCase().includes(term) || 
        course.category.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div>
      <Main />
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Explorez Nos Cours</h1>
          <p>Apprenez quelque chose de nouveau aujourd'hui avec nos cours interactifs et engageants.</p>
          <input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loader}>
            <HashLoader color="#007bff" size={70} />
          </div>
        ) : (
          <div className={styles.content}>
            {error && <p className={styles.error}>{error}</p>}
            {filteredCourses.length === 0 ? (
              <p className={styles.noCourses}>Aucun cours trouvé pour votre recherche.</p>
            ) : (
              <div className={styles.gridContainer}>
                {filteredCourses.map((course) => (
                  <div key={course._id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <img
                        src={course.imageUrl || '/placeholder.jpg'}
                        alt={course.coursename}
                        className={styles.cardImage}
                      />
                      <div className={styles.cardOverlay}>
                        <h3>{course.coursename}</h3>
                        <p>{course.category}</p>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <p>{course.description.slice(0, 100)}...</p>
                      <p><strong>Difficulté :</strong> {course.difficulty}</p>
                      {!course.isFree && <p className={styles.price}>Prix : ${course.price}</p>}
                    </div>
                    <div className={styles.cardFooter}>
                      {isEnrolled(course) ? (
                        <button
                          onClick={() => navigate('/my-courses')}
                          className={styles.enrollBtn}
                        >
                          Accéder au Cours
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course._id, course.isFree)}
                          className={styles.enrollBtn}
                        >
                          {course.isFree ? "S'inscrire Gratuitement" : "Payer et S'inscrire"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
