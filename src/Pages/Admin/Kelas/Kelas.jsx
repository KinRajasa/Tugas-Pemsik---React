import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useKelas, useStoreKelas, useUpdateKelas, useDeleteKelas } from "@/Utils/Hooks/useKelas";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import KelasTable from "./KelasTable";
import KelasModal from "./KelasModal"; 
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Kelas = () => {
  const { user } = useAuthStateContext();
  const navigate = useNavigate();

  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ id: "", nama: "" });

  // --- STATE UNTUK PAGINATION & FILTER ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // --- PEMANGGILAN HOOK DENGAN PARAMETER ---
  const { data: result = { data: [], total: 0 }, isLoading } = useKelas({
    nama_like: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const listKelas = result.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ id: "", nama: "" }); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kls) => {
    setIsEdit(true);
    setForm(kls);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama) {
      toastError("Nama kelas wajib diisi");
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
        <Heading as="h2" className="mb-0 text-left text-blue-600">Daftar Kelas</Heading>
        
        {user?.permission?.includes("kelas.create") && (
          <Button onClick={handleOpenAdd}>+ Tambah Kelas</Button>
        )}
      </div>

      {/* --- UI UNTUK PENCARIAN & FILTER --- */}
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        <input
          type="text"
          placeholder="Cari nama kelas..."
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
          <option value="nama">Sort by Nama Kelas</option>
          <option value="id">Sort by ID</option>
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
        <KelasTable data={listKelas} onEdit={handleOpenEdit} onDelete={handleDelete} />
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

      <KelasModal
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

export default Kelas;