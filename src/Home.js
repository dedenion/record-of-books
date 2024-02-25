import React from 'react'
import { Link } from "react-router-dom"
import styles from "./css/home.module.css"

function Home() {
    return (
        <div className={styles.Home}>
            <h1>Home</h1>
            <Link to="/products">
                <button>Link to Products</button>
            </Link>
        </div>
    );
}

export default Home;