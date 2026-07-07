import { useState, useEffect } from "react";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMatkul } from "@/Utils/Apis/MatkulApi";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import { useChartData } from "@/Utils/Hooks/useChart";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const Dashboard = () => {
  const { user } = useAuthStateContext();

  const [stats, setStats] = useState({
    mahasiswa: 0,
    dosen: 0,
    matkul: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resMhs, resDsn, resMk] = await Promise.all([
          getAllMahasiswa(),
          getAllDosen(),
          getAllMatkul()
        ]);

        setStats({
          mahasiswa: resMhs.data.length,
          dosen: resDsn.data.length,
          matkul: resMk.data.length,
        });
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      }
    };

    fetchStats();
  }, []);

  const { data: chartData = {}, isLoading: isChartLoading } = useChartData();
  const { students = [], genderRatio = [], registrations = [] } = chartData;

  return (
    <div className="space-y-8 pb-10">
      <Heading as="h2" className="text-blue-600">Selamat Datang, Admin!</Heading>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center">
          <h3 className="text-xl font-semibold mb-2">Total Mahasiswa</h3>
          <p className="text-5xl font-bold">{stats.mahasiswa}</p>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white text-center">
          <h3 className="text-xl font-semibold mb-2">Total Dosen</h3>
          <p className="text-5xl font-bold">{stats.dosen}</p>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white text-center">
          <h3 className="text-xl font-semibold mb-2">Total Mata Kuliah</h3>
          <p className="text-5xl font-bold">{stats.matkul}</p>
        </Card>
      </div>

      <div>
        <Heading as="h3" className="text-xl text-gray-700 border-b pb-2 mb-6">
          Statistik Visual
        </Heading>

        {isChartLoading ? (
          <p className="text-center text-gray-500">Memuat grafik data...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <Card className="p-4 flex flex-col items-center">
              <h4 className="text-lg font-semibold text-gray-600 mb-4">Mahasiswa per Fakultas</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={students}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="faculty" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 flex flex-col items-center">
              <h4 className="text-lg font-semibold text-gray-600 mb-4">Rasio Gender</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderRatio}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {genderRatio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 flex flex-col items-center">
              <h4 className="text-lg font-semibold text-gray-600 mb-4">Tren Pendaftaran</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#82ca9d" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
