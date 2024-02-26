//Rogin.js
import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom"
import Home from "../Home";
import styles from "../css/rogin.module.css"


function RogIn() {
    const [user] = useAuthState(auth);

    return (
        <div>
            <div className={styles.signin}>
                <h2>Welcome Record of Books</h2>
                {user ? (
                    <>
                        <Link to="/home">
                            <button>Link to Home</button>
                        </Link>
                        <UserInfo />
                        <div className={styles.signout}>
                        <SignOutButton />
                        </div>
                    </>
                ) : (
                    <SignInButton/>
                )
            }
            </div>
        </div>
    );
}

export default RogIn;

function SignInButton() {
    const signInWithGoogle = () => {
        signInWithPopup(auth,provider);
    };
    
    return (
        <button onClick={signInWithGoogle}>
            <p>Sign in with Google</p>
        </button>
    );
}

function SignOutButton() {
    return (
        <button onClick={() => auth.signOut()}>
            <p>Sign out</p>
        </button>
    );
}


function UserInfo() {
    return (
        <div className="userInfo">
            <img src={auth.currentUser.photoURL} />
            <p>{auth.currentUser.displayName}</p>
        </div>
    );
}