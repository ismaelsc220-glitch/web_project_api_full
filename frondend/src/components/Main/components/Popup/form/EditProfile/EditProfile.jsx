import { useState, useContext } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext";

export default function EditProfile({ onUpdateUser }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [name, setName] = useState(currentUser.name || "");
  const [description, setDescription] = useState(currentUser.about || "");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(
    name.trim().length >= 2 && name.trim().length <= 40 &&
    description.trim().length >= 2 && description.trim().length <= 20,
  );

  function handleValidation(event) {
    const input = event.target;
    const value = input.value.trim();
    input.setCustomValidity("");

    if (!value) {
      input.setCustomValidity("Completa este campo.");
    } else if (value.length < input.minLength) {
      input.setCustomValidity(`Debe contener al menos ${input.minLength} caracteres.`);
    } else if (value.length > input.maxLength) {
      input.setCustomValidity(`Debe contener como máximo ${input.maxLength} caracteres.`);
    }

    setErrors({ ...errors, [input.name]: input.validationMessage });
    setIsValid(input.form.checkValidity());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrors({
      name: form.elements.name.validationMessage,
      description: form.elements.description.validationMessage,
    });
    if (!isValid || !form.checkValidity()) return;
    return onUpdateUser({ name: name.trim(), about: description.trim() });
  }

  return (
    <form
      className="popup__form"
      id="edit-profile-form"
      name="profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className={`popup__input ${errors.name ? "popup__input_type_error" : ""}`}
          name="name"
          id="nameInput"
          placeholder="Nombre"
          aria-label="Nombre"
          minLength={2}
          maxLength={40}
          type="text"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.name)}
          aria-describedby="nameInput-error"
        />
        <span
          className={`popup__input-error ${errors.name ? "popup__input-error_active" : ""}`}
          id="nameInput-error"
          aria-live="polite"
        >
          {errors.name}
        </span>
      </label>
      <label className="popup__field">
        <input
          className={`popup__input ${errors.description ? "popup__input_type_error" : ""}`}
          name="description"
          id="descriptionInput"
          placeholder="Acerca de mí"
          aria-label="Acerca de mí"
          type="text"
          minLength={2}
          maxLength={20}
          required
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.description)}
          aria-describedby="descriptionInput-error"
        />
        <span
          className={`popup__input-error ${errors.description ? "popup__input-error_active" : ""}`}
          id="descriptionInput-error"
          aria-live="polite"
        >
          {errors.description}
        </span>
      </label>
      <button className="button popup__button" type="submit" disabled={!isValid}>
        Guardar
      </button>
    </form>
  );
}
