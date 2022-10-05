import './App.css';
import React, {useState} from "react";
import UserContext from "./context/user";
import {useGoogleLogin} from "@react-oauth/google";
import Cookies from "universal-cookie";

const cookies = new Cookies();


function Google(props) {
    const {isSignedIn, setIsSignedIn, name, setName} = React.useContext(UserContext);
    const [showLogout, setShowLogout] = useState(false);


    const login = useGoogleLogin({
        onSuccess: tokenResponse => updateLogin(tokenResponse),
    });

    async function updateLogin(tokeResponse) {
        const url = process.env.REACT_APP_api_url + "/v1/auth/google"

        const res = await fetch(url, {
            mode: 'cors',
            method: "POST",
            body: JSON.stringify({
                token: tokeResponse.access_token
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        var future = new Date();
        cookies.set('auth-key', data["auth-key"], {
            path: '/',
            expires: new Date(future.setDate(future.getDate() + 30))
        });

        setIsSignedIn(data.authenticated);
        setName(data.name)

    }


    return (<UserContext.Consumer>
            {(context) => {
                if (!context.isSignedIn) {
                    return <button onClick={() => login()}>Login With Google</button>
                }
                if (context.isSignedIn) {
                    if (!showLogout) {
                        return (<button onMouseOver={() => setShowLogout(true)}>Signed in as {name}</button>)
                    }
                    if (showLogout) {
                        return (<button onMouseOut={() => setShowLogout(false)}>Logout</button>)
                    }


                }
            }}

        </UserContext.Consumer>

    )
}


export default Google