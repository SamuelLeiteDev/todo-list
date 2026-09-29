import React, { useEffect, useState } from "react";
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
import { getTasks } from "../services/taskService.js";

function Dashboard() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await getTasks(user.id);

        if (!response) {
          throw new Error("Erro ao buscar tarefas do usuário.");
        }
        setTasks(response.tasks);
        //console.log(response);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white font-medium">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background lg:flex-row">
      <div className="flex flex-col items-center min-h-40 lg:h-dvh min-w-80 gap-2">
        <p className="flex items-center my-2">
          <button className="bg-indigo-500 text-white p-0.5 rounded-2xl hover:bg-indigo-900 cursor-pointer">
            <Plus size={18} />
          </button>
          ⌚ Tasks de Hoje
        </p>
        {tasks.length === 0
          ? null
          : tasks.map((task) => (
              <TaskItem
                key={task.id}
                taskId={task.id}
                status={task.status}
                titulo={task.titulo}
                descricao={task.descricao}
                vencimento={task.data_vencimento}
              />
            ))}
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
