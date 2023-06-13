import React, {useEffect, useState} from 'react';
import {get, getDatabase, onValue, ref, set} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";
import '../styles/Contest.scoped.css';

const db = getDatabase(app);

function Contest() {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState({});
    const [participantData, setParticipantData] = useState({questions: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]});
    const [sortedScore, setSortedScore] = useState([]);
    const [scoreData, setScoreData] = useState({});
    const [distance, setDistance] = useState(0);

    const durationRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/time");
    const questionRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/Questions");
    const participantRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/" + localStorage.getItem('username'))
    const scoresRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores")


    useEffect(() => {
        get(questionRef).then((snapshot) => {
            setQuestions(snapshot.val());
        });

        get(participantRef).then((snapshot) => {
            setParticipantData(snapshot.val());
        })

        onValue(scoresRef, (snapshot) => {
            setScoreData(snapshot.val());
            const sortedData = Object.entries(snapshot.val()).sort((a, b) => b[1] - a[1]);
            setSortedScore(sortedData);
        });

        onValue(durationRef, (snapshot) => {
            const data = snapshot.val()
            console.log(data);
            var countDownDate = new Date(data.startAt + data.endAt * 60 * 60 * 1000).getTime();
            startTimer(countDownDate);
        })

    }, []);

    console.log("sorted scores");
    console.log(sortedScore);

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
                navigate("LeaderBoard");
            }
        }, 1000);
    }

    const handleClicks = (e) => {
        if (e.target.type === 'checkbox') {
            var row = e.target.parentNode.parentNode;
            var cells = row.querySelectorAll('td');
            var queNo = cells[0].textContent;
            if (cells[2].querySelector('input').value === "") {
                alert("Please enter answer");
                cells[3].querySelector('input').checked = false;
            } else {
                const ans = cells[2].querySelector('input').value;
                console.log(queNo);
                console.log(ans);
                var temp = participantData;
                temp["questions"][queNo] = ans;
                set(participantRef, temp);
                scoreData[localStorage.getItem('username')] += 1;
                set(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores/" + localStorage.getItem('username')), scoreData[localStorage.getItem('username')]);
                row.querySelector('input').disabled = true;
                cells[3].querySelector('input').disabled = true;
            }
        }
    }

    return (
        <div>
            <div id="timerDiv"
                 style={{
                     marginBottom: "5px",
                     height: "10vh",
                     borderColor: "black",
                     borderStyle: "dotted",
                     marginLeft: "3px",
                 }}>
                {distance > 0 ?
                    (<div
                        id="timer">
                        {Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h
                        {Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}m
                        {Math.floor((distance % (1000 * 60)) / 1000)}s
                    </div>) :
                    (<div> Time End
                    </div>)
                }
            </div>
            <div className="container">
                <div id="contestDiv"
                     style={{
                         marginLeft: "3px",
                         display: "flex",
                         textAlign: "left",
                         width: "60%",
                         height: "90vh",
                         borderColor: "black",
                         borderStyle: "dotted"
                     }}>
                    <table>
                        <thead>
                        <tr>
                            <th>Que. No.</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Done</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.keys(questions).map((i) => (
                            <tr key={i}>
                                <td>{i}</td>
                                <td><a href={questions[i + ""]["queUrl"]}
                                       target="_blank">{questions[i + ""]["queName"]}</a></td>
                                {participantData["questions"][i + ""] !== "" ?
                                    (<>
                                        <td><input type="text" value={participantData["questions"][i + ""]}
                                                   disabled={true}/></td>
                                        <td><input type="checkbox" checked={true} disabled={true}/></td>
                                    </>) :
                                    (<>
                                        <td><input type="text"/></td>
                                        <td><input type="checkbox" onClick={(e) => handleClicks(e)}/></td>
                                    </>)
                                }

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div id="leaderboardDiv"
                     style={{
                         width: "20%",
                         display: "flex",
                         textAlign: "right",
                         height: "90vh",
                         borderColor: "black",
                         borderStyle: "dotted"
                     }}>

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
            </div>

        </div>
    );
}

export default Contest;