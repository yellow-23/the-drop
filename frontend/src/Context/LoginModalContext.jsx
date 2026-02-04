import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext();

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openLoginModal = (customMessage = "") => {
    setMessage(customMessage);
    setIsOpen(true);
  };

  const closeLoginModal = () => {
    setIsOpen(false);
    setMessage("");
  };

  return (
    <LoginModalContext.Provider
      value={{
        isOpen,
        message,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal debe usarse dentro de LoginModalProvider");
  }
  return context;
}
