import React, { useState } from "react";
import { getDatabase, push, ref, set } from "firebase/database";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import copyIcon from "../assets/copy-icon.png";
import tickIcon from "../assets/tick-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import plusIcon from "../assets/plus-icon.png";
import "../styles/CreateContest.scoped.css";

const db = getDatabase(app);

const CreateContest = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [questions, setQuestions] = useState([]);
  const [contestID, setContestID] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");

  const navigate = useNavigate();

  function addDataToTable() {
    console.log("adding to the table");
    if (name && url) {
      // Add data to table
      setQuestions([...questions, { queName: name, queUrl: url }]);
      setName("");
      setUrl("");
    }
  }

  function writeUserData() {
    const reference = ref(db, "Contest");
    const constRef = push(reference)

    set(constRef, {
        owner: localStorage.getItem("username"),
        time: {endAt: time},
        topic: topic,
        Questions: questions,
        status: 0, // 0 for not started, 1 for started, 2 for ended
    });
    setContestID(constRef.key);
    showPopup();
  }

  function showPopup(constRef) {
    const content = document.getElementById("container");
    content.style.pointerEvents = "none"; // Disable interactions with the content
    const popup = document.getElementById("myPopup");
    popup.style.display = "block";
  }

  function deleteQuestion(index, e) {
    console.log("Editing: ", index);
    const newQuestions = questions.filter((item, i) => i !== index);
    setQuestions(newQuestions);
  }

  const copyToClipBoard = () => {
    document.getElementById("clip").src = tickIcon;
    document.getElementById("contest-id").innerText = "Copied!";
    navigator.clipboard.writeText(contestID);
    const id = setTimeout(() => {
        document.getElementById("clip").src = copyIcon;
        document.getElementById("contest-id").innerText = contestID;
    },1000 * 1.5);

    clearTimeout(id);
    
  }

  return (
    <div>
      <div id="container" className="container">
        <h1>"Competition Gives You A Chance To Show Your Talent."</h1>
        <button type="button" onClick={writeUserData}>
          Create Contest
        </button>

        <div className="meta-info">
          <div className="input">
            <label htmlFor="topicInput">Contest Topic: </label>
            <input type="text" id="topicInput" placeholder="Topic" value={topic} onChange={(e)=>setTopic(e.target.value)} />
          </div>
          <div className="input">
            <label htmlFor="timeInput">Duration: </label>
            <input type="number" min="1" id="timeInput" placeholder="time " value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div className="table-div">
          <table id="table" className="table">
            <tbody>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Action</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    id="queNameInput"
                    placeholder="Question Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="queUrlInput"
                    placeholder="Question Url"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                  />
                </td>
                <td>
                  <img
                    id="addButton"
                    onClick={addDataToTable}
                    src={plusIcon}
                    alt="add"
                  />
                </td>
              </tr>
              {questions.map((question, index) => {
                return (
                  <tr key={index}>
                    <td>{question.queName}</td>
                    <td><a href={question.queUrl} target="_blank">{question.queUrl}</a></td>
                    <td>
                      <img
                        id="editBtn"
                        onClick={(e) => deleteQuestion(index, e)}
                        src={deleteIcon}
                        alt="edit"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div id="myPopup" className="popup">
        <div className="dialog-content">
          <div className="contest">
            <div id="contest-id" className="contest-id">{contestID}</div>
            <div>
              <img id="clip" width="30px" height="30px" onClick={copyToClipBoard} src={copyIcon} alt="copy-btn" />
            </div>
          </div>
          <div className="contest-text">
            This is your Contest ID. Store and Share it with your friends to
            join contest.
          </div>
          <button id="popupButton" onClick={() => navigate("/Dashboard")}>
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContest;
