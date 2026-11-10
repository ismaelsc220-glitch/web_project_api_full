export class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = { ...headers };
  }

  _checkResponse(res) {
    if (res.ok) return res.json();

    const error = new Error(
      res.status === 401 || res.status === 403
        ? "La API de Around rechazó su credencial. Revisa VITE_AROUND_API_TOKEN en .env.local."
        : `La solicitud a Around falló (${res.status}). Inténtalo de nuevo.`,
    );
    error.status = res.status;
    return Promise.reject(error);
  }

  _request(path, options = {}) {
    if (!this.headers.authorization) {
      return Promise.reject(new Error(
        "Configura VITE_AROUND_API_TOKEN en .env.local y reinicia el servidor para cargar el perfil y las tarjetas.",
      ));
    }

    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: this.headers,
    }).then(this._checkResponse);
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  getInitialCards() {
    return this._request("/cards/");
  }

  updateUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateUserAvatar({ avatar }) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  addCard({ name, link }) {
    return this._request("/cards/", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, { method: "DELETE" });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return this._request(`/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
    });
  }
}

// El JWT del servicio de autenticación no reemplaza esta credencial de Around.
const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "6e7274ec-4c01-409c-bee4-35acba7121f9",
    "Content-Type": "application/json",
  },
});

export default api;
