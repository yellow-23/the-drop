import React, { createContext, useState, useContext } from "react";
import Toast from "../Components/utils/Toast";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showSuccess = (message) => addToast(message, "success");
  const showError = (message) => addToast(message, "error");
  const showInfo = (message) => addToast(message, "info");
  const showWarning = (message) => addToast(message, "warning");

  return (
    <NotificationContext.Provider
      value={{ addToast, removeToast, showSuccess, showError, showInfo, showWarning }}
    >
      {children}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe usarse dentro de NotificationProvider");
  }
  return context;
}
