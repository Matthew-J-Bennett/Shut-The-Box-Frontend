import {createContext} from "react";

const PopUpContext = createContext({
        display: true,
        setDisplay: () => {
        },
        text: "",
        setText: () => {
        },
        title: "",
        setTittle: () => {
        }


    })
;

export default PopUpContext;