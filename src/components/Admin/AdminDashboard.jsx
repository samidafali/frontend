import React from "react";
import Main from "../Main/Main"; // Assuming Main is your navbar component
import styles from "./styles.module.css";
import AdminCourses from "./AdminCourses";

const AdminDashboard = () => {
	return (
	  <div className={styles.dashboard_container}>
		<Main /> {/* Include the navbar */}
		<div className={styles.dashboard_content}>
		  
		  
<AdminCourses/>

		</div>
	  </div>
	);
  };
  
  export default AdminDashboard;