export default function RemoveCard({ onConfirm }) {
  function handleSubmit(event) {
    event.preventDefault();
    onConfirm();
  }

  return (
    <form
      className="popup__form popup__form_type_confirmation"
      id="remove-card-form"
      name="remove-card-form"
      onSubmit={handleSubmit}
    >
      <button
        className="button popup__button popup__button_type_confirmation"
        type="submit"
      >
        Sí
      </button>
    </form>
  );
}
