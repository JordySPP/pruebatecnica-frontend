import axios from "axios";

const API = "https://pruebatecnica-backend-production.up.railway.app/api/motorista";

export const getMotoristas = () => {
  return axios.get(API);
};

export const createMotorista = (motorista) => {
  return axios.post(API, motorista);
};

export const updateMotorista = (id, motorista) => {
  return axios.put(`${API}/${id}`, motorista);
};

export const deleteMotorista = (id) => {
  return axios.delete(`${API}/${id}`);
};