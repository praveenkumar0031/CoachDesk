import axios from "axios";
import type { Coach } from "../types/coach";


const API_BASE_URL =
  import.meta.env.VITE_API_URL 


const COACHES_URL = `${API_BASE_URL}/coaches`;


export const getCoaches = (params?: Record<string, any>) => {
  return axios.get(COACHES_URL, { params });
};

//Get single coach by ID
export const getCoachById = (id: number) => {
  return axios.get(`${COACHES_URL}/${id}`);
};

//Add new coach
export const addCoach = (data: Omit<Coach, "id" | "createdAt">) => {
  return axios.post(COACHES_URL, data);
};

//Update existing coach
export const updateCoach = (id: number, data: Partial<Coach>) => {
  return axios.put(`${COACHES_URL}/${id}`, data);
};

// Delete coach
export const deleteCoach = (id: number) => {
  return axios.delete(`${COACHES_URL}/${id}`);
};
