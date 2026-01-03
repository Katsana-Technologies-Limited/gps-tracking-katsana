import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <SonnerToaster position="top-left" richColors duration={1500} />
    </QueryClientProvider>
  </StrictMode>
);
