import React, {useState} from 'react';
import {getDatabase, onValue, ref, update} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";
import '../styles/Dashboard.scoped.css';
import cancelLogo from '../assets/cancelIcon.png';

const db = getDatabase(app);

const Dashboard = () => {
    const [contestID, setContestID] = useState("");
    const [errorMessage, setErrorMessage] = useState("Did you copied Contest ID? You copy cat! 🙀");
    const navigate = useNavigate();

    const join = () => {
        console.log("Join")
        var dailog = document.getElementById("dialog");
        dailog.style.display = "block";
        console.log("b=blo")
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
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
        var dialog = document.getElementById("dialog");
        if(contestID !== "") {
            console.log("in valid");
            const contestRef = ref(db,`Contest/${contestID}`);
            onValue(contestRef,(snapshot) => {
                if (snapshot.exists()) {
                    localStorage.setItem("joinContestId", contestID);
                    update(ref(db, `Contest/${contestID}/lobby`), {
                        [localStorage.getItem("username")]: "null"
                    }).then(() => dialog.style.display = "none");
                    navigate("Lobby");
                } else {
                    setErrorMessage("You can't even copy correctly, Wrong ID! 😔")
                }

            });
        } else {
            setErrorMessage("Don't let it blank, I don't like blanks! 😤");
        }
    }

    function create() {
        navigate("CreateContest");
    }

    var noticeContent = ['"What is talk of the town? Oh its Code Arena!! 🙀"',
        '"Found a bug 🪲 ?? Report it to <a style="color: #ffffff" href="mailto:shivpujan.mca21@cs.du.ac.in">@shivpujan</a> | <a\n' +
        '                style="color: #ffffff" href="mailto:rishi.mca21@cs.du.ac.in">@Rishi</a>"',
        '"Be-fair and square, don\'t cheat in the game! 🤨"',
        '"It is better to conquer yourself than to win a thousand battles"',
        '"Do you know? You can also see other\'s code after the contest ends, so don\'t cheat! 🤫"',
        '"Fight till the end, and never give up! 💪🏻"',
        '"You can\'t win if you don\'t play! 🤷🏻‍️"',
        'Do you know where to find the best programmers? Code Arena! 🤩',
        'Practice and practice, you will be the best! 🤓',
        'Win or lose, you will always learn something! 🤗',
        'Be persistent, and your wish will be granted 🧞‍'];
    var i = 0;
    setInterval(() => {
        i++;
        document.getElementById("notice").innerHTML = noticeContent[i % noticeContent.length];
    }, 1000 * 4);

    return (

        <div className="container">
            <div className="greet">
                Hola! {localStorage.getItem("username")}
                {/*नमस्ते 🙏🏻 {localStorage.getItem("username")}*/}
            </div>
            <div className="actions">
                <button id="createButton" className="button" onClick={create}> Create Contest</button>
                <button id="joinButton" className="button" onClick={join}> Join Contest</button>
            </div>
            <div id="notice" className="notices">
                "Welcome to the code arena! 🤩"
            </div>
            <div id="dialog" className="modal">
                <div className="dialog-content">
                    <img className="close" src={cancelLogo} alt="Cancel"/>
                    👮🏻‍ Contest ID, please!
                    <br/>
                    <div className="inputBox">
                        <input type="text" id="joinInput" placeholder="Enter Contest ID" value={contestID}
                               onChange={(e) => {
                                   setContestID(e.target.value)
                               }}/>
                        <br/><br/>
                        <button type="button" className="btn" onClick={connectContest}>
                            →
                        </button>
                    </div>
                    <div className="error">{errorMessage}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;