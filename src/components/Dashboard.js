import React, {useState} from 'react';
import {getDatabase, ref, onValue, set,update} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";

const db = getDatabase(app);

const Dashboard = () => {
    const [contestID,setContestID] = useState("");
    const navigate = useNavigate();

    const join = () => {
        if(contestID !== "") {
            console.log("in valid");
            const contestRef = ref(db,`Contest/${contestID}`);
            onValue(contestRef,(snapshot) => {
                if(snapshot.exists()) {
                    localStorage.setItem("joinContestId",contestID);
                    update(ref(db,`Contest/${contestID}/lobby`), {
                        [localStorage.getItem("username")] : "null"
                    });
                    navigate("Lobby");
                }
                else {
                    alert("Invalid Contest ID");
                }

            });
        }
        else {
            alert("Invalid Contest ID");
        }
    }

    function create() {
        navigate("CreateContest");
    }

    return (
        <div>
            <h1>DASHBOARD</h1>
            <h2 id="greet">
                Welcome {localStorage.getItem("username")}
            </h2>
            <br/><br/><br/>
            <button id="createButton" onClick={create}> Create Contest </button>
            <br/><br/><br/>
            <input type="text" id="joinInput" placeholder="Enter Contest ID" onChange={(e)=>{setContestID(e.target.value)}}/>
            <button id="joinButton" onClick={join}> Join Contest </button>
        </div>
    );
};

export default Dashboard;