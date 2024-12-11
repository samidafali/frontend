import React from 'react';
import styles from './styles.module.css';

const CourseCard = ({ course, onSelect }) => {
  return (
    <div className={styles.courseCard}>
      <img src={course.imageUrl} alt={course.coursename} className={styles.courseImage} />
      <h3>{course.coursename}</h3>
      <p>{course.description}</p>
      <button onClick={() => onSelect(course)} className={styles.viewButton}>
        View Details
      </button>
    </div>
  );
};

export default CourseCard;
