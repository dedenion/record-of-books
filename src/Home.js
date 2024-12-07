import React from 'react'
import { Link } from "react-router-dom"
import styles from "./css/home.module.css"
import Header from './components/Header';
import Clock3D from "./components/Clock3D"

function Home() {
    return (
        <div>
            <Header/>
            <div>
                <Clock3D />
            </div>
            <div className={styles.Home}>
                <h1>Home</h1>
                <Link to="/books">
                    <button>Link to Books</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;