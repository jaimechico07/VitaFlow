// src/components/Header.jsx
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    signOut(auth);
    toast.success("Sesión cerrada");
    navigate("/"); // Después del logout, regresa al login
  };

  return (
    <header className="flex justify-between bg-gray-800 p-4 items-center">
      <h1 className="text-white text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="relative">
            <div className="flex items-center cursor-pointer gap-4" onClick={() => setShowMenu(!showMenu)}>
              <p className="text-white">{user.displayName}</p>
              <img
                className="w-12 h-12 rounded-full"
                src={user.photoURL}
                alt="Foto de perfil"
              />
            </div>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-50">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="inline-block mr-2" size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
