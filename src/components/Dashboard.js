import React, {useState} from 'react';
import {getDatabase, ref, onValue, set,update} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";
import '../styles/Dashboard.scoped.css';

const db = getDatabase(app);

const Dashboard = () => {
    const [contestID,setContestID] = useState("");
    const navigate = useNavigate();

    const join = () => {
        console.log("Join")
        var dailog = document.getElementById("dialog");
        dailog.style.display = "block";
        console.log("b=blo")
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            dailog.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target === dailog) {
                dailog.style.display = "none";
            }
        }
    }

    const connectContest = () => {
        console.log(contestID);
        var dailog = document.getElementById("dialog");
        dailog.style.display = "none";
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
        <div className="bg">
            <div className="back"></div>
            <h1 id="greet">
                Hola! {localStorage.getItem("username")}
            </h1>
            <div className="actions">
                <button id="createButton" className="button" onClick={create}> Create Contest </button>
                <button id="joinButton" className="button" onClick={join}> Join Contest </button>
            </div>
            <div id="dialog" className="modal">
                <div className="dialog-content">
                    <span className="close">&times;</span>
                    <p>
                        <label htmlFor="key_hint_machine1">Enter contest id: </label>
                        <input type="text" id="joinInput" placeholder="Enter Contest ID"  value={contestID}  onChange={(e)=>{setContestID(e.target.value)}}/>
                        <br/><br/>
                        <button type="button" className="btn" id="submit_key_machine1" onClick={connectContest}>
                            join
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;