import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster as SonnerToaster } from "sonner";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <App />
    <SonnerToaster position="top-left" richColors duration={1500} />
  </StrictMode>
);
