import React, { useEffect, useState, useRef } from 'react';
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import '../styles/Contest.scoped.css';

const db = getDatabase(app);

function Contest() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [participantData, setParticipantData] = useState({ questions: Array(17).fill("") });
    const [sortedScore, setSortedScore] = useState([]);
    const [scoreData, setScoreData] = useState({});
    const [distance, setDistance] = useState(0);
    const [topic, setTopic] = useState('');
    const initialized = useRef(false);  // Use useRef instead of useState

    const durationRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/time");
    const questionRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/Questions");
    const participantRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/" + localStorage.getItem('username'));
    const scoresRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores");
    const topicRef = ref(db, "Contest/" + localStorage.getItem("joinContestId"));

    useEffect(() => {
        if (localStorage.getItem("submittedTest") === "true") {
            navigate("LeaderBoard");
        }

        const fetchQuestions = async () => {
            const snapshot = await get(questionRef);
            setQuestions(snapshot.val() || []);
        };

        const fetchParticipantData = async () => {
            const snapshot = await get(participantRef);
            const data = snapshot.val();
            if (data) {
                setParticipantData(data);
            }
            initialized.current = true;  // Mark as initialized after fetching data
        };

        const fetchTopic = async () => {
            const snapshot = await get(topicRef);
            setTopic(snapshot.val().topic);
        };

        fetchQuestions();
        fetchTopic();
        if (!initialized.current) {
            fetchParticipantData();
        }

        const scoresListener = onValue(scoresRef, (snapshot) => {
            setScoreData(snapshot.val());
            const sortedData = Object.entries(snapshot.val()).sort((a, b) => b[1] - a[1]);
            setSortedScore(sortedData);
        });

        const durationListener = onValue(durationRef, (snapshot) => {
            const data = snapshot.val();
            const countDownDate = new Date(data.startAt + data.endAt * 60 * 60 * 1000).getTime();
            startTimer(countDownDate);
        });

        return () => {
            // Clean up listeners on unmount
            scoresListener();
            durationListener();
        };
    }, [navigate]);

    function startTimer(countDownDate) {
        const x = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            setDistance(distance);

            if (distance < 0) {
                clearInterval(x);
                set(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/status"), 2);
                navigate("LeaderBoard");
            }
        }, 1000);
    }

    const handleClicks = async (e) => {
        if (e.target.type === 'checkbox') {
            const row = e.target.parentNode.parentNode;
            const cells = row.querySelectorAll('td');
            const queNo = cells[0].textContent - 1;
            const ans = cells[2].querySelector('input').value;

            if (ans === "") {
                alert("Please enter answer");
                cells[3].querySelector('input').checked = false;
                return; // Exit the function to avoid further execution
            }

            const temp = { ...participantData };
            temp.questions[queNo] = ans;

            try {
                await set(participantRef, temp);

                const username = localStorage.getItem('username');
                const newScore = (scoreData[username] || 0) + 1;
                await set(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores/" + username), newScore);

                row.querySelector('input').disabled = true;
                cells[3].querySelector('input').disabled = true;

                // Update local participantData state
                setParticipantData(temp);
            } catch (error) {
                console.error("Error updating Firebase:", error);
            }
        }
    };

    if (questions.length === 0) {
        return <div>Loading...</div>; // Display a loading state until questions are fetched
    }

    return (
        <div>
            <div id="timerDiv"
                 style={{
                     textAlign: "center",
                     marginBottom: "5px",
                     height: "100%",
                     borderColor: "black",
                     fontFamily: "Belanosima, sans-serif",
                     fontSize: "1.7rem",
                     padding: "10px",
                     border: "1px solid black",
                     borderBottomRightRadius: "40px",
                     borderBottomLeftRadius: "40px",
                     backgroundColor: "#2f2f2f",
                     color: "white",
                 }}>
                <div>
                    <u>{topic}</u>
                </div>
                {distance > 0 ?
                    (<div id="timer">
                        {Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h :&nbsp;
                        {Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}m :&nbsp;
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
                        {questions.map((question, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td><a href={question.queUrl}
                                       target="_blank" rel="noopener noreferrer">{question.queName}</a></td>
                                <td><input type="text" value={participantData.questions[index] || ""} onChange={(e) => {
                                    const temp = { ...participantData };
                                    temp.questions[index] = e.target.value;
                                    setParticipantData(temp);
                                }} /></td>
                                <td><input type="checkbox" onClick={(e) => handleClicks(e)} /></td>
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
                     }}>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedScore.map(([name, score], i) => (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{score}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}>
                <button
                    style={{
                        width: "12%",
                        height: "50px",
                        borderRadius: "10px",
                        backgroundColor: "#2f2f2f",
                        color: "white",
                        fontFamily: "Belanosima, sans-serif",
                        fontSize: "1.2rem",
                        border: "1px solid black",
                        marginLeft: "3px",
                        marginTop: "5px",
                        marginBottom: "5px",
                        textAlign: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => {
                        localStorage.setItem("submittedTest", "true");
                        navigate("LeaderBoard")
                    }}>Submit</button>
            </div>
        </div>
    );
}

export default Contest;
