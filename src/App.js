import React, {useEffect, useMemo, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainMenu from "./MainMenu";
import Game from "./Game";
import NotFound from './NotFound';
import {GoogleOAuthProvider} from "@react-oauth/google";
import {socket, SocketContext} from './context/socket';
import UserContext from "./context/user";
import './App.css';
import Cookies from "universal-cookie";
import PopUpModal from "./PopUpModal";
import PopUpContext from "./context/popup";
import {CookieConsent} from "react-cookie-consent";

const cookies = new Cookies();


function App(props) {
    let [displayModal, setDisplayModal] = useState(false);
    let [modalText, setModalText] = useState("Some Text Text");
    let [modalTittle, setModalTittle] = useState("Tittle Text");


    const [isSignedIn, setIsSignedIn] = useState(false);
    const [name, setName] = useState("");


    const popup_value = useMemo(
        () => ({
            displayModal,
            setDisplayModal,
            modalText,
            setModalText,
            setModalTittle,
            modalTittle,
        }),
        [displayModal, modalText, modalTittle]
    );

    const user_value = useMemo(
        () => ({isSignedIn, setIsSignedIn, name, setName}),
        [isSignedIn, name]
    );

    useEffect(() => {
        async function authUser() {
            const url = process.env.REACT_APP_api_url + "/auth"
            const res = await fetch(url, {
                mode: 'cors',
                method: "GET",
                credentials: 'include',
            })
            const data = await res.json()
            // console.log(data)
            setIsSignedIn(data.authenticated)
            var future = new Date();
            cookies.set('auth-key', cookies.get("auth-key"), {
                path: '/',
                expires: new Date(future.setDate(future.getDate() + 30))
            });
            if (data.authenticated) {
                setName(data.name)

            }
        }

        authUser();

    }, [])


    return (<SocketContext.Provider value={socket}>
            <PopUpContext.Provider value={popup_value}>
                <PopUpModal/>
                <GoogleOAuthProvider
                    clientId="698361859374-93sgdcg9f2afou64aa8isltoeioeindk.apps.googleusercontent.com">
                    <UserContext.Provider value={user_value}>
                        <Router>
                            <Routes>
                                <Route exact path='/' element={<MainMenu/>}></Route>
                                <Route exact path='/game/:code' element={<Game/>}></Route>
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </Router>
                    </UserContext.Provider>

                </GoogleOAuthProvider>
                <CookieConsent>This website uses strictly necessary cookies only</CookieConsent>
            </PopUpContext.Provider>

        </SocketContext.Provider>
    );
}


export default App;