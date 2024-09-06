const API_KEY = "CKJJREB4A302LBHA9DME";
const API_SECRET = "xZMkcN9Ua3c7dFkPMitGc3gcKo4oQew29qkfNcAm";
const FEED = "iex"; // or "sip" based on your subscription
const URL = `wss://stream.data.sandbox.alpaca.markets/v2/${FEED}`;

let socket;

export const connectWebSocket = (onMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket is already open");
    return;
  }

  socket = new WebSocket(URL);

  socket.onopen = () => {
    console.log("WebSocket connection established");
    const authMsg = JSON.stringify({
      action: "auth",
      key: API_KEY,
      secret: API_SECRET,
    });
    socket.send(authMsg);
    console.log("Sent auth message:", authMsg);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    if (data[0]?.msg === 'authenticated') {
      console.log("Authentication successful");
      const subscribeMsg = JSON.stringify({
        action: "subscribe",
        trades: ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "META", "NFLX", "NVDA", "BA", "IBM", "AMD", "INTC", "CSCO", "WMT"],
        quotes: ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "META", "NFLX", "NVDA", "BA", "IBM", "AMD", "INTC", "CSCO", "WMT"],
        bars: ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "META", "NFLX", "NVDA", "BA", "IBM", "AMD", "INTC", "CSCO", "WMT"],
      });
      socket.send(subscribeMsg);
      console.log("Sent subscribe message:", subscribeMsg);
    } else if (data[0]?.msg === 'authentication failed') {
      console.error("Authentication failed");
    }
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};

export const restartWebSocket = (onMessage) => {
  disconnectWebSocket();
  setTimeout(() => connectWebSocket(onMessage), 1000); // Delay to ensure socket is closed
};