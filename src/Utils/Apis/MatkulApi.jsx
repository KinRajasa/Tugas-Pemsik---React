import axios from "../AxiosInstance";

export const getAllMatkul = () => axios.get("/matakuliah");

export const getMatkulById = (id) => axios.get(`/matakuliah/${id}`);
export const storeMatkul = (data) => axios.post("/matakuliah", data);
export const updateMatkul = (id, data) => axios.put(`/matakuliah/${id}`, data);
export const deleteMatkul = (id) => axios.delete(`/matakuliah/${id}`);