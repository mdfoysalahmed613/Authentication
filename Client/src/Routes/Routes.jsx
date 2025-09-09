import React, { Children } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import EmailVerify from "../Pages/EmailVerify";
import ResetPassword from "../Pages/ResetPassword";
import Register from "../Pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "email-verify", Component: EmailVerify },
      { path: "reset-password", Component: ResetPassword },
      { path: "register" ,Component: Register},
      
    ],
  },
]);

export default router;
