import axios from "axios";

const API = "http://localhost:3001/api/vehiculo";

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