import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

//todo manifest
//todo fix cancel tx error 
root.render(
  <React.StrictMode>
      <TonConnectUIProvider manifestUrl="https://app.toncells.org/tonconnect-manifest.json">
        <App />
      </TonConnectUIProvider>
  </React.StrictMode>
);

