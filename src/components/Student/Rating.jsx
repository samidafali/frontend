import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './Rating.module.css';

const Rating = ({ rating, setRating, onRate }) => {
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) {
      onRate(value); // Appeler la fonction de notation
    }
  };

  return (
    <div className={styles.rating}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
            />
            <FaStar
              className={styles.star}
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={25}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default Rating;
