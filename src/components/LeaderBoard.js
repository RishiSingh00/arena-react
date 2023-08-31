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
    const durationRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/time");
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        onValue(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores"), (snapshot) => {
            const sortedData = Object.entries(snapshot.val()).sort((a, b) => b[1] - a[1]);
            setSortedScore(sortedData);
        });
        onValue(ref(db,"Contest/"+localStorage.getItem("joinContestId")+"/Questions"),(snapshot)=>{
            console.log(Object.values(snapshot.val()).map(item => item.queName));
            setQuestion(Object.values(snapshot.val()).map(item => item.queName));
        });
        onValue(durationRef, (snapshot) => {
            const data = snapshot.val()
            // console.log(data);
            var countDownDate = new Date(data.startAt + data.endAt * 60 * 60 * 1000).getTime();
            startTimer(countDownDate);
        })
    },[]);

    function startTimer(countDownDate) {
        let x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();
            // Find the distance between now and the count-down date
            var distance = countDownDate - now;
            setDistance(distance);

            // If the count-down is over, write some text
            if (distance < 0) {
                clearInterval(x);
                set(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/status"), 2);
            }
        }, 1000);
    }


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
        <div>
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
        }}>
            {distance > 0 ?
                (<div
                    id="timer">
                    <span style={{color:"red"}}>Live</span> LeaderBoard<br/>
                    {Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h :&nbsp;
                    {Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}m :&nbsp;
                    {Math.floor((distance % (1000 * 60)) / 1000)}s
                </div>) :
                (<div> Final LeaderBoard
                    <br/>
                    <span style={{color:"red"}}>Contest Ended</span>
                </div>)
            }
        </div>
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
            <button id="popupButton" onClick={() =>{
                localStorage.removeItem("joinContestId");
                localStorage.removeItem("submittedTest");
                navigate("/Dashboard")
            }}>
                Back to Dashboard
            </button>
        </div>

        </div>
    );
}

export default LeaderBoard;