import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import AuthLayout from "./pages/Auth/layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserLogin from "./wrappers/UserLogin";

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLogin/>,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      }
    ]
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <AuthProvider>
          <RouterProvider router={router}/>
        </AuthProvider>
    </>
);
