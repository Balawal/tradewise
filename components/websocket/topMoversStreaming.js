import { useEffect, useRef } from 'react';
import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket, useCryptoWebSocket, subscribeToCryptoUpdates, unsubscribeFromCryptoUpdates } from '../../components/websocket/WebSocketManager';


const TopMoversStreaming = (marketData, setMarketData, marketDataCrypto, setMarketDataCrypto) => {
    const stockSymbolsRef = useRef([]);
    const cryptoSymbolsRef = useRef([]);

    useEffect(() => {
        const symbols = marketData.gainers.concat(marketData.losers).map(stock => stock.symbol);
        stockSymbolsRef.current = symbols;
        subscribeToStockUpdates(symbols.join(','));
    
        return () => {
        unsubscribeFromStockUpdates(stockSymbolsRef.current.join(','));
        };
  }, [marketData]);
  
    useEffect(() => {
        const symbolsCrypto = marketDataCrypto.gainers.concat(marketDataCrypto.losers).map(crypto => crypto.symbol);
        cryptoSymbolsRef.current = symbolsCrypto;
        subscribeToCryptoUpdates(symbolsCrypto.join(','));
    
        return () => {
        unsubscribeFromCryptoUpdates(cryptoSymbolsRef.current.join(','));
        };
    }, [marketDataCrypto]);

    const handleWebSocketMessage = (data) => {
        if (data && data.S) {
          setMarketData(prevMarketData => {
            const updatedGainers = prevMarketData.gainers.map(stock => (
              data.S === stock.symbol ? { ...stock, price: data.p } : stock
            ));
            const updatedLosers = prevMarketData.losers.map(stock => (
              data.S === stock.symbol ? { ...stock, price: data.p } : stock
            ));
            return { ...prevMarketData, gainers: updatedGainers, losers: updatedLosers };
          });
        }
      };

  const handleCryptoWebSocketMessage = (data) => {
    if (data && data.S) {
      setMarketDataCrypto(prevMarketData => {
        const updatedGainers = prevMarketData.gainers.map(crypto => (
          data.S === crypto.symbol ? { ...crypto, price: data.p } : crypto
        ));
        const updatedLosers = prevMarketData.losers.map(crypto => (
          data.S === crypto.symbol ? { ...crypto, price: data.p } : crypto
        ));
        return { ...prevMarketData, gainers: updatedGainers, losers: updatedLosers };
      });
    }
  };

  const { isConnected: isStockConnected } = useStockWebSocket(handleWebSocketMessage);
  const { isConnected: isCryptoConnected } = useCryptoWebSocket(handleCryptoWebSocketMessage);

  return { isStockConnected, isCryptoConnected };
};

export default TopMoversStreaming;