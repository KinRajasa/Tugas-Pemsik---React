import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMahasiswa } from "@/Utils/Apis/MahasiswaApi"; 
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useKelas } from "@/Utils/Hooks/useKelas";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const MahasiswaDetail = () => {
  const { id } = useParams(); 
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: result } = useKelas();
  const listKelas = result?.data || []; 

  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        const res = await getMahasiswa(id); 
        setMahasiswa(res.data);
      } catch (err) {
        toastError("Gagal mengambil data mahasiswa: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMahasiswa();
  }, [id]); 

  if (loading) {
    return <p className="text-blue-600 font-medium">Memuat data mahasiswa...</p>;
  }

  if (!mahasiswa) {
    return <p className="text-red-600 font-medium">Data mahasiswa tidak ditemukan.</p>;
  }

  const namaKelas = listKelas.find((k) => String(k.id) === String(mahasiswa?.kelas_id))?.nama || "Belum ditentukan";

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mahasiswa</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium w-32">ID Mahasiswa</td>
            <td className="py-2 px-4">: {mahasiswa.id}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-32">NIM</td>
            <td className="py-2 px-4">: {mahasiswa.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-32">Nama</td>
            <td className="py-2 px-4">: {mahasiswa.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-32">Kelas</td>
            <td className="py-2 px-4">: {namaKelas}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;
