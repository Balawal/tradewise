import { useState, useEffect } from 'react';

let stockWebSocketInstance = null;
let cryptoWebSocketInstance = null;
let stockSubscribers = [];
let cryptoSubscribers = [];

// Utility function to handle WebSocket messages
const handleWebSocketMessage = (data, subscribers) => {
  if (data.T === 'error') {
    console.error('WebSocket error:', data.msg);
    return;
  }

  if (data.T === 'subscription') {
    console.log('Subscription status:', data);
    return;
  }

  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item && item.S) {
        console.log('Updating market data for stock symbol:', item.S, 'with price:', item.p);
        subscribers.forEach(callback => {
          if (typeof callback === 'function') {
            callback(item);
          }
        });
      }
    });
  } else {
    console.log('Unexpected WebSocket data format:', data);
  }
};

const handleCryptoWebSocketMessage = (data, subscribers) => {
  if (data.T === 'error') {
    console.error('WebSocket error:', data.msg);
    return;
  }

  if (data.T === 'subscription') {
    console.log('Subscription status:', data);
    return;
  }

  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item && item.S) {
        console.log('Updating market data for crypto symbol:', item.S, 'with price:', item.p);
        subscribers.forEach(callback => {
          if (typeof callback === 'function') {
            callback(item);
          }
        });
      }
    });
  } else {
    console.log('Unexpected WebSocket data format:', data);
  }
};

// WebSocket hook for stocks
export const useStockWebSocket = (onMessageCallback) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!onMessageCallback || typeof onMessageCallback !== 'function') {
      console.log('onMessageCallback is not a valid function/stocks:', onMessageCallback);
      return;
    }
  
    if (!stockWebSocketInstance) {
      initializeStockWebSocket();
    }
  
    stockSubscribers.push(onMessageCallback);
  
    return () => {
      stockSubscribers = stockSubscribers.filter(sub => sub !== onMessageCallback);
    };
  }, [onMessageCallback]);

  const initializeStockWebSocket = () => {
    stockWebSocketInstance = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

    stockWebSocketInstance.onopen = () => {
      console.log('Stock WebSocket connection opened.');
      stockWebSocketInstance.send(JSON.stringify({
        action: 'auth',
        key: 'PKH9EBVMYSPWD2P7CN1F',
        secret: 'Rj6GHHhlEauKnnsyk6QN8JNczpZacRZbwdnnZ4a5',
      }));
      setIsConnected(true);
    };

    stockWebSocketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data, stockSubscribers);
    };

    stockWebSocketInstance.onerror = (error) => {
      console.error('Stock WebSocket error:', error.message);
    };

    stockWebSocketInstance.onclose = (event) => {
      console.log('Stock WebSocket connection closed:', event.code, event.reason);
      stockWebSocketInstance = null;
      setIsConnected(false);
      
    };
  };

  return { isConnected };
};

// WebSocket hook for crypto
export const useCryptoWebSocket = (onMessageCallback) => {
  const [isConnectedCrypto, setIsConnectedCrypto] = useState(false);

  useEffect(() => {
    if (!onMessageCallback || typeof onMessageCallback !== 'function') {
      console.log('onMessageCallback is not a valid function/crypto:', onMessageCallback);
      return;
    }
  
    if (!cryptoWebSocketInstance) {
      initializeCryptoWebSocket();
    }
  
    cryptoSubscribers.push(onMessageCallback);
  
    return () => {
      cryptoSubscribers = cryptoSubscribers.filter(sub => sub !== onMessageCallback);
    };
  }, [onMessageCallback]);

  const initializeCryptoWebSocket = () => {
    cryptoWebSocketInstance = new WebSocket('wss://stream.data.alpaca.markets/v1beta3/crypto/us');

    cryptoWebSocketInstance.onopen = () => {
      console.log('Crypto WebSocket connection opened.');
      cryptoWebSocketInstance.send(JSON.stringify({
        action: 'auth',
        key: 'PKH9EBVMYSPWD2P7CN1F',
        secret: 'Rj6GHHhlEauKnnsyk6QN8JNczpZacRZbwdnnZ4a5',
      }));
      setIsConnectedCrypto(true);
    };

    cryptoWebSocketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleCryptoWebSocketMessage(data, cryptoSubscribers);
    };

    cryptoWebSocketInstance.onerror = (error) => {
      console.error('Crypto WebSocket error:', error.message);
    };

    cryptoWebSocketInstance.onclose = (event) => {
      console.log('Crypto WebSocket connection closed:', event.code, event.reason);
      cryptoWebSocketInstance = null;
      setIsConnectedCrypto(false);
    };
  };


  return { isConnectedCrypto };
  
};

// Utility functions to manage subscriptions
export const subscribeToStockUpdates = (symbols) => {
  if (!stockWebSocketInstance) {
    console.log('Stock WebSocket instance is null. Cannot subscribe yet.');
    return;
  }

  if (stockWebSocketInstance.readyState !== WebSocket.OPEN) {
    console.log('Stock WebSocket is not open. Cannot subscribe.');
    return;
  }

  if (symbols && typeof symbols === 'string') {
    stockWebSocketInstance.send(JSON.stringify({
      action: 'subscribe',
      trades: symbols.split(','),
    }));
  } else {
    console.error('Symbols are not valid:', symbols);
  }
};

export const unsubscribeFromStockUpdates = (symbols) => {
  if (!symbols || typeof symbols !== 'string') {
    return;
  }

  if (stockWebSocketInstance && stockWebSocketInstance.readyState === WebSocket.OPEN) {
    stockWebSocketInstance.send(JSON.stringify({
      action: 'unsubscribe',
      trades: symbols.split(','),
    }));
  } else {
    console.error('Stock WebSocket is not open. Cannot unsubscribe.');
  }
};

export const subscribeToCryptoUpdates = (symbols) => {
  if (!cryptoWebSocketInstance) {
    console.log('Crypto WebSocket instance is null. Cannot subscribe yet.');
    return;
  }

  if (cryptoWebSocketInstance.readyState !== WebSocket.OPEN) {
    console.log('Crypto WebSocket is not open. Cannot subscribe.');
    return;
  }

  if (symbols && typeof symbols === 'string') {
    cryptoWebSocketInstance.send(JSON.stringify({
      action: 'subscribe',
      trades: symbols.split(','),
    }));
  } else {
    console.error('Symbols are not valid:', symbols);
  }
};

export const unsubscribeFromCryptoUpdates = (symbols) => {
  if (!symbols || typeof symbols !== 'string') {
    return;
  }

  if (cryptoWebSocketInstance && cryptoWebSocketInstance.readyState === WebSocket.OPEN) {
    cryptoWebSocketInstance.send(JSON.stringify({
      action: 'unsubscribe',
      trades: symbols.split(','),
    }));
  } else {
    console.error('Crypto WebSocket is not open. Cannot unsubscribe.');
  }
};

export const closeStockWebSocket = () => {
  if (stockWebSocketInstance) {
    stockWebSocketInstance.close();
  }
};

export const closeCryptoWebSocket = () => {
  if (cryptoWebSocketInstance) {
    cryptoWebSocketInstance.close();
  }
};