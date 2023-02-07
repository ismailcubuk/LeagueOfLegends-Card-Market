import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CardContextprovider } from './components/component/CardContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CardContextprovider>
      <App />
    </CardContextprovider>
  </React.StrictMode>
);
