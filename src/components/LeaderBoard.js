import React, {useEffect, useState} from 'react';
import {get, getDatabase, onValue, ref, set} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";
import '../styles/LeaderBoard.scoped.css';

const db = getDatabase(app);

function LeaderBoard() {

    const navigate = useNavigate();

    const [sortedScore, setSortedScore] = useState([]);
    const [answer , setAnswer] = useState([]);
    const [question, setQuestion] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        onValue(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores"), (snapshot) => {
            const sortedData = Object.entries(snapshot.val()).sort((a, b) => b[1] - a[1]);
            setSortedScore(sortedData);
        });
        onValue(ref(db,"Contest/"+localStorage.getItem("joinContestId")+"/Questions"),(snapshot)=>{
            console.log(Object.values(snapshot.val()).map(item => item.queName));
            setQuestion(Object.values(snapshot.val()).map(item => item.queName));
        });
    },[]);



    function showAnswer(cell) {

    }
    const handleRowClick = (event) => {

        const pName = event.target.innerHTML;
        const joinContestId = localStorage.getItem('joinContestId');
        const ansRef = ref(db,`Contest/${joinContestId}/participants/${pName}/questions`);
        get(ansRef).then((snapshot) => {
            setAnswer(()=>snapshot.val());
        });
        document.getElementById('popupContainer').style.display= "block";
    };
    function closePopup() {
        document.getElementById('popupContainer').style.display= "none";
        setAnswer([]);
    }

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
                {Object.keys(sortedScore).map((i) => (<tr  key={i}>
                    <td onClick={handleRowClick} >{sortedScore[i][0]}</td>
                    <td>{sortedScore[i][1]}</td>
                </tr>))}
                </tbody>
            </table>
        </div>
        <div id="popupContainer">

            <table>
                <thead>
                <tr>
                    <th>Que. No.</th>
                    <th>Question</th>
                    <th>Answer</th>
                </tr>
                </thead>
                <tbody>
                {question.map((item, index) => (
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item}</td>
                        <td>{answer[index]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button id="exitView" onClick={closePopup}>OK</button>
        </div>
        <button id="doneButton" onClick={()=>navigate("/Dashboard")}>DONE</button>
        </body>
    );
}

export default LeaderBoard;