import React, { useEffect, useState } from 'react';
import app from "../firebase.js";
import { child, get, getDatabase, onValue, ref, set, update, off } from "firebase/database";
import "../styles/Lobby.scoped.css";
import { useNavigate } from "react-router-dom";

const db = getDatabase(app);

function Lobby() {
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [timerStyle, setTimerStyle] = useState({ display: "none" });
    const [lobby, setLobby] = useState({});
    const [participantStatus, setParticipantStatus] = useState("Not Ready");
    const [topic, setTopic] = useState('');

    const contestRef = ref(db, "Contest/" + localStorage.getItem("joinContestId"));
    const durationRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/time");
    const lobbyRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/lobby");
    const topicRef = ref(db, "Contest/" + localStorage.getItem("joinContestId"));

    useEffect(() => {
        
        get(topicRef).then((snapshot) => {
            setTopic(snapshot.val().topic);
        });

        const contestListener = onValue(contestRef, (snapshot) => {
            const fetchedData = snapshot.val();
            setData(fetchedData);
            onStatusChange(fetchedData);
        });

        const lobbyListener = onValue(lobbyRef, (snapshot) => {
            const lobbyData = snapshot.val();
            setLobby(lobbyData);
            const username = localStorage.getItem("username");
            setParticipantStatus(lobbyData[username] === "left" ? "Not Ready" : lobbyData[username] || "Not Ready");
        });

        const handleBackPress = () => {
            update(lobbyRef, {
                [localStorage.getItem("username")]: "left"
            }).then(() => {
                localStorage.removeItem("joinContestId");
                navigate("/Dashboard");
                window.location.reload();
            });
        };

        const handleTabClose = (event) => {
            event.preventDefault();
            update(lobbyRef, {
                [localStorage.getItem("username")]: "left"
            }).then(() => {
                localStorage.removeItem("joinContestId");
            });
        };

        window.addEventListener("popstate", handleBackPress);
        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener("popstate", handleBackPress);
            window.removeEventListener('beforeunload', handleTabClose);
            off(contestRef, 'value', contestListener);
            off(lobbyRef, 'value', lobbyListener);
        };
    }, []);

    const onStatusChange = (data) => {
        setTimerStyle({ display: "none" });
        if (data.status === 0) {
            if (data.owner === localStorage.getItem("username")) {
                setTimerStyle({ display: "block" });
            } else {
                setTimerStyle({ display: "none" });
            }
        } else if (data.status === 1) {
            const queNum = data.Questions.length;
            const username = localStorage.getItem("username");
            set(child(contestRef, "participants/scores/" + username), 0).then(() => {
                for (let i = 0; i < queNum; i++) {
                    set(child(contestRef, "participants/" + username + "/questions/" + i), "");
                }
            }).then(() => { navigate("Contest");                    
        });
        } else if (data.status === 2) {
            navigate("LeaderBoard");

        }
    };

    const startCountDown = () => {
        update(durationRef, { "startAt": new Date().getTime() });
        update(contestRef, { "status": 1 });
    };

    const markReady = () => {
        const status = participantStatus === "Ready" ? "Not Ready" : "Ready";
        const username = localStorage.getItem("username");

        update(lobbyRef, { [username]: status }).then(() => {
            setParticipantStatus(status);
        });
    };

    return (
        <div className="container">
            <h1>Lobby</h1>
            <div className="topic"><u>{topic}</u></div>
            <div className="info">
                Good Luck!
                <div id="contest-code">Contest ID: {localStorage.getItem("joinContestId")}</div>
                <div id="ownerDiv">
                    {data.owner} will start the contest
                </div>
            </div>

            <div className="actions">
                <button id="timerDiv" onClick={startCountDown} style={timerStyle}>Start Timer</button>
                <button id="timerDiv" onClick={markReady}>Mark {participantStatus === "Ready" ? "Not Ready" : "Ready"}</button>
            </div>

            <div id="lobbyDiv">
                <table>
                    <thead>
                        <tr>
                            <th>People In lobby for contest</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(lobby).map((key) => (
                            <tr key={key}>
                                <td>
                                    {lobby[key] === "left" ? <s>{key}</s> : <>{key}</>}
                                    <span style={{ fontSize: "medium" }}>
                                        {lobby[key] === "left" ? <>☠️😵</> :
                                            lobby[key] === "Ready" ? <>✅</> : <>❌</>}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Lobby;
