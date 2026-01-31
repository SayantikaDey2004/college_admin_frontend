import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Bounce, ToastContainer } from "react-toastify";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import AuthProvider from "./context/auth/auth.provider.tsx";
import NotificationProvider from "./context/notification/notification.provider.tsx";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
);
