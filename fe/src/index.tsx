import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
  uri: 'https://dton.io/graphql/',
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
//todo manifest
//todo fix cancel tx error 
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <TonConnectUIProvider manifestUrl="https://app.toncells.org/tonconnect-manifest.json">
        <App />
      </TonConnectUIProvider>
    </ApolloProvider>
  </React.StrictMode>
);

