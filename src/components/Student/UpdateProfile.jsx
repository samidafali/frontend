import { useState, useEffect } from 'react';
import axios from 'axios';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import './UpdateProfile.css'; // Import the CSS file

const UpdateProfile = () => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    // Fetch current student details on component mount
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(response.data.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };
    fetchStudentDetails();
  }, [studentId, token]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/students/${studentId}`,
        { firstName: student.firstName, lastName: student.lastName }, // Only updating first and last name
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div>
      <Main />
      <div className="container">
        <h2>Update Profile</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={student.firstName}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={student.lastName}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Email:</label>
            <input
              type="email"
              name="email"
              value={student.email}
              disabled
              className="input"
            />
          </div>
          <button type="submit" className="button">
            Update Profile
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfile;
