import axios from "../AxiosInstance";

export const getAllKelas = async (params = {}) => {
  return await axios.get("/kelas", { params }); 
};
export const getKelas = async (id) => await axios.get(`/kelas/${id}`);

export const storeKelas = async (data) => await axios.post("/kelas", data);

export const updateKelas = async (id, data) => await axios.put(`/kelas/${id}`, data);

export const deleteKelas = async (id) => await axios.delete(`/kelas/${id}`);