import React, {useEffect, useState} from 'react';
import app from "../firebase.js";
import {child, get, getDatabase, onValue, ref, set, update,} from "firebase/database";
import "../styles/Lobby.scoped.css";
import {useNavigate} from "react-router-dom";

const db = getDatabase(app);

function Lobby() {

    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [timerStyle, setTimerStyle] = useState({display: "none"});
    const [lobby, setLobby] = useState({user: "Not Ready"});
    const [participantStatus, setParticipantStatus] = useState("Not Ready");
    const [topic, setTopic] = useState('');

    const contestRef = ref(db, "Contest/" + localStorage.getItem("joinContestId"));
    const durationRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/time");
    const lobbyRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/lobby");
    const topicRef = ref(db, "Contest/" + localStorage.getItem("joinContestId"))

    useEffect(() => {

        get(topicRef).then((snapshot) => {
            setTopic(snapshot.val().topic);
        });

        onValue(contestRef, (snapshot) => {
            const fetchedData = snapshot.val();
            setData(fetchedData);
            onStatusChange(fetchedData)
        });

        onValue(lobbyRef, (snapshot) => {
            const lobbyData = snapshot.val();
            // const lobbyKey = Object.keys(snapshot.val()).filter(i => i !== "null");
            setLobby(() => lobbyData);
            if(lobbyData[localStorage.getItem("username")] === "left") {
                setParticipantStatus("Not Ready");
            } else {
                setParticipantStatus(lobbyData[localStorage.getItem("username")] || "Not Ready");
            }
            // console.log("user effect: ",lobbyData);
        });

        const handleBackPress = () => {
            update(lobbyRef, {
                [localStorage.getItem("username")]: "left"
            }).then(() => {
                localStorage.removeItem("joinContestId");
                navigate("/Dashboard");
                window.location.reload();
            });
        }

        const handleTabClose = (event) => {
            event.preventDefault();
            update(lobbyRef, {
                [localStorage.getItem("username")]: "left"
            }).then(() => {
                localStorage.removeItem("joinContestId");
                // navigate("/Dashboard");
                // window.location.reload();
            });
        };

        window.addEventListener("popstate", handleBackPress);
        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener("popstate", handleBackPress);
            window.removeEventListener('beforeunload', handleTabClose);
        }

    }, []);

    const onStatusChange = (data) => {
        setTimerStyle({display: "none"});
        if (data.status === 0) {
            if (data.owner === localStorage.getItem("username")) {
                setTimerStyle({display: "block"});
            } else {
                setTimerStyle({display: "none"});
            }
        } else if (data.status === 1) {
            console.log('inside data 1');
            let queNum = data.Questions.length;
            console.log("queNumin onval" + queNum);
            console.log("queNum" + queNum);
            const username = localStorage.getItem("username");
            set(child(contestRef, "participants/scores/" + username), 0).then(r => console.log("score set"));
            for (let i = 1; i < queNum; i++) {
                set(child(contestRef, "participants/" + username + "/questions/" + i), "").then(r => console.log("questions set"));
            }
            navigate("Contest");
            window.location.reload();
        } else if (data.status === 2) {
            navigate("LeaderBoard");
        }
    }

    function startCountDown() {
        update(durationRef, {"startAt": new Date().getTime()}).then(r => console.log("timer set"));
        update(contestRef, {"status": 1}).then(r => console.log("status set"));
    }

    const markReady = () => {

        var s = "";
        if (participantStatus === "Ready") {
            s = "Not Ready";
            setParticipantStatus("Not Ready")

        } else if(participantStatus==="Not Ready"){
            s = "Ready";
            setParticipantStatus("Ready")
        }

        const username = localStorage.getItem("username");

        console.log("username: ", username, "status: ", s);

        update(lobbyRef, {[username]: s}).then(r => {
            if (participantStatus === "Ready") {
                setParticipantStatus("Not Ready")
            } else {
                setParticipantStatus("Ready")
            }
        });

    }

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
                <button id="timerDiv"
                        onClick={markReady}>Mark {participantStatus === "Ready" ? "not ready" : "ready"}</button>
            </div>

            <div id="lobbyDiv">
                <table>
                    <thead>
                    <tr>
                        <th>People In lobby for contest</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(lobby).map((key) => {
                        return (
                            <tr key={key}>
                                <td>{lobby[key]==="left" ? <s>{key}</s> : <>{key}</>} <span
                                    style={{fontSize: "medium"}}> {
                                    lobby[key]==="left" ?
                                        <>☠️😵</> :
                                        lobby[key] === "Ready" ? <>✅</> : <>❌</>
                                }</span></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Lobby;