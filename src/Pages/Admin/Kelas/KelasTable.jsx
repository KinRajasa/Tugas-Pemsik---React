import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; 

const KelasTable = ({ data = [], onEdit, onDelete }) => {
  const { user } = useAuthStateContext();

  console.log("Data yang diterima tabel:", data);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Nama Kelas</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((kls, index) => (
              <tr key={kls.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="py-2 px-4">{kls.id}</td>
                <td className="py-2 px-4">{kls.nama}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  
                  {user?.permission?.includes("kelas.update") && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(kls)}>
                      Edit
                    </Button>
                  )}
                  
                  {user?.permission?.includes("kelas.delete") && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(kls.id)}>
                      Hapus
                    </Button>
                  )}
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-500">
                Belum ada data kelas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;