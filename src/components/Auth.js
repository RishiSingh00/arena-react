import React from 'react';
import {useNavigate} from "react-router-dom";

function Auth() {
    const navigate = useNavigate();
    localStorage.setItem("username", "shiv")
    return (
        <div>
            auth
            <button onClick={()=>navigate('/Dashboard')}>Login</button>
        </div>
    );
}

export default Auth;