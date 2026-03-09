import axios from "axios";

const API = "https://pruebatecnica-backend-production.up.railway.app/api/registro";

export const getRegistros = () => {
  return axios.get(API);
};

export const createRegistro = (registro) => {
  return axios.post(API, registro);
};

export const registrarSalida = (id, data) => {
  return axios.put(`${API}/salida/${id}`, data);
};

export const deleteRegistro = (id) => {
  return axios.delete(`${API}/${id}`);
};