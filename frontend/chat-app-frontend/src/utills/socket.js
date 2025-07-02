// src/utils/socket.js
import { io } from "socket.io-client";

const URL = "http://localhost:2000";

export const socket = io(URL, { autoConnect: false });
