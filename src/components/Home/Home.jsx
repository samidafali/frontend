import React from "react";
import { Link } from "react-router-dom";
import Im8 from '../../images/im90.webp';
import styles from "./home.module.css";
import Main from "../Main/Main";

const Home = () => {
    return (
        <>
        <Main/>
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.mainHeading}>Bienvenue sur LearnSphere</h1>
                <p className={styles.headerSubtitle}>
                    L'éducation pour tous, réinventée avec des outils modernes.
                </p>
            </header>

            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h2>Pourquoi LearnSphere ?</h2>
                    <p>
                        Explorez des cours variés, connectez-vous avec des experts et construisez une carrière dont vous êtes fier.
                    </p>
                    <Link to="/about" className={styles.learnMoreButton}>
                        En savoir plus
                    </Link>
                </div>
                <div className={styles.imageContainer}>
                    <img src={Im8} alt="Learning" className={styles.aboutImage} />
                </div>
            </section>
        </div>
        </>
    );
};

export default Home;
