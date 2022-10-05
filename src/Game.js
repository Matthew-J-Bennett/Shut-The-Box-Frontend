import React, {useContext, useEffect, useState} from "react";
import {socket, SocketContext, ws_game_push} from "./context/socket";
import Cookies from "universal-cookie";
import Board from "./Board";
import Players from "./Players";
import * as fontawesome from "@fortawesome/fontawesome-svg-core";
import {faClipboard} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import PopUpContext from "./context/popup";
import {useNavigate, useParams} from "react-router-dom";
import {CopyToClipboard} from "react-copy-to-clipboard/src";

const cookies = new Cookies();

fontawesome.library.add(faClipboard);

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);


function Dice(props) {
    return (<div className="Dice"><p>{props.dice_1}</p><p>{props.dice_2}</p></div>);
}

function ActionButton(props) {
    let [game_Started, setGame_Started] = useState(false);
    let [can_Roll, setCan_Roll] = useState(false);
    let [roll_Lock, setRoll_Lock] = useState(false);
    let [end_Turn, setEnd_Turn] = useState(false);

    useEffect(() => {

        socket.on("board_info", async (data) => {
            setGame_Started(data["started"])
            setCan_Roll(data["can_roll"])
            setRoll_Lock(data["roll_lock"])
            if (data["end_turn"] === true) {
                await delay(1000)
            }
            setEnd_Turn(data["end_turn"])

        });
    }, [])

    function rollClick(e) {
        ws_game_push(["roll", {}])
    }

    function startClick(e) {
        ws_game_push(["start", {}])
    }

    function endClick(e) {
        ws_game_push(["end_turn", {}])
    }

    if (!game_Started && !can_Roll) {
        return (<button className="ActionBtn Disabled">Start</button>);
    } else if (!game_Started && can_Roll) {
        return (<button onClick={startClick} className="ActionBtn">Start</button>);
    } else if (can_Roll && !roll_Lock) {
        return (<button onClick={rollClick} className="ActionBtn">Roll</button>);
    } else if (end_Turn && can_Roll) {
        return (<button onClick={endClick} className="ActionBtn">End Turn</button>);
    } else {
        return (<button className="ActionBtn Disabled">Roll</button>);
    }
}

function StatusMessage() {
    let [message, setMessage] = useState("Press Start to Begin");
    useEffect(() => {
        socket.on("status_message", async (data) => {
            setMessage(data["message"])
        });

    }, [])

    return (<p className="StatusMessage">{message}</p>);
}

function GameCode(props) {
    let game_code = window.location.pathname.split("/game")[1].split('/')[1]
    let game_link = window.location.href;
    let [ShowLink, setShowLink] = useState(false)

    if (!ShowLink) {
        return (<div onMouseOver={() => setShowLink(true)} className="GameCodeContainer">
            <p>Game Code: {game_code}</p>
            <FontAwesomeIcon icon="fa-solid fa-clipboard"/>
        </div>);
    } else {
        return (<div>
            <ReactTooltip effect="solid"/>
            <CopyToClipboard text={game_link}>
                <div onMouseLeave={() => setShowLink(false)} data-tip="Click to Copy!" className="GameCodeContainer">
                    <p>{game_link}</p>
                    <FontAwesomeIcon className="GameCodeClipIcon" icon="fa-solid fa-clipboard"/>
                </div>
            </CopyToClipboard>

            )
        </div>);
    }


}

function EndGamePopUp(props) {
    const navigate = useNavigate();


    function buttonClick(e) {
        navigate("/");

    }

    if (props.display) {
        return (<div className="PopUpModal">
            <h2>Game Over</h2>
            {/*<h3>{props.player_order[0].name} Wins</h3>*/}
            {props.player_order.map(player => (
                <p key={player.id}>{player.name} {player.score}</p>
            ))}
            <button onClick={buttonClick}>Back to Main Menu</button>
        </div>);
    }


}

function Game() {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const {code} = useParams();
    let [dice_1, setDice_1] = useState(0);
    let [dice_2, setDice_2] = useState(0);
    let {
        displayModal, setDisplayModal, modalText, setModalText, modalTittle, setModalTittle
    } = React.useContext(PopUpContext);
    let [playerOrder, setPlayerOrder] = useState([]);
    let [gameOver, setGameOver] = useState(false);


    useEffect(() => {
        let game_code = code;
        if (game_code === "") {
            console.log("Null Code")
            navigate("/");

        }
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        socket.on("join_response", (data) => {
            if (!data["success"]) {
                navigate("/");
                if (!data["isSignedIn"]) {
                    console.log(data["isSignedIn"])
                    setModalText("You need to login with google to start a new game or join an existing one.")
                    setModalTittle("Login Required")
                    setDisplayModal(true)
                } else if (!data["game_exist"]) {
                    setModalText("Invalid Game Link/Code")
                    setModalTittle("Game Does Not Exist")
                    setDisplayModal(true)
                }
            }

        });


        socket.on("connect", () => {

            ws_game_push(["join_game", {"game-code": game_code, "auth-key": cookies.get("auth-key")}])
        });

        socket.on("game_over", (data) => {
            setGameOver(true)
            setPlayerOrder(data["players"]["player_info"])

        });

        socket.on("rolled", async (data) => {
            for (let i = 0; i < 15; i++) {
                setDice_1(Math.floor(Math.random() * 7))
                setDice_2(Math.floor(Math.random() * 7))
                await delay(25)
            }

            setDice_1(data["dice_1"])
            setDice_2(data["dice_2"])

        });


        socket.on("board_info", (data) => {
            setDice_1(data["dice"]["dice_1"])
            setDice_2(data["dice"]["dice_2"])

        });

        ws_game_push(["join_game", {"game-code": game_code, "auth-key": cookies.get("auth-key")}])


        return function cleanup() {
            console.log("game cleanup")
            ws_game_push(["leave_game", {"game-code": game_code}])

        }


    },[]);


    return (<div className="Game">
        <h1>Shut The Box</h1>
        <Board/>
        <div className="InteractionBoxContainer">
            <Dice dice_1={dice_1} dice_2={dice_2}/>
            <ActionButton/>
            <StatusMessage/>
        </div>
        <Players/>
        <GameCode/>
        <EndGamePopUp display={gameOver} player_order={playerOrder}/>
    </div>)
}


export default Game;