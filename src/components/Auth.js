import {useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import {getDatabase, onValue, ref} from "firebase/database";
import app from "../firebase";
import '../styles/Auth.scoped.css';

const db = getDatabase(app);

function Auth() {
    const navigate = useNavigate();
    // localStorage.setItem("username", "shiv")

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

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

    return (
        <div>
            <h1>Code Arena</h1>
            <section className="bg"></section>
            <div className="login">
                <h3>Login Here</h3>

                <label htmlFor="userInput">Username</label>
                <input type="text" placeholder="User ID" id="userInput" onChange={(e) => setUser(e.target.value)}
                       value={user}/>

                <label htmlFor="passwordInput">Password</label>
                <input type="password" placeholder="Password" id="passwordInput"
                       onChange={(e) => setPassword(e.target.value)} value={password}/>

                <button id="loginButton" onClick={isValidUser}>Log In</button>
            </div>
        </div>
    );
}

export default Auth;