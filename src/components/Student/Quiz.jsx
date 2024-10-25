import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const Quiz = ({ courseId }) => {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.post(`http://localhost:5001/chat/${courseId}`, {
                    question: "Generate quiz questions for this course."
                });
                console.log("Quiz Questions Response:", response.data); // Debugging line
                
                // Ensure the correct data is being set (use response.data.mcqs)
                if (response.data && response.data.mcqs) {
                    setQuestions(response.data.mcqs);
                    setError('');
                } else {
                    setError('No quiz questions found.');
                }
            } catch (err) {
                setError('Failed to fetch quiz questions.');
                console.error(err);
            }
        };

        fetchQuiz();
    }, [courseId]);

    const handleOptionChange = (questionIndex, option) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questionIndex]: option,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted answers:', selectedOptions);
        setSubmitted(true);
    };

    return (
        <div className={styles.quiz_container}>
            <h2>Quiz for Course ID: {courseId}</h2>
            {error && <div className={styles.error_msg}>{error}</div>}
            {submitted ? (
                <div>
                    <h3>Quiz Submitted!</h3>
                    <p>Your answers have been recorded.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {questions.length > 0 ? (
                        questions.map((q, index) => (
                            <div key={index}>
                                <p>{q.question}</p>
                                {q.choices && q.choices.length > 0 ? (
                                    q.choices.map((option, i) => (
                                        <div key={i}>
                                            <input
                                                type="radio"
                                                id={`question-${index}-option-${i}`}
                                                name={`question-${index}`}
                                                value={option}
                                                onChange={() => handleOptionChange(index, option)}
                                                checked={selectedOptions[index] === option}
                                            />
                                            <label htmlFor={`question-${index}-option-${i}`}>{option}</label>
                                        </div>
                                    ))
                                ) : (
                                    <p>No answer choices available.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No quiz questions available. Please try again later.</p>
                    )}
                    <button type="submit">Submit Answers</button>
                </form>
            )}
        </div>
    );
};

export default Quiz;
