import axios from "../AxiosInstance";

export const getAllChartData = () => {
  return axios.get("/chart");
};