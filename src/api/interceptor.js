import axios from "axios";

const apiUrl = "http://localhost:8080/api";

const instance = axios.create({
  baseURL: apiUrl,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAuthLogic = (failedRequest) =>
  axios
    .get(apiUrl + "/admin/auth/token", {
      headers: {
        "x-refresh-token": localStorage.getItem("refreshToken"),
      },
    })
    .then((tokenRefreshResponse) => {
      console.log("Token refreshed");
      localStorage.setItem("token", tokenRefreshResponse.data?.tokens?.token);
      localStorage.setItem(
        "refreshToken",
        tokenRefreshResponse.data.tokens?.refreshToken
      );
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + tokenRefreshResponse.data.tokens.token;
      return Promise.resolve();
    })
    .catch((err) => {
      console.log("Error in refreshAuthLogic", err.message);
      console.error(err.message);
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        localStorage.clear();
        window.location.reload();
      }
      return Promise.reject(err);
    });

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      return refreshAuthLogic(error)
        .then(() => {
          return instance(originalRequest);
        })
        .catch((err) => {
          localStorage.clear();
          window.location.reload();
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  const response = await instance.post("/admin/auth/login", {
    email: username,
    password: password,
  });
  return response;
};

export const logout = async () => {
  await instance.head("/admin/auth/logout", {
    headers: {
      "x-refresh-token": localStorage.getItem("refreshToken"),
    },
  });
  localStorage.clear();
  window.location.reload();
};

export const getProfile = async () => {
  const response = await instance.get("/admin/profile");
  return response.data;
};

export const getTree = async () => {
  const response = await instance.get("/admin/tree");
  return response.data;
};

export const deleteNode = async (id) => {
  console.log("id", id);
  const response = await instance.put(`/admin/block-user`, {
    id: id,
  });
  return response.data;
};

export default instance;
