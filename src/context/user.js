import {createContext} from "react";

const UserContext = createContext({
    isSignedIn: false,
    setisSignedIn: () => {
    }, name: "",
    setName: () => {
    }
});

export default UserContext;