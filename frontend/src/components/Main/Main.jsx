import { useState, useContext } from "react";
import Popup from "./components/Popup/Popup";
import NewCard from "./components/Popup/form/NewCard/NewCard";
import EditProfile from "./components/Popup/form/EditProfile/EditProfile";
import EditAvatar from "./components/Popup/form/EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import ImagePopup from "./components/ImagePopup/ImagePopup";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import RemoveCard from "./components/Popup/form/RemoveCard/RemoveCard";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onAddPlace,
}) {
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const { currentUser, handleUpdateUser, handleUpdateAvatar } =
    useContext(CurrentUserContext);

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleProfileSubmit(data) {
    return handleUpdateUser(data)
      .then((newData) => {
        handleClosePopup();
        return newData;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleAvatarSubmit(data) {
    return handleUpdateAvatar(data)
      .then((newData) => {
        handleClosePopup();
        return newData;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleCardDelete(card) {
    handleOpenPopup({
      title: "¿Estás seguro?",
      type: "confirmation",
      children: (
        <RemoveCard onConfirm={() => handleConfirmCardDelete(card)} />
      ),
    });
  }

  function handleConfirmCardDelete(card) {
    return onCardDelete(card)
      .then(() => {
        handleClosePopup();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleClosePopup() {
    setPopup(null);
    setSelectedCard(null);
  }
  function handleAddPlaceSubmit(data) {
    return onAddPlace(data)
      .then((newCard) => {
        handleClosePopup();
        return newCard;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard onAddPlace={handleAddPlaceSubmit} />,
  };
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile onUpdateUser={handleProfileSubmit} />,
  };

  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar onUpdateAvatar={handleAvatarSubmit} />,
  };

  return (
    <>
      <main className="content">
        <section className="profile page__section">
          <button
            aria-label="Cambiar foto de perfil"
            className="profile__avatar-button"
            type="button"
            onClick={() => handleOpenPopup(editAvatarPopup)}
          >
            <img
              className="profile__image"
              src={currentUser.avatar}
              alt="Avatar"
            />
          </button>
          <div className="profile__info">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              aria-label="Editar perfil"
              className="profile__edit-button"
              type="button"
              onClick={() => handleOpenPopup(editProfilePopup)}
            ></button>
            <p className="profile__description">{currentUser.about}</p>
          </div>
          <button
            aria-label="Agregar tarjeta"
            className="profile__add-button"
            type="button"
            onClick={() => handleOpenPopup(newCardPopup)}
          ></button>
        </section>
        <section className="cards page__section">
          <ul className="cards__list">
            {cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={handleCardClick}
                onCardLike={onCardLike}
                onCardDelete={handleCardDelete}
              />
            ))}
          </ul>
        </section>
        {popup && (
          <Popup
            onClose={handleClosePopup}
            title={popup.title}
            isConfirmation={popup.type === "confirmation"}
          >
            {popup.children}
          </Popup>
        )}
        {selectedCard && (
          <Popup onClose={handleClosePopup}>
            <ImagePopup card={selectedCard} />
          </Popup>
        )}
      </main>
    </>
  );
}
