import { useState } from "react";
import { Link } from "react-router-dom";
import "../../blocks/auth.css";

export default function Login({ onLogin, isSubmitting }) {
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
    return onLogin({ email: email.trim(), password });
  }

  return (
    <main className="auth">
      <h1 className="auth__title">Iniciar sesión</h1>
      <form className="auth__form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="login-email">Correo electrónico</label>
        <input
          className={`auth__input ${errors.email ? "auth__input_type_error" : ""}`}
          type="email"
          pattern={"[^\\s@]+@[^\\s@]+\\.[^\\s@]+"}
          id="login-email"
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
          aria-describedby="login-email-error"
          disabled={isSubmitting}
          required
        />
        <span
          className={`auth__input-error ${errors.email ? "auth__input-error_active" : ""}`}
          id="login-email-error"
          aria-live="polite"
        >
          {errors.email}
        </span>
        <label htmlFor="login-password">Contraseña</label>
        <input
          className={`auth__input ${errors.password ? "auth__input_type_error" : ""}`}
          type="password"
          id="login-password"
          name="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            handleValidation(event);
          }}
          onBlur={handleValidation}
          aria-invalid={Boolean(errors.password)}
          aria-describedby="login-password-error"
          disabled={isSubmitting}
          required
        />
        <span
          className={`auth__input-error ${errors.password ? "auth__input-error_active" : ""}`}
          id="login-password-error"
          aria-live="polite"
        >
          {errors.password}
        </span>
        <button className="auth__button" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
      <p className="auth__text">
        ¿Aún no eres miembro?
        <Link className="auth__link" to="/signup">
          Regístrate aquí
        </Link>
      </p>
    </main>
  );
}
