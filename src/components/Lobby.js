import React, {useEffect, useState} from 'react';
import app from "../firebase.js";
import {child, getDatabase, onValue, ref, set, update,} from "firebase/database";
import {useNavigate} from "react-router-dom";
import "../styles/Lobby.scoped.css";

const db = getDatabase(app);

function Lobby() {

    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [timerStyle, setTimerStyle] = useState({display: "none"});
    const [lobby, setLobby] = useState([]);


    const contestRef = ref(db, "Contest/" + localStorage.getItem("joinContestId"));
    const durationRef = ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/time");
    const lobbyRef = ref(db, "Contest/" + localStorage.getItem("joinContestId")+"/lobby");


    useEffect(() => {

        onValue(contestRef, (snapshot) => {
            const fetchedData = snapshot.val();
            setData(fetchedData);
            onStatusChange(fetchedData)
        });

        onValue(lobbyRef, (snapshot) =>{
            const lobbyData = snapshot.val();
            const lobbyKey = Object.keys(snapshot.val()).filter(i => i !== "null");
            setLobby(()=> lobbyKey);
        });
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

    return (
        <div className="container">
            <h1>Lobby</h1>
            <div className="info">
                Good Luck!
                <div id="contest-code">Contest ID: {localStorage.getItem("joinContestId")}</div>
                <div id="ownerDiv">
                    {data.owner} will start the contest
                </div>
            </div>

            <div id="timerDiv" style={timerStyle}>
                <button id="timer" onClick={startCountDown}>Start Timer</button>
            </div>

            <div id="lobbyDiv">
                <table>
                    <thead>
                    <tr>
                        <th>People In lobby for contest</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lobby.map((i) => (
                        i === 'null' ?"" : (
                            <tr key={i}>
                                <td>{i}</td>
                            </tr>
                        )
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Lobby;