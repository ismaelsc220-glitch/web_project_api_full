import { useState } from "react";

export default function EditAvatar({ onUpdateAvatar }) {
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  function handleValidation(event) {
    const input = event.target;
    input.setCustomValidity("");

    if (!input.value.trim()) {
      input.setCustomValidity("Completa este campo.");
    } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
      input.setCustomValidity("Introduce una URL válida que empiece con http:// o https://.");
    }

    setError(input.validationMessage);
    setIsValid(input.form.checkValidity());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(form.elements.avatar.validationMessage);
    if (!form.checkValidity()) return;
    return onUpdateAvatar({ avatar: avatar.trim() });
  }

  return (
    <form className="popup__form" id="avatar-form" noValidate onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          className={`popup__input ${error ? "popup__input_type_error" : ""}`}
          name="avatar"
          id="avatarInput"
          placeholder="Enlace a la imagen"
          aria-label="Enlace a la imagen"
          required
          type="url"
          pattern="https?://.+"
          value={avatar}
          onChange={(event) => {
            setAvatar(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(error)}
          aria-describedby="avatarInput-error"
        />
        <span
          className={`popup__input-error ${error ? "popup__input-error_active" : ""}`}
          id="avatarInput-error"
          aria-live="polite"
        >
          {error}
        </span>
      </label>
      <button className="button popup__button" type="submit" disabled={!isValid}>
        Guardar
      </button>
    </form>
  );
}
