import { ref, reactive, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface State {
  connected: boolean;
}

export const state: State = reactive({
  connected: false,
});

const URL = "https://pager.brohosting.eu/";

export const socket: Socket = io(URL as string, {
  path: "/socket.io/",
  transports: ["websocket", "polling"],
});


let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let retryToastId = 'retryNotification'
let timeoutToast = 'timeOuttoast'
let isRetrying: boolean 

const notifyConnectionLost = () => {
  toast.remove(timeoutToast); 
  toast.error("Connection lost to the server", {
    position: toast.POSITION.TOP_CENTER,
    theme: "dark",
    toastId: timeoutToast
  });
};

const notifyRetry = () => {
  toast.loading("Retrying...", {
    position: toast.POSITION.TOP_CENTER,
    theme: "dark",
    toastId: retryToastId
  });
  retryConnection();
};

const notifyRetryCountdown = (countdownSeconds: number) => {
  toast.update(retryToastId, {
    render: `Retrying in ${countdownSeconds} seconds...`,
    type: toast.TYPE.INFO,
    position: toast.POSITION.TOP_CENTER,
    theme: "dark",
    closeButton: true
  });
};

const notifyTimeoutError = () => {
  toast.error("Connection timeout", {
    position: toast.POSITION.TOP_CENTER,
    theme: "dark",
  });
};

const connect = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Connection timed out"));
    }, 10000);

    socket.on("connect", () => {
      clearTimeout(timeout);
      state.connected = true;
      resolve();
    });

    socket.on("disconnect", () => {
      clearTimeout(timeout);
      state.connected = false;
      notifyConnectionLost();
      reject(new Error("Connection lost"));
    });
  });
};

const retryConnection = () => {
  if (socket.connected) {
    // ...
  }

  const retryDelay = 10000;
  let retryCountdown = retryDelay / 1000;
  notifyRetryCountdown(retryCountdown);

  const retryTimer = setInterval(() => {
    retryCountdown--;


    if (retryCountdown <= 0) {
      clearInterval(retryTimer);
      socket.disconnect();
      notifyTimeoutError();
      toast.remove(retryToastId);
      retryToastId = '';
      return;
    }

    notifyRetryCountdown(retryCountdown);

    if (retryCountdown === 1) {
      // Retry the connection
      socket.connect();
      toast.remove(retryToastId); // Remove the retry toast when the connection is retried
      retryToastId = '';
    }
  }, 1000);

  let connectionRetryAttempted = false; // Add a flag to track connection retry attempts

  // Update retryToastId and remove the retry toast when the connection is reestablished
  socket.on("connect", () => {
    if (!connectionRetryAttempted) {
      connectionRetryAttempted = true; // Set the flag to true to prevent duplicate triggers
      clearInterval(retryTimer);
      toast.update(retryToastId, {
        autoClose: 10000, // Delay before auto-closing the retry toast (10 seconds)
      });
      toast.success("Connection reestablished", {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark",
        toastId: "connStable",
        autoClose: 5000
      });
      retryToastId = '';
    }
  });
};


const startHeartbeat = () => {
  const heartbeatInterval = 15000;

  heartbeatTimer = setInterval(() => {
    if (!socket.connected && retryToastId === null) {
      notifyRetry();
    }
  }, heartbeatInterval);
};

onUnmounted(() => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }
  socket.disconnect();
});

connect()
  .then(() => {
    startHeartbeat();
  })
  .catch(() => {
    notifyConnectionLost();
    notifyRetry();
  });
