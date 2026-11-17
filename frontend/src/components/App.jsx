import "../index.css";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { InfoTooltip } from "./InfoTooltip/InfoTooltip";
import CurrentUserContext from "../contexts/CurrentUserContext";
import api from "../utils/api";
import * as auth from "../utils/auth";

const CLOSED_TOOLTIP = { isOpen: false, isSuccess: false, message: "" };

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [session, setSession] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(() =>
    Boolean(localStorage.getItem("jwt")),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const [infoTooltip, setInfoTooltip] = useState(CLOSED_TOOLTIP);

  const isLoggedIn = session !== null;

  // Al recargar, comprueba el token guardado antes de abrir las rutas.
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      return;
    }

    let active = true;

    auth
      .checkToken(token)
      .then((user) => {
        if (!active) return;
        setSession({ token, email: user.email });
      })
      .catch((error) => {
        if (!active) return;

        const invalidToken = error.status === 400 || error.status === 401;
        if (invalidToken) {
          localStorage.removeItem("jwt");
        }

        setInfoTooltip({
          isOpen: true,
          isSuccess: false,
          message: invalidToken
            ? "Tu sesión ya no es válida. Inicia sesión de nuevo."
            : "No se pudo comprobar tu sesión. Revisa tu conexión y recarga la página.",
        });
      })
      .finally(() => {
        if (active) setIsCheckingToken(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // El perfil y las tarjetas solo se solicitan con una sesión validada.
  useEffect(() => {
    if (!session) return;

    let active = true;

    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, initialCards]) => {
        if (!active) return;
        setCurrentUser(user);
        setCards(initialCards);
      })
      .catch((error) => {
        if (!active) return;
        console.error(error);
        setDataError(
          error.message || "No se pudieron cargar el perfil y las tarjetas.",
        );
      })
      .finally(() => {
        if (active) setIsLoadingData(false);
      });

    return () => {
      active = false;
    };
  }, [session, reloadCount]);

  function handleCloseInfoTooltip() {
    setInfoTooltip(CLOSED_TOOLTIP);
  }

  function handleRegister({ email, password }) {
    setIsSubmitting(true);

    return auth
      .register({ email, password })
      .then(() => {
        setInfoTooltip({
          isOpen: true,
          isSuccess: true,
          message: "¡Te has registrado correctamente! Ahora inicia sesión.",
        });
        navigate("/signin", { replace: true });
      })
      .catch((error) => {
        console.error(error);
        setInfoTooltip({
          isOpen: true,
          isSuccess: false,
          message:
            "No se pudo completar el registro. Revisa tus datos e inténtalo de nuevo.",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleLogin({ email, password }) {
    setIsSubmitting(true);

    return auth
      .authorize({ email, password })
      .then(({ token }) => {
        if (!token) {
          throw new Error("El servidor no devolvió un token.");
        }

        // El correo se obtiene del servidor al comprobar el token.
        return auth.checkToken(token).then((user) => ({
          token,
          email: user.email,
        }));
      })
      .then((newSession) => {
        localStorage.setItem("jwt", newSession.token);
        setIsLoadingData(true);
        setDataError("");
        setSession(newSession);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error(error);
        setInfoTooltip({
          isOpen: true,
          isSuccess: false,
          message:
            error.status === 400 || error.status === 401
              ? "No se pudo iniciar sesión. Revisa tu correo y contraseña."
              : "No se pudo iniciar sesión. Inténtalo de nuevo en unos momentos.",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setSession(null);
    setCurrentUser({});
    setCards([]);
    setInfoTooltip(CLOSED_TOOLTIP);
    navigate("/signin", { replace: true });
  }

  function handleRetryDataLoad() {
    setIsLoadingData(true);
    setDataError("");
    setReloadCount((count) => count + 1);
  }

  function handleUpdateUser(userData) {
    return api.updateUserInfo(userData).then((newData) => {
      setCurrentUser(newData);
      return newData;
    });
  }

  function handleUpdateAvatar(data) {
    return api.updateUserAvatar(data).then((newData) => {
      setCurrentUser(newData);
      return newData;
    });
  }

  function handleAddPlaceSubmit(data) {
    return api.addCard(data).then((newCard) => {
      setCards((currentCards) => [newCard, ...currentCards]);
      return newCard;
    });
  }

 function handleCardLike(card, isLiked) {
  return api.changeLikeCardStatus(card._id, !isLiked)
    .then((updatedCard) => {
      setCards((currentCards) => currentCards.map((item) =>
        item._id === updatedCard._id ? updatedCard : item,
      ));
    })
    .catch((error) => console.error(error));
}

  function handleCardDelete(card) {
    return api.deleteCard(card._id).then(() => {
      setCards((currentCards) =>
        currentCards.filter((item) => item._id !== card._id),
      );
    });
  }

  return (
    <div className="page__content">
      <CurrentUserContext.Provider
        value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
      >
        <Header
          isLoggedIn={isLoggedIn}
          email={session?.email ?? ""}
          onLogout={handleLogout}
        />

        {isCheckingToken ? (
          <main className="auth">
            <p className="auth__text" role="status">
              Comprobando sesión...
            </p>
          </main>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  {isLoadingData ? (
                    <main className="auth">
                      <p className="auth__text" role="status">
                        Cargando perfil y tarjetas...
                      </p>
                    </main>
                  ) : dataError ? (
                    <main className="auth">
                      <p className="auth__text" role="alert">
                        {dataError}
                      </p>
                      <button
                        className="auth__button auth__button_type_retry"
                        type="button"
                        onClick={handleRetryDataLoad}
                      >
                        Reintentar
                      </button>
                    </main>
                  ) : (
                    <Main
                      cards={cards}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      onAddPlace={handleAddPlaceSubmit}
                    />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register
                    onRegister={handleRegister}
                    isSubmitting={isSubmitting}
                  />
                )
              }
            />
            <Route
              path="/signin"
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} isSubmitting={isSubmitting} />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? "/" : "/signin"} replace />}
            />
          </Routes>
        )}

        <InfoTooltip
          isOpen={infoTooltip.isOpen}
          isSuccess={infoTooltip.isSuccess}
          message={infoTooltip.message}
          onClose={handleCloseInfoTooltip}
        />
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}
