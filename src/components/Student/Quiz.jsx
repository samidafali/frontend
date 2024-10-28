import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = ({ courseId, category }) => {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading indicator
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState([]); // Stores result feedback for each question
    const [score, setScore] = useState(0); // Stores the score out of 10
    const [recommendedCourses, setRecommendedCourses] = useState([]); // Stores recommended courses

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_QUIZ_BASE_URL}/chat/${courseId}`,
                    { question: "Generate quiz questions for this course." },
                    { timeout: 350000 } // 15 seconds timeout
                );
                console.log("Quiz response data:", response.data); // Debug log

                if (response.data && response.data.mcqs && response.data.mcqs.length > 0) {
                    setQuestions(response.data.mcqs);
                    setError('');
                } else {
                    setError('No quiz questions found.');
                }
            } catch (err) {
                setError('Failed to fetch quiz questions.');
                console.error("Error fetching quiz:", err);
            } finally {
                setLoading(false); // Stop loading
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Calculate the results and score
        const calculatedResults = questions.map((q, index) => {
            const userAnswer = selectedOptions[index];
            const isCorrect = userAnswer === q.answer;
            return {
                question: q.question,
                correctAnswer: q.answer,
                userAnswer: userAnswer || "No answer selected",
                isCorrect
            };
        });

        const totalScore = calculatedResults.reduce((acc, result) => acc + (result.isCorrect ? 1 : 0), 0);

        setResults(calculatedResults); // Store the results
        setScore(totalScore); // Store the score out of 10
        setSubmitted(true); // Set submitted state to true

        // Fetch recommended courses based on the score and category
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/recommendations`, {
                params: { score: totalScore, category }
            });
            console.log("Recommended courses response:", response.data.data); // Debug log
            setRecommendedCourses(response.data.data);
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
        }
    };

    // Styles
    const styles = {
        quizContainer: {
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
        },
        heading: {
            fontSize: '1.8em',
            color: '#333',
            textAlign: 'center',
            marginBottom: '20px',
        },
        questionCard: {
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#F9F9F9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        },
        answerChoice: {
            margin: '5px 0',
        },
        label: {
            marginLeft: '10px',
            fontSize: '1em',
            color: '#555',
            cursor: 'pointer',
        },
        errorMsg: {
            color: '#D8000C',
            backgroundColor: '#FFD2D2',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center',
            marginBottom: '15px',
        },
        button: {
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            fontSize: '1em',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            marginTop: '20px',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        resultItem: {
            padding: '15px',
            marginBottom: '15px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#FAFAFA',
        },
        correct: {
            color: '#28a745',
            fontWeight: 'bold',
        },
        incorrect: {
            color: '#dc3545',
            fontWeight: 'bold',
        },
        scoreDisplay: {
            fontSize: '1.5em',
            color: '#333',
            textAlign: 'center',
            marginTop: '20px',
        },
        recommendations: {
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f1f1f1',
            borderRadius: '8px',
        },
        recommendationItem: {
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#e0e0e0',
            borderRadius: '5px',
        },
    };

    return (
        <div style={styles.quizContainer}>
            <h2 style={styles.heading}>Quiz for Course ID: {courseId}</h2>
            {error && <div style={styles.errorMsg}>{error}</div>}
            {loading ? (
                <p>Loading quiz questions, please wait...</p>
            ) : submitted ? (
                <div>
                    <h3 style={styles.heading}>Quiz Results</h3>
                    {results.map((result, index) => (
                        <div key={index} style={styles.resultItem}>
                            <p><strong>Question:</strong> {result.question}</p>
                            <p><strong>Your Answer:</strong> {result.userAnswer}</p>
                            <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                            <p style={result.isCorrect ? styles.correct : styles.incorrect}>
                                {result.isCorrect ? "Correct" : "Incorrect"}
                            </p>
                        </div>
                    ))}
                    <h3 style={styles.scoreDisplay}>Your Score: {score} / 10</h3>

                    {/* Display Recommended Courses */}
                    {recommendedCourses.length > 0 && (
                        <div style={styles.recommendations}>
                            <h3>Recommended Courses</h3>
                            {recommendedCourses.map((course, index) => (
                                <div key={index} style={styles.recommendationItem}>
                                    <h4>{course.coursename}</h4>
                                    <p>{course.description}</p>
                                    <p><strong>Difficulty:</strong> {course.difficulty}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {questions.length > 0 ? (
                        questions.map((q, index) => (
                            <div key={index} style={styles.questionCard}>
                                <p>{q.question}</p>
                                {q.choices && q.choices.length > 0 ? (
                                    q.choices.map((option, i) => (
                                        <div key={i} style={styles.answerChoice}>
                                            <input
                                                type="radio"
                                                id={`question-${index}-option-${i}`}
                                                name={`question-${index}`}
                                                value={option}
                                                onChange={() => handleOptionChange(index, option)}
                                                checked={selectedOptions[index] === option}
                                            />
                                            <label htmlFor={`question-${index}-option-${i}`} style={styles.label}>{option}</label>
                                        </div>
                                    ))
                                ) : (
                                    <p>No answer choices available.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Generating quiz may take a few minutes.</p>
                    )}
                    <button 
                        type="submit" 
                        style={styles.button}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                    >
                        Submit Answers
                    </button>
                </form>
            )}
        </div>
    );
};

export default Quiz;
