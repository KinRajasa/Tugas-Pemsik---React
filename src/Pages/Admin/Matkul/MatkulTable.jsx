import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; 

const MatkulTable = ({ data = [], onEdit, onDelete, onDetail }) => {
  const { user } = useAuthStateContext();

  console.log("Data yang diterima tabel:", data);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Kode Matkul</th>
            <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
            <th className="py-2 px-4 text-center">SKS</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((mk, index) => (
              <tr key={mk.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="py-2 px-4">{mk.kode}</td>
                <td className="py-2 px-4">{mk.nama}</td>
                <td className="py-2 px-4 text-center">{mk.sks}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <Button onClick={() => onDetail(mk.id)}>Detail</Button>
                  
                  {user?.permission?.includes("matkul.update") && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(mk)}>
                      Edit
                    </Button>
                  )}
                  
                  {user?.permission?.includes("matkul.delete") && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(mk.id)}>
                      Hapus
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                Belum ada data mata kuliah.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatkulTable;
