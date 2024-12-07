import React from 'react';
import styles from "../css/header.module.css";
import ThreeDLogo from './ThreeDLogo';


const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <ThreeDLogo />
      </div>
      <nav className={styles.nav}>
  <ul>
    <li className={styles.a}><a href="home">Home</a></li>
    <li className={styles.b}><a href="books">Books</a></li>
    <li className={styles.c}><a href='/'>Sign Out</a></li>
    <li className={styles.d}><a href='sample'>Sample</a></li>
    <li className={styles.d}><a href='sample2'>Sample2</a></li>
    <li className={styles.d}><a href='sample3'>sample3</a></li>
    <li className={styles.d}><a href='man'>man</a></li>
    <li className={styles.d}><a href='female'>female</a></li>
    <li className={styles.d}><a href="2dhuman">2dhuman</a></li>
  </ul>
</nav>

    </header>
  );
}

export default Header;
