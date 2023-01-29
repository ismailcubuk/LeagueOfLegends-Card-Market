import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MyCards from './components/Body/MyCards/MyCards';
import Shop from './components/Body/Shop/Shop';
import Xa from './components/component/Xa';
import { CardContextprovider } from './components/CardContext';

const router = createBrowserRouter([
  {
    path: "shop",
    element: <Shop />
  },
  {
    path: "/",
    element: <Shop />
  },
  {
    path: "MyCards",
    element: <MyCards />
  },
  {
    path: "xa",
    element: <Xa />
  },

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CardContextprovider>
      <RouterProvider router={router} />
    </CardContextprovider>
  </React.StrictMode>
);
