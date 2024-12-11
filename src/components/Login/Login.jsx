import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
        setError("");
        setSuccess("");
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url =
                role === "admin"
                    ? `${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/login`
                    : `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/login`;

            const response = await axios.post(url, data);
            const resData = response.data;

            const token = resData.accessToken || resData.data || resData.token;

            if (token) {
                localStorage.setItem("token", token);
            } else {
                throw new Error("Token not found in response");
            }

            localStorage.setItem("role", role);
            if (role === "admin") localStorage.setItem("adminId", resData.adminId);
            if (role === "user") localStorage.setItem("studentId", resData.studentId);

            setSuccess("Login successful!");
            if (role === "admin") window.location = "/";
            if (role === "user") window.location = "/";
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                setSuccess("");
            }
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />

                        <div className={styles.role_container}>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === "user"}
                                    onChange={handleRoleChange}
                                />
                                User
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === "admin"}
                                    onChange={handleRoleChange}
                                />
                                Admin
                            </label>
                        </div>

                        {error && <div className={styles.error_msg}>{error}</div>}
                        {success && <div className={styles.success_msg}>{success}</div>}

                        {/* Login Button */}
                        <button type="submit" className={styles.green_btn}>
                            Sign In
                        </button>

                        {/* Signup Button */}
                        <Link to="/signup">
                            <button type="button" className={styles.signup_btn}>
                                Sign Up
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
