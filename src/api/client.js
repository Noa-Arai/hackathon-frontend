// src/api/client.js
import axios from "axios";

const BASE_URL = "https://hackathon-backend-563488838141.us-central1.run.app";

export const client = axios.create({
  baseURL: BASE_URL,
});

// ★ 重要：毎回 Authorization ヘッダーを必ず付ける
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
