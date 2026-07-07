import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useMatkul,
  useStoreMatkul,
  useUpdateMatkul,
  useDeleteMatkul,
} from "@/Utils/Hooks/useMatkul";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MatkulTable from "./MatkulTable";
import MatkulModal from "./MatkulModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; 

const Matkul = () => {
  const { user } = useAuthStateContext();
  const navigate = useNavigate();

  // 1. Hapus pemanggilan useMatkul lama yang bentrok
  const { mutate: store } = useStoreMatkul();
  const { mutate: update } = useUpdateMatkul();
  const { mutate: remove } = useDeleteMatkul();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: "",
    kode: "",
    nama: "",
    sks: "",
  });

  // State untuk Pagination & Filter
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("kode");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // 2. Pemanggilan useMatkul yang BARU (dengan parameter query)
 const { data: result = { data: [], total: 0 }, isLoading } = useMatkul({
    q: search,
    _page: page,
    _limit: limit,
    _sort: sortBy,
    _order: sortOrder
});

  // Pecah hasil dari API
  const listMatkul = result.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Fungsi Next/Prev
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ id: "", kode: "", nama: "", sks: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mk) => {
    setIsEdit(true);
    setForm(mk);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id); // Langsung hapus via mutasi
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kode || !form.nama || !form.sks) {
      toastError("Semua kolom wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: form.id, data: form });
        setIsModalOpen(false);
      });
    } else {
      store(form);
      setIsModalOpen(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left text-blue-600">
          Daftar Mata Kuliah
        </Heading>
        
        {user?.permission?.includes("matkul.create") && (
          <Button onClick={handleOpenAdd}>+ Tambah Mata Kuliah</Button>
        )}
      </div>

      {/* --- UI UNTUK PENCARIAN & FILTER --- */}
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        <input
          type="text"
          placeholder="Cari kode/nama matkul..."
          className="border border-gray-300 px-3 py-1 rounded flex-grow focus:outline-none focus:border-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
        />
        
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          className="border border-gray-300 px-3 py-1 rounded bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="nama">Sort by Nama</option>
          <option value="kode">Sort by Kode</option>
          <option value="sks">Sort by SKS</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
          className="border border-gray-300 px-3 py-1 rounded bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="asc">Asc (A-Z)</option>
          <option value="desc">Desc (Z-A)</option>
        </select>

        <select
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
          className="border border-gray-300 px-3 py-1 rounded bg-white focus:outline-none focus:border-blue-500"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={25}>25 / halaman</option>
        </select>
      </div>

      {/* --- TABEL --- */}
      {isLoading ? (
        <p className="text-center py-6 text-gray-500">Sedang memuat data...</p>
      ) : (
        <MatkulTable
          data={Array.isArray(listMatkul) ? listMatkul : []} // <-- PAKSA JADI ARRAY
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onDetail={(id) => navigate(`/admin/matakuliah/${id}`)}
        />
      )}

      {/* --- UI UNTUK PAGINATION --- */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Halaman <span className="font-semibold text-blue-600">{page}</span> dari <span className="font-semibold">{totalPages}</span> 
          <span className="hidden sm:inline"> (Total: {totalCount} data)</span>
        </p>
        <div className="flex gap-2">
          <button
            className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      <MatkulModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={false}
      />
    </Card>
  );
};

export default Matkul;