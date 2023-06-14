import { reactive, onMounted } from "vue";
import { io, Socket } from "socket.io-client";

interface State {
  connected: boolean;
  fooEvents: any[];
  barEvents: any[];
}

export const state: State = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = "https://pager.brohosting.eu/";

export const socket: Socket = io(URL as string, {
  path: '/socket.io/',
  transports: ["websocket", "polling"] // use WebSocket first, if available
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});