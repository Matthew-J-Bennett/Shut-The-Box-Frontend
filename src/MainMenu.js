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
        return (<div><button onClick={() => setDisplay(true)}>How to Play</button></div>);
    } else {
        return (<div>
            <button>How to Play</button>
            <div className="PopUpModal HowToPlay">
                <h1>How to Play</h1>
                <p>Game Rules:</p>
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