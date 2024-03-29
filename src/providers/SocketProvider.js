import { useEffect, useState, createContext } from 'react';

const webSocket = new WebSocket('wss://ws-feed.exchange.coinbase.com');

export const SocketContext = createContext(webSocket);

export const SocketProvider = (props) => {
  const [ws, setWs] = useState(webSocket);

  useEffect(() => {
    const onClose = () => {
      setTimeout(() => {
        setWs(new WebSocket('wss://ws-feed.exchange.coinbase.com'));
      }, 3000);
    };

    ws.addEventListener('close', onClose);

    return () => {
      ws.removeEventListener('close', onClose);
    };
  }, [ws, setWs]);

  return (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
  );
};
