import Button from "@/Pages/Admin/Components/Button";

const MatkulModal = ({ isOpen, isEdit, form, onChange, onClose, onSubmit, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4 text-blue-600">
          {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kode Matkul</label>
            <input
              type="text"
              name="kode"
              value={form.kode || ""}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Mata Kuliah</label>
            <input
              type="text"
              name="nama"
              value={form.nama || ""}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah SKS</label>
            <input
              type="number"
              name="sks"
              min="1"
              max="6"
              value={form.sks || ""}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MatkulModal;