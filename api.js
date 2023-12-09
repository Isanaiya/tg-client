import axios from "axios";

const setCredentials = (username, password) => {
  const token = btoa(`${username}:${password}`);
  api.defaults.headers.common["Authorization"] = `Basic ${token}`;
};

const api = axios.create({
  baseURL: "https://ticketguru-tg.rahtiapp.fi/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const customErrorMessage = "Access denied. Please check your credentials.";
      console.error("Unauthorized access: " + customErrorMessage);

      return Promise.reject({ ...error, message: customErrorMessage });
    }
    return Promise.reject(error);
  }
);

export { api, setCredentials };
