import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProSidebarProvider } from "react-pro-sidebar";
import LoadingProvider from "./context/LoadingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LoadingProvider>
    <AuthProvider>
      <ProSidebarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProSidebarProvider>
    </AuthProvider>
  </LoadingProvider>
);
