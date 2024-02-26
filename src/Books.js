import React from 'react'
//import { Link } from "react-router-dom"
import styles from "./css/books.module.css"
import Header from './components/Header';

function Books() {
    return (
        <div>
            <Header/>
            <div className={styles.Products}>
                <h1>Books</h1>
                
            </div>
        </div>
    );
}

export default Books;