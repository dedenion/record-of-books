import React from 'react';
import Header from './components/Header';
import styles from '../src/css/sample2.module.css';
import Human from './components/man_and_female';

function Sample3() {
    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.sample}>
                <Human />
            </div>
        </div>
    );
}

export default Sample3;
