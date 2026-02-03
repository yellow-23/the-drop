import { useState, useEffect } from "react";
import "./SuccessModal.css";

function SuccessModal({ isOpen, title = "¡Éxito!", message = "", onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <>
      {isVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="success-icon">✓</div>
            </div>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-message">{message}</p>
            <button className="modal-button" onClick={handleClose}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SuccessModal;
