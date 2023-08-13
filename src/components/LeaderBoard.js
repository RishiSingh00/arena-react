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
        <div style={{
            textAlign: "center",
            marginBottom: "5px",
            height: "100%",
            borderColor: "black",
            fontFamily: "Belanosima, sans-serif",
            fontSize: "2rem",
            padding: "10px",
            border: "1px solid black",
            borderBottomRightRadius: "40px",
            borderBottomLeftRadius: "40px",
            backgroundColor: "#2f2f2f",
            color: "white",
        }}>Leader Board</div>
        <div id="leaderboardDiv"  >
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(sortedScore).map((i) => (<tr  key={i}>
                    <td style={{color:"blue"}} onClick={handleRowClick} >{sortedScore[i][0]}</td>
                    <td>{sortedScore[i][1]}</td>
                </tr>))}
                </tbody>
            </table>
        </div>

        <div id="popupContainer" style={
            {
                borderRadius: "12px",
            }
        }>

            <table style={{
                backgroundColor: "white",
                borderRadius: "12px",
                fontSize: "1.2rem",
                fontFamily: "Belanosima, sans-serif",
                width: "100%",
                textAlign: "center",
            }}>
                <thead style={{
                    backgroundColor: "#2f2f2f",
                    color: "white",
                }}>
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
                        <td><a href={answer[index]} target="_blank">{answer[index]}</a></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button id="exitView" style={
                {
                    width: "100%",
                    fontFamily: "Belanosima, sans-serif",
                    fontSize: "1.0rem",
                    padding: "10px",
                    border: "1px solid black",
                    borderRadius: "40px",
                    backgroundColor: "#2f2f2f",
                    color: "white",

                }
            } onClick={closePopup}>OK</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",width: "100%"}}>
            <button id="popupButton" onClick={() => navigate("/Dashboard")}>
                Back to Dashboard
            </button>
        </div>

        </body>
    );
}

export default LeaderBoard;