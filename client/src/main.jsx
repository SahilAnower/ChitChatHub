import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { VITE_GOOGLE_CLIENT_ID } from "./globals.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="716886604204-l2m5ts7csiqurmua583nvpk4mjrcsknc.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
