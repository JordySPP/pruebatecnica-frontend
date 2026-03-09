import axios from "axios";

const API = "https://pruebatecnica-backend-production.up.railway.app/api/vehiculo";

export const getVehiculos = () => {
  return axios.get(API);
};

export const createVehiculo = (vehiculo) => {
  return axios.post(API, vehiculo);
};

export const updateVehiculo = (id, vehiculo) => {
  return axios.put(`${API}/${id}`, vehiculo);
};

export const deleteVehiculo = (id) => {
  return axios.delete(`${API}/${id}`);
};