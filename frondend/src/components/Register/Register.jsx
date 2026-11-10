import { useState } from "react";
import { Link } from "react-router-dom";
import "../../blocks/auth.css";

export default function Register({ onRegister, isSubmitting }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  function handleValidation(event) {
    const input = event.target;
    input.setCustomValidity("");

    if (!input.value.trim()) {
      input.setCustomValidity("Completa este campo.");
    } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
      input.setCustomValidity("Introduce un correo electrónico válido.");
    }

    setErrors({ ...errors, [input.name]: input.validationMessage });
    setIsValid(input.form.checkValidity());
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrors({
      email: form.elements.email.validationMessage,
      password: form.elements.password.validationMessage,
    });
    if (isSubmitting || !form.checkValidity()) return;
    return onRegister({ email: email.trim(), password });
  }

  return (
    <main className="auth">
      <h1 className="auth__title">Registrarse</h1>
      <form className="auth__form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="register-email">Correo electrónico</label>
        <input
          className={`auth__input ${errors.email ? "auth__input_type_error" : ""}`}
          type="email"
          pattern={"[^\\s@]+@[^\\s@]+\\.[^\\s@]+"}
          id="register-email"
          name="email"
          autoComplete="username"
          placeholder="Correo electrónico"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.email)}
          aria-describedby="register-email-error"
          disabled={isSubmitting}
          required
        />
        <span
          className={`auth__input-error ${errors.email ? "auth__input-error_active" : ""}`}
          id="register-email-error"
          aria-live="polite"
        >
          {errors.email}
        </span>
        <label htmlFor="register-password">Contraseña</label>
        <input
          className={`auth__input ${errors.password ? "auth__input_type_error" : ""}`}
          type="password"
          id="register-password"
          name="password"
          autoComplete="new-password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.password)}
          aria-describedby="register-password-error"
          disabled={isSubmitting}
          required
        />
        <span
          className={`auth__input-error ${errors.password ? "auth__input-error_active" : ""}`}
          id="register-password-error"
          aria-live="polite"
        >
          {errors.password}
        </span>
        <button className="auth__button" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <p className="auth__text">
        ¿Ya eres miembro?
        <Link className="auth__link" to="/signin">
          Inicia sesión aquí
        </Link>
      </p>
    </main>
  );
}
