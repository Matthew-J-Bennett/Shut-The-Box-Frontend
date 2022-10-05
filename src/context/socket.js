import {io} from "socket.io-client";
import {createContext} from "react";

export const socket = io(process.env.REACT_APP_ws_url, {path: process.env.REACT_APP_ws_path});
export const SocketContext = createContext();

export function ws_push(data) {
    socket.emit(data[0], data[1])
}

export function ws_game_push(data) {
    socket.emit("game_event", data)
}
