import React, { useState } from 'react';
import Header from './components/Header';
import Practice from './components/practice';
import styles from '../src/css/sample.module.css';

function Sample() {

    return (
        <div className={styles.sample}>
            <Header />
            <div className={styles.sample}>
                <Practice />
                
            </div>
        </div>
    );
}

export default Sample;
