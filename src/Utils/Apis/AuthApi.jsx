import axios from "../AxiosInstance";

export const login = async (email, password) => {
  const res = await axios.get("/user"); 
  
  const dataArray = Array.isArray(res.data) ? res.data : res.data.user;

  const user = dataArray.find((u) => u.email === email);

  if (!user) throw new Error("Email tidak ditemukan");
  if (user.password !== password) throw new Error("Password salah");

  return user;
};

export const register = async (data) => {
  const existingUser = await axios.get("/user", { params: { email: data.email } });
  if (existingUser.data.length > 0) {
    throw new Error("Email sudah digunakan");
  }

  return axios.post("/user", data);
};