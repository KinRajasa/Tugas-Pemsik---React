import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { register } from "@/Utils/Apis/AuthApi"; 
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

import Input from "@/Pages/Auth/Components/Input"; 
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Form from "@/Pages/Auth/Components/Form";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.email || !form.password) {
      toastError("Semua kolom wajib diisi!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toastError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSave } = form;
      await register(dataToSave);
      
      toastSuccess("Registrasi berhasil! Silakan login.");
      navigate("/"); 
    } catch (error) {
      toastError(error.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <Heading as="h2">Daftar Akun Admin</Heading>
      
      <Form onSubmit={handleRegister}>
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Buat password"
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password"
            required
          />
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Memproses..." : "Daftar"}
        </Button>
      </Form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <RouterLink to="/" className="text-blue-600 hover:underline">
          Login
        </RouterLink>
      </p>
    </Card>
  );
};

export default Register;