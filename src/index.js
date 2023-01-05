import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from './contexts/ThemeContext';

import './index.css';
import App from './App';

import { SocketProvider } from './providers/SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </SocketProvider>
  </React.StrictMode>
);
