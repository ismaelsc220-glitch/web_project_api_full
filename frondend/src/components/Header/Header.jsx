import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.svg";

export default function Header({ isLoggedIn, email, onLogout }) {
  const { pathname } = useLocation();
  const isSignupPage = pathname === "/signup";

  return (
    <header className="header page__section">
      <img
        alt="Logotipo Around The U.S."
        className="logo header__logo"
        src={logo}
      />
      <nav className="header__nav" aria-label="Cuenta">
        {isLoggedIn ? (
          <>
            <p className="header__email">{email}</p>
            <button className="header__logout" type="button" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            className="header__link"
            to={isSignupPage ? "/signin" : "/signup"}
          >
            {isSignupPage ? "Iniciar sesión" : "Regístrate"}
          </Link>
        )}
      </nav>
    </header>
  );
}