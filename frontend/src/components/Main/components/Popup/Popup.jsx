import { useEffect } from "react";

export default function Popup(props) {
  const { onClose, title, children, isConfirmation = false } = props;

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <>
      <div className="popup popup_is-opened" id="edit-popup" onClick={handleOverlayClick}>
        <div
          className={`popup__content ${
            !title ? "popup__content_content_image" : ""
          } ${
            isConfirmation ? "popup__content_type_confirmation" : ""
          }`}
        >
          <button
            aria-label="Cerrar ventana emergente"
            className="popup__close"
            type="button"
            onClick={onClose}
          ></button>
          {title && (
            <h3
              className={`popup__title ${
                isConfirmation ? "popup__title_type_confirmation" : ""
              }`}
            >
              {title}
            </h3>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
