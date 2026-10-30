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
import { getTasks, updateTask } from "../services/taskService.js";
import { getHojeLocal } from "../utils/dateUtils";

function Dashboard() {
  const hoje = getHojeLocal();

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

  const handleSaveTask = async (taskId, formData) => {
    try {
      await updateTask(taskId, formData);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Não foi possível salvar as alterações.");
    }
  };

  const loadTasks = async () => {
    try {
      const response = await getTasks(user?.id);

      if (!user) return;

      if (!response) {
        throw new Error("Erro ao buscar tarefas do usuário.");
      }
      setTasks(response.tasks);
      //console.log(response);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <div className="flex flex-col bg-background lg:flex-row overflow-x-auto h-full">
      <div className="flex flex-col items-center min-h-40 lg:h-full min-w-80 gap-2">
        <p className="flex items-center my-2">
          <button className="bg-indigo-500 text-white p-0.5 rounded-2xl hover:bg-indigo-900 cursor-pointer">
            <Plus size={18} />
          </button>
          ⌚ Tasks de Hoje
        </p>
        {tasks.length === 0
          ? null
          : tasks
              .filter((task) => task.data_vencimento === hoje)
              .map((task) => (
                <TaskItem
                  key={task.id}
                  taskId={task.id}
                  status={task.status}
                  titulo={task.titulo}
                  descricao={task.descricao}
                  vencimento={task.data_vencimento}
                  onSave={(formData) => handleSaveTask(task.id, formData)}
                  onUpdate={loadTasks}
                />
              ))}
      </div>
      <div className="flex flex-col items-center min-h-40 lg:h-full min-w-80 gap-2">
        <p>⌛ Tasks Pendentes</p>
        {tasks.length === 0
          ? null
          : tasks
              .filter((task) => task.status === "pendente")
              .map((task) => (
                <TaskItem
                  key={task.id}
                  taskId={task.id}
                  status={task.status}
                  titulo={task.titulo}
                  descricao={task.descricao}
                  vencimento={task.data_vencimento}
                  onSave={(formData) => handleSaveTask(task.id, formData)}
                  onUpdate={loadTasks}
                />
              ))}
      </div>
      <div className="flex flex-col items-center min-h-40 lg:h-full min-w-80 gap-2">
        <p>⏳ Tasks dessa semana</p>
      </div>
      <div className="flex flex-col items-center min-h-40 lg:h-full min-w-80 gap-2">
        <p>🗓️ Tasks a prazo</p>
      </div>
      <div className="flex flex-col items-center min-h-40 lg:h-full min-w-80 gap-2">
        <p>✅ Tasks Concluídas</p>
        {tasks.length === 0
          ? null
          : tasks
              .filter((task) => task.status === "finalizado")
              .map((task) => (
                <TaskItem
                  key={task.id}
                  taskId={task.id}
                  status={task.status}
                  titulo={task.titulo}
                  descricao={task.descricao}
                  vencimento={task.data_vencimento}
                  onSave={(formData) => handleSaveTask(task.id, formData)}
                  onUpdate={loadTasks}
                />
              ))}
      </div>
    </div>
  );
}

export default Dashboard;
