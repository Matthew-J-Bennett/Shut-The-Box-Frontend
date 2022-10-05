import {useEffect, useState} from "react";
import {socket} from "./context/socket";


function Player(props) {
    return (<div className="IndividualPlayer">
        <p className="PlayerName">{props.name}</p>
        <p className="PlayerScore">{props.score}</p>
    </div>);
}


function Players() {
    let [players, setPlayers] = useState([]);
    let [round, setRound] = useState("");
    let [max_rounds, setMaxRounds] = useState("");

    useEffect(() => {
        socket.on("player_info", (data) => {
            setPlayers(data["player_info"])
            setRound(data["round_info"]["rounds"])
            setMaxRounds(data["round_info"]["max_rounds"])
        });
    }, [])

    return (<div className="Players">
        <p className="PlayersHeader" style={{borderStyle: "none"}}>Round {round} of {max_rounds}</p>
        <p className="PlayersHeader">Player Scores</p>
        {players.map(player => (
            <Player name={player.name} score={player.score} key={player.id}/>
        ))}
    </div>);
}

export default Players;