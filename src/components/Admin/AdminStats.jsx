import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminStats.module.css"; // Ensure this CSS file exists
import Main from "../Main/Main";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_STATS}/admin/statistics`);
        console.log("API Response Data:", response.data.data); // Debugging log
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <p>Loading statistics...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div>
      <Main />
      <div className={styles.statsContainer}>
        <h2>Course Statistics</h2>
        <div className={styles.statsCard}>
          <p><strong>Total Courses:</strong> {stats.total_courses}</p>
          <p><strong>Free Courses:</strong> {stats.free_courses}</p>
          <p><strong>Paid Courses:</strong> {stats.paid_courses}</p>
          <p><strong>Total Enrolled Users:</strong> {stats.total_enrolled_users}</p>
          <p><strong>Average Price of Paid Courses:</strong> ${stats.average_price}</p>
          <p><strong>Most Popular Category:</strong> {stats.popular_category}</p>
        </div>
        <div className={styles.categoryBreakdown}>
          <h3>Courses by Category</h3>
          <ul>
            {stats.courses_by_category.map((category) => (
              <li key={category._id}>
                {category._id}: {category.count} courses
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.topCourses}>
          <h3>Top Enrolled Courses</h3>
          <ol>
            {stats.top_courses.map((course) => (
              <li key={course._id}>
                {course.coursename}: {course.enrolledCount} enrolled users
              </li>
            ))}
          </ol>
          <div>
            <h4>Top Enrolled Courses Chart</h4>
            <img
              src={`data:image/png;base64,${stats.charts.top_courses_bar_chart}`}
              alt="Top Enrolled Courses Bar Chart"
              className={styles.chartImage}
            />
          </div>
        </div>
        <div className={styles.charts}>
          <h3>Visual Insights</h3>
          <div>
            <h4>Course Distribution</h4>
            <img
              src={`data:image/png;base64,${stats.charts.pie_chart}`}
              alt="Pie Chart"
              className={styles.chartImage}
            />
          </div>
          <div>
            <h4>Courses by Category</h4>
            <img
              src={`data:image/png;base64,${stats.charts.bar_chart}`}
              alt="Bar Chart"
              className={styles.chartImage}
            />
          </div>
        </div>
        <div className={styles.insights}>
          <h3>Insights Summary</h3>
          {stats.insights ? (
            <p>{stats.insights}</p>
          ) : (
            <p>No insights available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
