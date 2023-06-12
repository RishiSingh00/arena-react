import React, {useEffect, useState} from 'react';
import {get, getDatabase, onValue, ref, set} from "firebase/database";
import app from "../firebase";

const db = getDatabase(app);

function Contest() {

    const [questions, setQuestions] = useState({});
    const [participantData, setParticipantData] = useState({questions: ["","","","","","","","","","","","","","","","",""]});
    const [scoresData, setScoresData] = useState({});

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
            console.log("Participants")
            console.log(snapshot.val());
        })

        onValue(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores"), (snapshot) => {
            fillLeaderBoard();
        });

    }, []);


    startContest();

    function startTimer(countDownDate) {
        let x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();
            // Find the distance between now and the count-down date
            var distance = countDownDate - now;
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            document.getElementById("timerDiv").innerHTML = '<div id="timer">' + hours + "h "
                + minutes + "m " + seconds + "s " + '</div>';


            // If the count-down is over, write some text
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timerDiv").innerHTML = 'time end';
                set(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/status"), 2);
                window.location.href = "endContest.html";
            }
        }, 1000);
    }

    function startContest() {

        onValue(durationRef, (snapshot) => {
            const data = snapshot.val()
            console.log(data);
            var countDownDate = new Date(data.startAt + data.endAt * 60 * 60 * 1000).getTime();
            startTimer(countDownDate);
        })
    }

//---------------

    var lbTable = document.createElement('table');

// Create the table header
    var lbThead = document.createElement('thead');
    var lbHeaderRow = document.createElement('tr');

    var lbCol1Header = document.createElement('th');
    lbCol1Header.textContent = 'User';

    var lbCol2Header = document.createElement('th');
    lbCol2Header.textContent = 'Score';

    lbHeaderRow.appendChild(lbCol1Header);
    lbHeaderRow.appendChild(lbCol2Header);

    lbThead.appendChild(lbHeaderRow);
    lbTable.appendChild(lbThead);

// Create the table body
    var lbTbody = document.createElement('tbody');


    function fillLeaderBoard() {
        get(scoresRef).then((snapshot) => {
            const data = snapshot.val();
            var dataStr = JSON.stringify(data);
            console.log(dataStr);
            var sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
            console.log(sortedData);
            while (lbTbody.firstChild) {
                lbTbody.removeChild(lbTbody.firstChild);
            }
            for (var i = 0; i < sortedData.length; i++) {
                var row = document.createElement('tr');

                var user = document.createElement('td');
                user.textContent = sortedData[i][0];

                var score = document.createElement('td');
                score.textContent = sortedData[i][1];

                row.appendChild(user);
                row.appendChild(score);

                lbTbody.appendChild(row);
            }

            lbTable.appendChild(lbTbody);
            document.getElementById('leaderboardDiv').appendChild(lbTable);
        });
    }

    console.log(questions);


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
                get(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores/" + localStorage.getItem('username'))).then((snapshot) => {
                    let scoreData = snapshot.val();
                    scoreData++;
                    set(ref(db, "Contest/" + localStorage.getItem("joinContestId") + "/participants/scores/" + localStorage.getItem('username')), scoreData);
                });
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
                                        <td><input type="checkbox" checked="true" disabled={true}/></td>
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
                </div>
            </div>

        </div>
    );
}

export default Contest;