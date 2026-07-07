import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDosenById } from "@/Utils/Apis/DosenApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const DosenDetail = () => {
  const { id } = useParams();
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const res = await getDosenById(id);
        setDosen(res.data);
      } catch (err) {
        toastError("Gagal mengambil data dosen");
      } finally {
        setLoading(false);
      }
    };
    fetchDosen();
  }, [id]);

  if (loading) return <p className="text-blue-600 font-medium">Memuat data dosen...</p>;
  if (!dosen) return <p className="text-red-600 font-medium">Data dosen tidak ditemukan.</p>;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Dosen</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium w-32">ID</td>
            <td className="py-2 px-4">: {dosen.id}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-32">NIDN</td>
            <td className="py-2 px-4">: {dosen.nidn}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium w-32">Nama</td>
            <td className="py-2 px-4">: {dosen.nama}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default DosenDetail;