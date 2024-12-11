// Main.jsx
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "axios";
import logo from '../../images/logo.png';

const Main = ({ isHome }) => {
    const role = localStorage.getItem("role"); // Get role from localStorage after login
    const token = localStorage.getItem("token"); // Get token from localStorage
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = async () => {
        try {
            if (!token) {
                console.error("No token found, redirecting to login.");
                navigate("/login"); // Redirect if token is missing
                return;
            }
    
            // Determine the API URL based on the role
            let logoutUrl = "";
            if (role === "admin") {
                logoutUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/logout`;
            } else if (role === "teacher") {
                logoutUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/teachers/logout`;
            } else {
                console.error("Invalid role, redirecting to login.");
                navigate("/login"); // Redirect for an invalid role
                return;
            }
    
            // API call to log out the user (admin or teacher)
            const response = await axios.post(logoutUrl, {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in headers
                }
            });
    
            // Check if the logout was successful
            if (response.status === 200) {
                // Remove token and role from localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("role");
    
                // Redirect to the login page
                navigate("/login");
            } else {
                console.error("Logout failed: ", response.data);
                alert("Logout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging out", error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
            <div className={styles.logo_container}>
                    <img src={logo} alt="Logo" className={styles.logo_image} />
                    <h1 className={styles.logo_text}>LearnSphere</h1>
                </div>
                <ul className={styles.nav_links}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {isHome && !token && ( // Show Login and Signup links only if not logged in
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/signup">Signup</Link>
                            </li>
                        </>
                    )}
                    {role === "admin" && (
                        <>
                            <li>
                                <Link to="/admin-dashboard">Admin Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/admin-update-course">Update Courses</Link>
                            </li>
                            <li>
                                <Link to="/admin-create-course">Create Course</Link>
                            </li>
                           
                            
                        </>
                    )}
                    {role === "teacher" && (
                        <>
                            <li>
                                <Link to="/teacher-dashboard">Teacher Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/teacher-update-course">Update Courses</Link>
                            </li>
                            <li>
                                <Link to="/teacher-create-course">Create Course</Link>
                            </li>
                            <li>
                                <Link to="/teacher-message">message</Link>
                            </li>
                        </>
                    )}
                    {role !== "admin" && role !== "teacher" && (
                        <>
                            <li>
                                <Link to="/my-courses">My Courses</Link>
                            </li>
                            <li>
                                <Link to="/studentdashboard">Student Dashboard</Link>
                            </li>
                            
                            <li>
                                <Link to="/update">Update</Link>
                            </li>
                            <li>
                                <Link to="/contactus">Contact</Link>
                            </li>
                        </>
                    )}
                </ul>
                {token && ( // Show Logout button only if the user is logged in
                    <button className={styles.logout_btn} onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </nav>
        </div>
    );
};

export default Main;
