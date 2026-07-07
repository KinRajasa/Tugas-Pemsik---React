import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMatkulById } from "@/Utils/Apis/MatkulApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const MatkulDetail = () => {
  const { id } = useParams();
  const [matkul, setMatkul] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatkul = async () => {
      try {
        const res = await getMatkulById(id);
        setMatkul(res.data);
      } catch (err) {
        toastError("Gagal mengambil detail mata kuliah");
      } finally {
        setLoading(false);
      }
    };
    fetchMatkul();
  }, [id]);

  if (loading) return <p className="text-blue-600 font-medium">Memuat detail mata kuliah...</p>;
  if (!matkul) return <p className="text-red-600 font-medium">Mata kuliah tidak ditemukan.</p>;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mata Kuliah</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium w-36">ID</td>
            <td className="py-2 px-4">: {matkul.id}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-36">Kode Mata Kuliah</td>
            <td className="py-2 px-4">: {matkul.kode}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-36">Nama Mata Kuliah</td>
            <td className="py-2 px-4">: {matkul.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-36">Jumlah SKS</td>
            <td className="py-2 px-4">: {matkul.sks}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MatkulDetail;