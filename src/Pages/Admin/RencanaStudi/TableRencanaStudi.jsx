import Button from "@/Pages/Admin/Components/Button";
import Select from "@/Pages/Admin/Components/Select";

export default function TableRencanaStudi({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas
}
) {

  return (
    <div className="space-y-6">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find(m => m.id === kls.mata_kuliah_id);
        const dosenPengampu = dosen.find(d => d.id === kls.dosen_id);
        const totalSksDosen = kelas
            .filter(k => k.dosen_id === kls.dosen_id)
            .map(k => mataKuliah.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
            .reduce((a, b) => a + b, 0);

        const maxSksDosen = dosenPengampu?.max_sks || 0;

        const persenDosen =
            maxSksDosen === 0
                ? 0
                : (totalSksDosen / maxSksDosen) * 100;

        let warnaDosen = "text-green-600";

        if (persenDosen >= 100)
            warnaDosen = "text-red-600";
        else if (persenDosen >= 80)
            warnaDosen = "text-yellow-600";
        const mhsInClass = kls.mahasiswa_ids.map(id => mahasiswa.find(m => m.id === id)).filter(Boolean);

        const availableMahasiswa = mahasiswa.filter((m) => {
                            return !kls.mahasiswa_ids.includes(m.id);
        });


        return (
          <div key={kls.id} className="border rounded-xl shadow bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex justify-between items-start px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-white"> 
                <div>

                    <h3 className="text-xl font-bold text-blue-700">
                        📚 {matkul?.nama || "-"}
                    </h3>

                    <div className="flex flex-wrap gap-5 mt-2 text-sm">
                        <span>
                            📖 <b>{matkul?.sks}</b> SKS
                        </span>

                        <span>
                            <div>
                                👨‍🏫 <b>{dosenPengampu?.nama}</b>

                            <div className={`text-xs mt-1 ${warnaDosen}`}>
                                {totalSksDosen}
                                {" / "}
                                {maxSksDosen}
                                {" SKS"}
                            </div>

                            <div className="w-36 h-2 bg-gray-200 rounded-full mt-1">
                            <div
                                className={`h-2 rounded-full ${
                                    persenDosen >= 100
                                        ? "bg-red-500"
                                        : persenDosen >= 80
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`}
                                style={{
                                    width: `${Math.min(persenDosen,100)}%`
                                }}
                            />
                        </div>
                        </div>
                        </span>
                        <span>
                            👨‍🎓 <b>{mhsInClass.length}</b> Mahasiswa
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={selectedDsn[kls.id] || ""}
                        onChange={(e)=>
                            setSelectedDsn({
                                ...selectedDsn,
                                [kls.id]:e.target.value
                            })
                        }
                        size="sm"
                        className="w-52"
                    >
                        <option value="">
                            -- Ganti Dosen --
                        </option>
                        {
                            dosen.map((d)=>(
                                <option
                                    key={d.id}
                                    value={d.id}
                                >
                                    {d.nama}
                                </option>
                            ))
                        }
                    </Select>
                    <Button
                        size="sm"
                        onClick={()=>handleChangeDosen(kls)}
                    >
                        Simpan
                    </Button>
                    {
                        mhsInClass.length===0 && (
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={()=>handleDeleteKelas(kls.id)}
                            >
                                🗑
                            </Button>
                        )
                    }
                </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama</th>
                  <th className="py-2 px-4 text-left">NIM</th>
                  <th className="py-2 px-4 text-center">Total SKS</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mhsInClass.length > 0 ? (
                  mhsInClass.map((m, i) => {
                    const totalSks = kelas
                      .filter(k => k.mahasiswa_ids.includes(m.id))
                      .map(k => mataKuliah.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
                      .reduce((a, b) => a + b, 0);

                      const maxSks = m.max_sks || 0;

                        const percentage = maxSks === 0 ? 0 : (totalSks / maxSks) * 100;

                        let badgeColor = "bg-green-100 text-green-700";
                        let badgeText = "Aman";

                        if (percentage >= 100) {
                            badgeColor = "bg-red-100 text-red-700";
                            badgeText = "Overload";
                        }
                        else if (percentage >= 80) {
                            badgeColor = "bg-yellow-100 text-yellow-700";
                            badgeText = "Hampir Penuh";
                        }

                    return (
                      <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="py-2 px-4">{i + 1}</td>
                        <td className="py-2 px-4">{m.nama}</td>
                        <td className="py-2 px-4">{m.nim}</td>
                        <td className="py-2 px-4 text-center">
                            <div className="font-semibold">
                                {totalSks} / {maxSks}
                            </div>

                            <span
                                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}
                            >
                                {badgeText === "Aman" && "🟢 Aman"}
                                {badgeText === "Hampir Penuh" && "🟡 Hampir Penuh"}
                                {badgeText === "Overload" && "🔴 Overload"}
                            </span>

                        </td>
                        <td className="py-2 px-4 text-center">
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteMahasiswa(kls, m.id)}
                          >
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-3 px-4 text-center italic text-gray-500">
                      Belum ada mahasiswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center gap-2 px-4 py-3 border-t bg-gradient-to-r from-blue-50 via-white to-blue-50">
              <Select
                value={selectedMhs[kls.id] || ""}
                onChange={(e) => setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })}
                size="sm"
                className="w-56"
              >
                <option value="">{
                    availableMahasiswa.length === 0
                        ? "Semua mahasiswa sudah masuk kelas"
                        : "-- Pilih Mahasiswa --"
                }</option>
                {availableMahasiswa.map((m) => (
                  <option key={m.id} value={m.id}>{m.nama} ({m.nim})</option>
                ))}
              </Select>
              <Button
                    size="sm"
                    disabled={
                    !selectedMhs[kls.id] ||
                    availableMahasiswa.length === 0
                }
                onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])}
              >
                Tambah Mahasiswa
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}