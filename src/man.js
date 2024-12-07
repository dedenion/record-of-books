import React from 'react';
import Header from './components/Header';
import styles from '../src/css/sample2.module.css';
import ManC from './components/manC';


function Man() {
    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.sample}>
                <ManC />
            </div>
        </div>
    );
}

export default Man;
