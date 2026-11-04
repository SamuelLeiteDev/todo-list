import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { LogOut } from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar w-full h-10 bg-neutral-950  flex items-center">
      <div
        data-component="container-nav"
        className="w-full mx-10 gap-2 flex justify-between"
      >
        <span className="text-white">Olá, {user?.nome}</span>
        <div data-component="navbar-menu" className="flex gap-5 text-text-menu">
          <Link to="/dashboard">Minhas Tarefas</Link>
        </div>
        <button
          onClick={handleLogout}
          className="cursor-pointer hover:text-amber-300 text-white"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
