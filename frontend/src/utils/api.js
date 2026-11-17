export class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = { ...headers };
  }

  async _checkResponse(res) {
  if (res.ok) return res.json();

  const body = await res.json().catch(() => null);
  const error = new Error(body?.message || `La solicitud falló (${res.status}).`);
  error.status = res.status;
  throw error;
}

_request(path, options = {}) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return Promise.reject(new Error("Inicia sesión para continuar."));
  }

  return fetch(`${this.baseUrl}${path}`, {
    ...options,
    headers: {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    },
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

const api = new Api({
  baseUrl: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
