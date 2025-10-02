import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { Web3Provider } from "Web3Provider";
import { GlobalProvider } from "context/global";
import { Toaster } from "react-hot-toast";
            
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Web3Provider>
    <GlobalProvider>
      <App />
      <Toaster/>
    </GlobalProvider>
  </Web3Provider>
);
