import React, {useState} from 'react';
import {getDatabase, push, ref, set} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";
import '../styles/CreateContest.scoped.css';


const db = getDatabase(app);

const CreateContest = () => {

    const [data1, setData1] = useState("");
    const [data2, setData2] = useState("");

    const navigate = useNavigate();
    var table = document.getElementById("table");
    var topicInput = document.getElementById("topicInput");
    var timeInput = document.getElementById("timeInput");
    var popupText = document.getElementById('popupText');

    function addDataToTable() {
        console.log('hello');
        if (data1 && data2) {
            console.log(data1 + " " + data2);
            var row = table.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = data1;
            cell2.innerHTML = data2;

            // Clear input values
            setData1("");
            setData2("");
        }

    }


    function writeUserData() {
        const reference = ref(db, "Contest");
        const constRef = push(reference)

        set(constRef, {
            owner: localStorage.getItem("username"),
            time: {endAt: timeInput.value},
            topic: topicInput.value,
            status: 0, // 0 for not started, 1 for started, 2 for ended
        });

        const rows = table.rows;

        for (let i = 1; i < rows.length; i++) {
            addQuestion(constRef.key, i, rows[i].cells[0].innerHTML, rows[i].cells[1].innerHTML);
        }
        popupText.innerHTML = constRef.key + " is your Contest ID. Store and Share it with your friends to join contest.";
        console.log(constRef.key);
        showPopup();
    }

    function addQuestion(id, queNumber, queName, queUrl) {
        const reference = ref(db, "Contest/" + id + "/Questions/" + queNumber);
        set(reference, {
            queName: queName,
            queUrl: queUrl
        });
    }


// popup code
    function showPopup(constRef) {
        var content = document.getElementById("content");
        content.style.pointerEvents = "none"; // Disable interactions with the content
        var popup = document.getElementById("myPopup");
        popup.style.display = "block";
    }

    var popupButton = document.getElementById("popupButton");

    function closePopup() {
        navigate("/Dashboard");
    }


    return (
        <div>
            <div id="content">
                <h1><b>Create Contest</b></h1>
                <br/>
                <label htmlFor="topicInput">Contest Topic</label>
                <input type="text" id="topicInput" placeholder="Topic"/><br/>
                <label htmlFor="timeInput">Duration</label>
                <input type="number" min="1" id="timeInput" placeholder="time "/><br/>
                <input type="text" id="queNameInput" placeholder="Question Name"
                       onChange={(e) => setData1(e.target.value)}
                       value={data1}/>
                <input type="text" id="queUrlInput" placeholder="Question Url"
                       onChange={(e) => setData2(e.target.value)}
                       value={data2}/>
                <br/>
                <button id="addButton" onClick={addDataToTable}>ADD</button>
                <table id="table">
                    <tbody>
                    <tr>
                        <th>Que. Name</th>
                        <th>Que. Url</th>
                    </tr>
                    </tbody>
                </table>
                <br/><br/>
                <button id="createButton" onClick={writeUserData}>CREATE</button>
            </div>
            <div id="myPopup" className="popup">
                <p id="popupText"></p>
                <button id="popupButton" onClick={closePopup}>DONE</button>
            </div>
        </div>
    );
};

export default CreateContest;