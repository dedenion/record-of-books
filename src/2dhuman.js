import React from 'react';
import Header from './components/Header';
import styles from '../src/css/sample2.module.css';
import THuman from './components/human';

function TwoD() {
    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.sample}>
                <THuman />
            </div>
        </div>
    );
}

export default TwoD;
