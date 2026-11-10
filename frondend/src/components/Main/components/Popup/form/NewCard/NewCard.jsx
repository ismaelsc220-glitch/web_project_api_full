import { useState } from "react";

export default function NewCard({ onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  function handleValidation(event) {
    const input = event.target;
    const value = input.value.trim();
    input.setCustomValidity("");

    if (!value) {
      input.setCustomValidity("Completa este campo.");
    } else if (input.minLength > 0 && value.length < input.minLength) {
      input.setCustomValidity(`Debe contener al menos ${input.minLength} caracteres.`);
    } else if (input.maxLength > 0 && value.length > input.maxLength) {
      input.setCustomValidity(`Debe contener como máximo ${input.maxLength} caracteres.`);
    } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
      input.setCustomValidity("Introduce una URL válida que empiece con http:// o https://.");
    }

    setErrors({ ...errors, [input.name]: input.validationMessage });
    setIsValid(input.form.checkValidity());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrors({
      name: form.elements.name.validationMessage,
      link: form.elements.link.validationMessage,
    });
    if (!form.checkValidity()) return;
    return onAddPlace({ name: name.trim(), link: link.trim() });
  }

  return (
    <form
      className="popup__form"
      name="card-form"
      id="new-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className={`popup__input ${errors.name ? "popup__input_type_error" : ""}`}
          id="card-name"
          maxLength={30}
          minLength={2}
          name="name"
          placeholder="Título"
          aria-label="Título"
          required
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.name)}
          aria-describedby="card-name-error"
        />
        <span
          className={`popup__input-error ${errors.name ? "popup__input-error_active" : ""}`}
          id="card-name-error"
          aria-live="polite"
        >
          {errors.name}
        </span>
      </label>
      <label className="popup__field">
        <input
          className={`popup__input ${errors.link ? "popup__input_type_error" : ""}`}
          id="card-link"
          name="link"
          placeholder="Enlace a la imagen"
          aria-label="Enlace a la imagen"
          required
          type="url"
          pattern="https?://.+"
          value={link}
          onChange={(event) => {
            setLink(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.link)}
          aria-describedby="card-link-error"
        />
        <span
          className={`popup__input-error ${errors.link ? "popup__input-error_active" : ""}`}
          id="card-link-error"
          aria-live="polite"
        >
          {errors.link}
        </span>
      </label>
      <button className="button popup__button" type="submit" disabled={!isValid}>
        Guardar
      </button>
    </form>
  );
}
