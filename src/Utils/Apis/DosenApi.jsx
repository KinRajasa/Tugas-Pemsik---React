import axios from "../AxiosInstance";

export const getAllDosen = async (params = {}) => {
  return await axios.get("/dosen", { params });
};
export const getDosenById = (id) => axios.get(`/dosen/${id}`);
export const storeDosen = (data) => axios.post("/dosen", data);
export const updateDosen = (id, data) => axios.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => axios.delete(`/dosen/${id}`);