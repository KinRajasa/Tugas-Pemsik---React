import { useLocation } from "react-router-dom";
import Button from "@/Pages/Admin/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers"; 
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Header = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.includes("/admin/mahasiswa")) return "Mahasiswa";
    if (pathname.includes("/admin/dosen")) return "Dosen";
    if (pathname.includes("/admin/matakuliah")) return "Mata Kuliah";
    if (pathname.includes("/admin/dashboard")) return "Dashboard";
    if (pathname.includes("/admin/kelas")) return "Kelas";
    if (pathname.includes("/admin/rencana-studi")) return "Rencana Studi";
    return "Admin Panel"; 
  
  };

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    confirmLogout(() => {
      localStorage.removeItem("user");
      window.location.href = "/";
    });
  };

  const { user } = useAuthStateContext();

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          {getPageTitle(location.pathname)}
        </h1>
        <div className="relative">
          <Button
            onClick={toggleProfileMenu}
            className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"
          />
          <div
            id="profileMenu"
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden z-50"
          >
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;