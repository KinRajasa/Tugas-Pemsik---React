import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMatkul,
  storeMatkul,
  updateMatkul,
  deleteMatkul,
} from "@/Utils/Apis/MatkulApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMatkul = (query = {}) => {
  return useQuery({
    queryKey: ["matkul", query],
    queryFn: () => getAllMatkul(query),
    select: (res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      return {
        data: data,
        total: data.length, 
      };
    },
    keepPreviousData: true,
  });
};

export const useStoreMatkul = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMatkul,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matkul"] });
      toastSuccess("Mata Kuliah berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mata kuliah."),
  });
};

export const useUpdateMatkul = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMatkul(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matkul"] });
      toastSuccess("Mata Kuliah berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mata kuliah."),
  });
};

export const useDeleteMatkul = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatkul,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matkul"] });
      toastSuccess("Mata Kuliah berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mata kuliah."),
  });
};