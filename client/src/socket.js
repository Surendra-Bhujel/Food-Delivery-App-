import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Single shared socket instance for the whole app.
// autoConnect: false lets us control exactly when the connection opens
// (after we know who the logged-in user is), avoiding wasted connections
// for anonymous visitors on the landing page.
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
