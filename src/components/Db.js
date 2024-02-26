import React from "react";
import db from "../firebase";

function Database() {
    const addData = () => {
        const dataName = prompt('Please enter the dataName');

        if (dataName) {
            db.collection("Names").add({
                name: dataName,
            });
        }
    };
    return {
    };
}

export default Database;