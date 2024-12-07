import React from 'react';
import Header from './components/Header';
import styles from '../src/css/sample2.module.css';
import FemaleC from './components/femaleC';


function Female() {
    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.sample}>
                <FemaleC />
            </div>
        </div>
    );
}

export default Female;
