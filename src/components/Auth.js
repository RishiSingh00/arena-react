import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {getDatabase, onValue, ref} from "firebase/database";
import app from "../firebase";
import '../styles/Auth.scoped.css';
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {userID} from "./User";
import googleLogo from "../assets/google.png";

const db = getDatabase(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

function Auth() {
    const navigate = useNavigate();
    // localStorage.setItem("username", "shiv")

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (localStorage.getItem("username")) {
            navigate("Dashboard");
        }
    })

    function isValidUser() {
        console.log("in vaid");
        const userRef = ref(db, "Users/" + user + "/password");
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            console.log("password" + password);
            if (data === password) {
                localStorage.setItem("username", user);
                navigate("Dashboard");
            } else {
                setUser("");
                setPassword("");
                alert("Invalid Password/user");
            }
        });
    }

    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                userID.setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('username', user.displayName.split(" ")[0]);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                console.log(user);
                navigate("Dashboard");
            }).catch((error) => {
            // Handle Errors here.
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (
        <div>
            <h1>Code Arena</h1>
            <section className="bg"></section>
            <div className="login">
                <img src={googleLogo} alt="google-logo"
                    width={100}
                    height={100}
                />

                {/*<label htmlFor="userInput">Username</label>*/}
                {/*<input type="text" placeholder="User ID" id="userInput" onChange={(e) => setUser(e.target.value)}*/}
                {/*       value={user}/>*/}

                {/*<label htmlFor="passwordInput">Password</label>*/}
                {/*<input type="password" placeholder="Password" id="passwordInput"*/}
                {/*       onChange={(e) => setPassword(e.target.value)} value={password}/>*/}
                {/*<button id="loginButton" onClick={isValidUser}>Log In</button>*/}
                <button onClick={loginWithGoogle}>Login With Google</button>
            </div>
        </div>
    );
}

export default Auth;