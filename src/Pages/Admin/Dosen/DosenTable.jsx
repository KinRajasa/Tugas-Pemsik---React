import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; 

const DosenTable = ({ data = [], onEdit, onDelete, onDetail }) => {
  const { user } = useAuthStateContext(); 

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIDN</th>
            <th className="py-2 px-4 text-left">Nama Dosen</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((dosen, index) => (
              <tr key={dosen.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="py-2 px-4">{dosen.nidn}</td>
                <td className="py-2 px-4">{dosen.nama}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  
                  <Button onClick={() => onDetail(dosen.id)}>Detail</Button>
                  
                  {user?.permission?.includes("dosen.update") && (
                    <Button size="sm" variant="warning" onClick={() => onEdit(dosen)}>
                      Edit
                    </Button>
                  )}

                  {user?.permission?.includes("dosen.delete") && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(dosen.id)}>
                      Hapus
                    </Button>
                  )}

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-500">
                Belum ada data dosen.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DosenTable;