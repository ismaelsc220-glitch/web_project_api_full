import "../../blocks/info-tooltip.css";

export function InfoTooltip({
  isOpen,
  onClose,
  message,
  isSuccess
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="info-tooltip">
      <div className="info-tooltip__content">

        <div
          className={`info-tooltip__icon ${
            isSuccess
              ? "info-tooltip__icon_type_success"
              : "info-tooltip__icon_type_error"
          }`}
          aria-hidden="true"
        />

        <p className="info-tooltip__message">
          {message}
        </p>

        <button
          className="info-tooltip__close"
          type="button"
          aria-label="Cerrar ventana"
          onClick={onClose}
        >
          ×
        </button>

      </div>
    </div>
  );
}