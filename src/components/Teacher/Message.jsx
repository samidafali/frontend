import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Main from "../Main/Main";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [file, setFile] = useState(null); // New state for PDF file
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/messages/teacher`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data.data);
      } catch (error) {
        setError("Failed to fetch messages");
        console.error(error);
      }
    };

    fetchMessages();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("messageId", selectedMessageId);
      formData.append("content", replyContent);
      if (file) {
        formData.append("pdf", file);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses/messages/reply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("Reply sent successfully!");
      setReplyContent("");
      setFile(null);
      setSelectedMessageId(null);
    } catch (error) {
      setError("Failed to send reply.");
      console.error(error);
    }
  };

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!messages || messages.length === 0) {
    return <p>No messages received</p>;
  }

  return (
    <>
      <Main />
      <div className={styles.message_container}>
    <h2>Messages</h2>
    {successMessage && <p className={styles.success_message}>{successMessage}</p>}
    {error && <p className={styles.error_message}>{error}</p>}

    <ul className={styles.messages_list}>
        {messages.map((message) => (
            <li key={message._id} className={styles.message_item}>
                <p>
                    <strong>From:</strong> {message.sender.firstName} {message.sender.lastName}
                </p>
                <p>
                    <strong>Course:</strong> {message.course.coursename}
                </p>
                <p>
                    <strong>Message:</strong> {message.content}
                </p>
                {message.pdfUrl && (
                    <p>
                        <strong>Attachment:</strong>{" "}
                        <a href={message.pdfUrl} target="_blank" rel="noopener noreferrer">
                            View PDF
                        </a>
                    </p>
                )}
                {selectedMessageId === message._id ? (
                    <form onSubmit={handleReplySubmit} className={styles.reply_form}>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Type your reply here"
                            className={styles.reply_input}
                        />
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className={styles.file_input}
                        />
                        <button type="submit" className={styles.reply_button}>
                            Send Reply
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedMessageId(null)}
                            className={styles.cancel_button}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setSelectedMessageId(message._id)}
                        className={styles.reply_button}
                    >
                        Reply
                    </button>
                )}
            </li>
        ))}
    </ul>
</div>

    </>
  );
};

export default Message;
