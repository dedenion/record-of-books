import React from 'react';
import Header from './components/Header';
import styles from '../src/css/sample2.module.css';
import ThreeScene from './components/Flamingo';

function Sample2() {
    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.sample}>
                <ThreeScene />
            </div>
        </div>
    );
}

export default Sample2;
