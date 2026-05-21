import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";

import MahasiswaTable from "./MahasiswaTable"; 
import MahasiswaModal from "./MahasiswaModal";

import { mahasiswaList } from "@/Data/Dummy";

const Mahasiswa = () => {
  const navigate = useNavigate();

  const [mahasiswa, setMahasiswa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true,
  });

  useEffect(() => {
    const fetchMahasiswa = async () => {
      const dataWithStatus = mahasiswaList.map((m) => ({ ...m, status: true }));
      setMahasiswa(dataWithStatus);
    };

    const timer = setTimeout(() => {
      fetchMahasiswa();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addMahasiswa = (newData) => {
    setMahasiswa([...mahasiswa, newData]); 
  };

  const updateMahasiswa = (nim, updatedData) => {
    setMahasiswa(
      mahasiswa.map((m) => (m.nim === nim ? updatedData : m)) 
    );
  };

  const deleteMahasiswa = (nim) => {
    setMahasiswa(mahasiswa.filter((m) => m.nim !== nim)); 
  };
  // --------------------------

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ nim: "", nama: "", status: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mhs) => {
    setIsEdit(true);
    setForm(mhs);
    setIsModalOpen(true);
  };

  const handleDelete = (nim) => {
  confirmDelete(() => {
    deleteMahasiswa(nim);
    toastSuccess("Data berhasil dihapus");
  });
};

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!form.nim || !form.nama) {
    toastError("NIM dan Nama wajib diisi");
    return;
  }

  if (isEdit) {
    confirmUpdate(() => {
      updateMahasiswa(form.nim, form);
      toastSuccess("Data berhasil diperbarui");
      setForm({ nim: "", nama: "" });
      setIsEdit(false);
      setIsModalOpen(false);
    });
  } else {
    const exists = mahasiswa.find((m) => m.nim === form.nim);
    if (exists) {
      toastError("NIM sudah terdaftar!");
      return;
    }
    addMahasiswa(form);
    toastSuccess("Data berhasil ditambahkan");
    setForm({ nim: "", nama: "" });
    setIsModalOpen(false);
  }
};

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left text-blue-600">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={handleOpenAdd}>+ Tambah Mahasiswa</Button>
      </div>

      <MahasiswaTable 
        data={mahasiswa} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
      />

      <MahasiswaModal 
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default Mahasiswa;