import React, {useEffect, useState} from 'react';
import {get, getDatabase, onValue, ref, set} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";
import '../styles/LeaderBoard.scoped.css';

const db = getDatabase(app);

function LeaderBoard() {

    const navigate = useNavigate();

    const [sortedScore, setSortedScore] = useState([]);

    useEffect(() => {
        onValue(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores"), (snapshot) => {
            const sortedData = Object.entries(snapshot.val()).sort((a, b) => b[1] - a[1]);
            setSortedScore(sortedData);
        });

    },[]);

    return (
        <body>
        <h1>LeaderBoard</h1>
        <div id="leaderboardDiv" style={{width: "100%", height: "100vh"}} >
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(sortedScore).map((i) => (<tr key={i}>
                    <td>{sortedScore[i][0]}</td>
                    <td>{sortedScore[i][1]}</td>
                </tr>))}
                </tbody>
            </table>
        </div>
        <button id="doneButton" onClick={()=>navigate("/Dashboard")}>DONE</button>
        </body>
    );
}

export default LeaderBoard;