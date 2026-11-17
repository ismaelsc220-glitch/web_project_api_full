import { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";

export default function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const { name, link } = card;
  const { currentUser } = useContext(CurrentUserContext);

  const isLiked = card.likes?.includes(currentUser._id) ?? false;
  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  const ownerId = typeof card.owner === "string" ? card.owner : card.owner?._id;
  const isOwn = Boolean(currentUser._id) && ownerId === currentUser._id;

  function handleLikeClick() {
    onCardLike(card, isLiked);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="card">
      <img
        className="card__img"
        src={link}
        alt={name}
        onClick={() => onCardClick(card)}
      />

      {isOwn && (
        <button
          aria-label="Delete card"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
        />
      )}

      <div className="card__description">
        <h2 className="card__title">{name}</h2>

        <button
          aria-label="Like card"
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        />
      </div>
    </li>
  );
}