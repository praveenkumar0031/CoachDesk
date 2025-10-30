import axios from "axios";
import type { Coach } from "../types/coach";

const API_URL = "http://localhost:5000/coaches"; // your Express backend

export const getCoaches = (params?: Record<string, any>) => {
  return axios.get(API_URL, { params });
};

export const getCoachById = (id: number) => axios.get(`${API_URL}/${id}`);

export const addCoach = (data: Omit<Coach, "id" | "createdAt">) =>
  axios.post(API_URL, data);

export const updateCoach = (id: number, data: Partial<Coach>) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteCoach = (id: number) => axios.delete(`${API_URL}/${id}`);
