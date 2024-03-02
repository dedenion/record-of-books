import React, { useState } from 'react'
//import { Link } from "react-router-dom"
import styles from "./css/books.module.css"
import Header from './components/Header';
import ThreeText from "./components/ThreeText"
import ThreeAnimation from './components/ThreeTv';
import Book from './components/BookGarly';
import Clock3D from './components/Clock3D';


function Books() {
    const [inputText] = useState('');


    return (
        <div>
            <Header/>
            <div className={styles.Books}>
                <h1>Books</h1>
            </div>
            <div className={styles.three}>
                <ThreeText text={inputText} />
                
            </div>
            <div>
            <ThreeAnimation/>
            </div>
            <div>
                <Book/>
            </div>
            <div>
                <Clock3D />
            </div>
        </div>
    );
}

export default Books;