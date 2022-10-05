import {socket, ws_game_push} from "./context/socket";
import {useEffect, useState} from "react";
import {protocol} from "socket.io-client";


function Number(props) {
    function Clicked(e) {
        ws_game_push(["number_clicked", {"number": props.number}])

    }

    if (props.used !== true) {
        return (<div onClick={Clicked} className="Number">
            <p className="Num">{props.number}</p>
            <p  className="NumIndicator">&#8205;</p>
        </div>);
    } else {
        return (<div className="Number SelectedNumber">
            <p className="Num">{props.number}</p>
            <p className="NumIndicator">X</p>
        </div>)
    }
}


function Board() {
    let [board, setBoard] = useState([]);

    useEffect(() => {
        socket.on("board_info", (data) => {
            setBoard(data.numbers)
        });


    }, [])

    return (
        <div className="BoardContainer">
            <div className="Board">
                {board.map(number => (
                    <Number number={number.number} key={number.number} used={number.used}/>
                ))}
            </div>
        </div>)
}

export default Board;