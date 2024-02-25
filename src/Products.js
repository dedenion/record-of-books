import React from 'react'
import { Link } from "react-router-dom"
import styles from "./css/products.module.css"

function Products() {
    return (
        <div className={styles.Products}>
            <h1>Products</h1>
            <Link to="/">
                <button>Link to Home</button>
            </Link>
        </div>
    );
}

export default Products;