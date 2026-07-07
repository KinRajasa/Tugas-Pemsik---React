import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";

import { useState, useEffect } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas, updateKelas, storeKelas, deleteKelas } from "@/Utils/Apis/KelasApi.jsx";
import { getAllDosen } from "@/Utils/Apis/DosenApi.jsx";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi.jsx";
import { getAllMatkul } from "@/Utils/Apis/MatkulApi.jsx";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const RencanaStudi = () =>{
    const { user } = useAuthStateContext();
    const [kelas, setKelas] = useState([]);
    const [dosen, setDosen] = useState([]);
    const [mahasiswa, setMahasiswa] = useState([]);
    const [mataKuliah, setMatkul] = useState([]);

    const [selectedMhs, setSelectedMhs] = useState({});
    const [selectedDsn, setSelectedDsn] = useState({});

    const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [resKelas, resDosen, resMahasiswa, resMatkul] = await Promise.all([
            getAllKelas(),
            getAllDosen(),
            getAllMahasiswa(),
            getAllMatkul(),
        ]);
        setKelas(resKelas.data);
        setDosen(resDosen.data);
        setMahasiswa(resMahasiswa.data);
        setMatkul(resMatkul.data);
    };

    const mataKuliahSudahDipakai = kelas.map(k => k.mata_kuliah_id);
    const mataKuliahBelumAdaKelas = mataKuliah.filter(m => !mataKuliahSudahDipakai.includes(m.id));

    const getMaxSks = (id) => mahasiswa.find(m => String(m.id) === String(id))?.max_sks || 0;
    const getDosenMaxSks = (id) =>  dosen.find(d => String(d.id) === String(id))?.max_sks || 0;

    const handleAddMahasiswa = async (kelasItem, mhsId) => {
        console.log({
    mhsId,
    mahasiswa: mahasiswa.find(m => m.id === mhsId),
    maxSks: getMaxSks(mhsId),
});
        const matkul = m => String(m.id) === String(kelasItem.mata_kuliah_id)
        const sks = Number(matkul?.sks || 0);

        const totalSksMahasiswa = kelas
            .filter(k => k.mahasiswa_ids.includes(mhsId))
            .map(k => Number(mataKuliah.find(m => String(m.id) === String(k.mata_kuliah_id))?.sks || 0))
            .reduce((acc, curr) => acc + curr, 0);

        const maxSks = getMaxSks(mhsId);
        
        if (totalSksMahasiswa + sks > maxSks) {
            toastError(`SKS melebihi batas maksimal (${maxSks})`);
            return;
        }
        
        if (kelasItem.mahasiswa_ids.includes(mhsId)) {
            toastError("Mahasiswa sudah terdaftar");
            return;
        }

        const updated = {
            ...kelasItem,
            mahasiswa_ids: [...kelasItem.mahasiswa_ids, mhsId]
        };

        await updateKelas(kelasItem.id, updated);
        toastSuccess("Mahasiswa ditambahkan");
        setSelectedMhs(prev => ({ ...prev, [kelasItem.id]: "" }));
        fetchData();
    };

    const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
        const updated = {
            ...kelasItem,
            mahasiswa_ids: kelasItem.mahasiswa_ids.filter(id => id !== mhsId)
        };

        await updateKelas(kelasItem.id, updated);
        toastSuccess("Mahasiswa dihapus");
        fetchData();
    };

    const handleChangeDosen = async (kelasItem) => {
        const dsnId = selectedDsn[kelasItem.id];
        if (!dsnId) return;

        const totalSksDosen = kelas
            .filter(k => k.dosen_id === dsnId)
            .map(k => mataKuliah.find(m => m.id === k.mata_kuliah_id)?.sks || 0)
            .reduce((acc, curr) => acc + curr, 0);

        const kelasSks = mataKuliah.find(m => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
        const maxSks = getDosenMaxSks(dsnId);

        if (totalSksDosen + kelasSks > maxSks) {
            toastError(`Dosen melebihi batas maksimal SKS (${maxSks})`);
            return;
        }

        await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
        toastSuccess("Dosen diperbarui");
        fetchData();
    };

    const handleDeleteKelas = async (kelasId) => {
        confirmDelete(async () => {
            await deleteKelas(kelasId);
            toastSuccess("Kelas dihapus");
            fetchData();
        });
    };

    const openAddModal = () => {
        setForm({ mata_kuliah_id: "", dosen_id: "" });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.mata_kuliah_id || !form.dosen_id) {
            toastError("Form tidak lengkap");
            return;
        }
        await storeKelas({ ...form, mahasiswa_ids: [] });
        setIsModalOpen(false);
        toastSuccess("Kelas ditambahkan");
        fetchData();
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return <>
        <Card>
            <div className="flex justify-between items-center mb-4">
                <Heading as="h2">Rencana Studi</Heading>
                {user.permission.includes("rencana-studi.create") && (
                <Button onClick={openAddModal}>+ Tambah Kelas</Button>
                )}
            </div>
            <ModalRencanaStudi
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onChange={handleChange}
                onSubmit={handleSubmit}
                form={form}
                dosen={dosen}
                mataKuliah={mataKuliahBelumAdaKelas}
            />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-5">
            <p className="text-sm opacity-90">
                📚 Total Kelas
            </p>

            <h2 className="text-4xl font-bold mt-2">
                {kelas.length}
            </h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg p-5">
            <p className="text-sm opacity-90">
                👨‍🏫 Dosen Aktif
            </p>

            <h2 className="text-5xl font-bold mt-4">
                {
                    [...new Set(kelas.map(k=>k.dosen_id))]
                        .filter(Boolean)
                        .length
                }
            </h2>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-5">
            <p className="text-sm opacity-90">
                👨‍🎓 Mahasiswa
            </p>

            <h2 className="text-4xl font-bold mt-2">
                {
                    [...new Set(
                        kelas.flatMap(
                            k=>k.mahasiswa_ids
                        )
                    )].length
                }
            </h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-xl shadow-lg p-5">
            <p className="text-sm opacity-90">
                📖 Total SKS
            </p>

            <h2 className="text-4xl font-bold mt-2">
                {
                    kelas.reduce((total,k)=>{
                        const mk=mataKuliah.find(
                            m=>m.id===k.mata_kuliah_id
                        );

                        return total+(mk?.sks||0);
                    },0)
                }
            </h2>
        </div>
    </div>
        <TableRencanaStudi
            kelas={kelas}
            mahasiswa={mahasiswa}
            dosen={dosen}
            mataKuliah={mataKuliah}
            selectedMhs={selectedMhs}
            setSelectedMhs={setSelectedMhs}
            selectedDsn={selectedDsn}
            setSelectedDsn={setSelectedDsn}
            handleAddMahasiswa={handleAddMahasiswa}
            handleDeleteMahasiswa={handleDeleteMahasiswa}
            handleChangeDosen={handleChangeDosen}
            handleDeleteKelas={handleDeleteKelas}
        />
    </>;
}

export default RencanaStudi;