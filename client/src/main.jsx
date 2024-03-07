import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/Route";
import { SidebarProvider } from "./contexts/SidebarContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <AuthProvider>
      <SidebarProvider>
        <AppRouter />
      </SidebarProvider>
    </AuthProvider>
  </UserProvider>
);
