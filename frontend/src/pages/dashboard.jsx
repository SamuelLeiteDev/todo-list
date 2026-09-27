import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import {
  CheckCircle2,
  LogOut,
  ShieldCheck,
  KeyRound,
  Clock,
  Plus,
} from "lucide-react";
import { useAuth } from "../contexts/useAuth.js";
import TaskItem from "../components/TaskItem.jsx";

function Dashboard() {
  const { user, logout } = useAuth();
  // Dados fictícios para demonstração no portfólio

  const usuario = {
    name: user?.nome || "Nome não encontrado",
    email: user?.email || "Email não econtrado",
    role: "Administrador",
    lastLogin: new Date().toLocaleString("pt-BR"),
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col bg-background lg:flex-row">
      <div className="flex flex-col items-center min-h-40 lg:h-dvh min-w-80">
        <p className="flex items-center my-2">
          <button className="bg-indigo-500 text-white p-0.5 rounded-2xl hover:bg-indigo-900 cursor-pointer">
            <Plus size={18} />
          </button>
          ⌚ Tasks de Hoje
        </p>
        <TaskItem
          titulo="Minha tarefa de hoje teste teste teste teste teste teste teste"
          descricao="Ajustar o parser do componente principal para suportar corretamente formatação rica, blocos de código com destaque de sintaxe e listas de verificação (checklists) em dispositivos móveis e desktop."
          // vencimento={"02-05-2002"}
        />
      </div>
      <div className="min-h-40 lg:h-dvh w-80">
        <p>⌛ Tasks Pendentes</p>
      </div>
      <div className="min-h-40 lg:h-dvh w-80">
        <p>⏳ Tasks dessa semana</p>
      </div>
      <div className="min-h-40 lg:h-dvh w-80">
        <p>🗓️ Tasks a prazo</p>
      </div>
      <div className="min-h-40 lg:h-dvh w-80">
        <p>✅ Tasks Concluídas</p>
      </div>
    </div>
  );
}

export default Dashboard;
