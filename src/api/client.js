// src/api/client.js
import axios from "axios";

export const client = axios.create({
  baseURL: "https://hackathon-backend-563488838141.us-central1.run.app",
});

// 全リクエストにトークン付与
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
