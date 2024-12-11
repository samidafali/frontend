import React, { useState } from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import styles from './ChatWithCourse.module.css';

const ChatWithCourse = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false); // Toggle chat visibility

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `http://127.0.0.1:5000/chat`, // Remplacez par l'URL correcte
        { question },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setError('Failed to get response from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <button
        onClick={() => setIsChatVisible(!isChatVisible)}
        className={styles.toggleButton}
      >
        {isChatVisible ? 'Hide Chat' : 'Show Chat'}
      </button>

      {isChatVisible && (
        <div className={styles.chatBox}>
          <h2 className={styles.chatTitle}>Chat with GPT</h2>
          <form onSubmit={handleQuestionSubmit} className={styles.chatForm}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question..."
              className={styles.chatInput}
            />
            <button type="submit" className={styles.chatButton}>
              Send
            </button>
          </form>

          {loading && (
            <div className={styles.loaderContainer}>
              <HashLoader size={50} color="#007bff" />
            </div>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {response && (
            <div className={styles.responseContainer}>
              <h3 className={styles.responseTitle}>Response:</h3>
              <p className={styles.responseText}>{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWithCourse;
