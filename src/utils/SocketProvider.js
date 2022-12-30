import { createContext } from 'react';

const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

export const SocketContext = createContext(ws);

export const SocketProvider = (props) => (
  <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);
