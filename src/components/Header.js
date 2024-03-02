import React from 'react';
import styles from "../css/header.module.css"
//import SignOutButton from "./RogIn"

const Header = () => {
    return (
    <header className={styles.header}>
        <div className={styles.logo}>Record</div>
        <nav className={styles.nav}>
        <ul>
            <li><a href="home">Home</a></li>
            <li><a href="books">Books</a></li>
            <li><a href='/'>Sign Out</a></li>
        </ul>
        </nav>
    </header>
    );
}

export default Header;
