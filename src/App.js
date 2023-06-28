import {Route, Routes} from "react-router-dom";
import Auth from "./components/Auth";
import Contest from "./components/Contest";
import CreateContest from "./components/CreateContest";
import Dashboard from "./components/Dashboard";
import LeaderBoard from "./components/LeaderBoard";
import Lobby from "./components/Lobby";
import EndContest from "./components/EndContest";
import Profile from "./components/Profile";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Auth/>}/>
            <Route path="Dashboard" element={<Dashboard/>}/>
            <Route path="Dashboard/Lobby" element={<Lobby/>}/>
            <Route path="Dashboard/CreateContest" element={<CreateContest/>}/>
            <Route path="Dashboard/Profile" element={<Profile/>}/>
            <Route path="Dashboard/Lobby/Contest" element={<Contest/>}/>
            <Route path="Dashboard/Lobby/LeaderBoard" element={<LeaderBoard/>}/>
            <Route path="Dashboard/Lobby/Contest/LeaderBoard" element={<LeaderBoard/>}/>
        </Routes>
    );
}