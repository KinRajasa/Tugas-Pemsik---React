import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import './App.css';

import AuthLayout from "@/Pages/Auth/AuthLayout";
import { AuthProvider } from "@/Utils/Contexts/AuthContext";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Opsional buat debugging

import Login from "@/Pages/Auth/Login/Login";
import Register from "@/Pages/Auth/Register/Register";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen"; 
import DosenDetail from "@/Pages/Admin/Dosen/DosenDetail";
import Matkul from "@/Pages/Admin/Matkul/Matkul"; 
import MatkulDetail from "@/Pages/Admin/Matkul/MatkulDetail";
import Kelas from "@/Pages/Admin/Kelas/Kelas";
import RencanaStudi from "@/Pages/Admin/RencanaStudi/RencanaStudi";
import PageNotFound from "@/Pages/Error/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register", 
        element: <Register />,
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        element: <Mahasiswa />,
      },
      {
        path: "mahasiswa/:id",
        element: <MahasiswaDetail />,
      },
      {
        path: "dosen", 
        element: <Dosen />,
      },
      {
        path: "dosen/:id", 
        element: <DosenDetail />,
      },
      {
        path: "matakuliah", 
        element: <Matkul />,
      },
      {
        path: "matakuliah/:id",
        element: <MatkulDetail />,
      },
      {
        path: "kelas",
        element: <Kelas />,
      },
      {
          path: "rencana-studi",
          element: <RencanaStudi />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);