import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setError("");
    setMsg("");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock success message
      setMsg("Account successfully created!");
      setError("");
    } catch (error) {
      setError("Failed to create an account. Please try again.");
      setMsg("");
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <h1>Create Your Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            value={data.firstName}
            required
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={handleChange}
            value={data.lastName}
            required
            className={styles.input}
          />
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
          {msg && <div className={styles.success_msg}>{msg}</div>}
          <button type="submit" className={styles.green_btn}>
            Sign Up
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.login_link}>
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
