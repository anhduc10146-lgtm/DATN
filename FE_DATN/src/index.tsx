import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import socket from "./SocketManager";
import Routes from './routes/index'
import reportWebVitals from './reportWebVitals';
import './global.css';

socket.connect();

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet titleTemplate="%s" defaultTitle="DATN">
        <meta name="description" content="DATN" />
      </Helmet>
      <Routes />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
