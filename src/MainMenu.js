import './App.css';
import React, {useState} from "react";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom";
import Google from "./Google";
import UserContext from "./context/user";
import PopUpContext from "./context/popup";


const cookies = new Cookies();


function HowToPlay() {
    let [display, setDisplay] = useState(false)


    if (!display) {
        return (<div>
            <button onClick={() => setDisplay(true)}>How to Play</button>
        </div>);
    } else {
        return (<div>
            <button>How to Play</button>
            <div className="HowToPlay">
                <h3>How to Play - Shut The Box</h3>
                <p>Game Rules:</p>
                <ol>
                    <li>Roll the dice and select either the numbers rolled on each dice or the combined number.</li>
                    <li>If you want to select then individual numbers then they must both be not already selected.</li>
                    <li>Keep rolling the dice until you can't select any more numbers.</li>
                    <li>Every number you select gets added to your total score.</li>
                    <li>The Player with the highest score at the end of all the rounds is the winner.</li>
                </ol>
                <p>Help Me!</p>
                <ul>
                    <li>You must login on the main menu using a google account to play.</li>
                    <li>After starting a new game players can join by entering the game code given to them by the player who started the new game</li>
                    <li>Once a game has started no new players are allowed to join</li>
                </ul>
                <button style={{width: "unset"}} onClick={() => setDisplay(false)}>Close</button>
            </div>
        </div>)
    }
}

function MainMenu() {
    const navigate = useNavigate();
    let {isSignedIn, setIsSignedIn, name, setName} = React.useContext(UserContext);
    let {
        displayModal,
        setDisplayModal,
        modalText,
        setModalText,
        modalTittle,
        setModalTittle
    } = React.useContext(PopUpContext);


    async function handleNewGame(e) {
        const url = process.env.REACT_APP_api_url + "/game/create"

        const res = await fetch(url, {
            credentials: 'include',
            mode: 'cors',
            method: "POST",
            body: JSON.stringify({'auth-key': cookies.get("auth-key")}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data["authenticated"]) {
            navigate("/game/" + data["code"]);
        } else {
            loginRequired()
        }

    }

    async function gameCodeChange(e) {
        if (e.target.value.length === 5) {
            const url = process.env.REACT_APP_api_url + "/game/valid"

            const res = await fetch(url, {
                credentials: 'include',
                mode: 'cors',
                method: "POST",
                body: JSON.stringify({'auth-key': cookies.get("auth-key"), "game-code": e.target.value}),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if (isSignedIn) {
                if (data["valid"]) {
                    navigate("/game/" + e.target.value);
                } else {
                    console.log("Wrong Code")
                }
            } else {
                loginRequired()
            }

        }
    }

    function loginRequired() {
        setModalText("You need to login with google to start a new game or join an existing one.")
        setModalTittle("Login Required")
        setDisplayModal(true)
    }

    function openHowToPlay() {
        setModalText("Game Instructions!")
        setModalTittle("How to Play")
        setDisplayModal(true)
    }


    return (<div className="App">
        <header className="App-header">
            <h1>Shut The Box</h1>

            <div className="Main-Menu">
                <button onClick={handleNewGame}>New Game</button>

                <input placeholder="Enter Game Join Code" onInput={gameCodeChange}/>
                <Google/>


                <HowToPlay/>
                <p style={{fontSize: "medium", marginBottom: "0"}}>Built by Matthew Bennett</p>
            </div>


        </header>
    </div>)
}


export default MainMenu;