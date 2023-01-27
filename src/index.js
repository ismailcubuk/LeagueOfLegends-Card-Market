import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MyCards from './components/Body/MyCards/MyCards';
import Shop from './components/Body/Shop/Shop';

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
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
