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
import {
  getTasks,
  updateTask,
  createTask,
  deleteTask,
} from "../services/taskService.js";
import { getHojeLocal, isDateInCurrentWeek } from "../utils/dateUtils";

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
      loadTasks();
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
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  };

  const newTask = async (data_vencimento, status) => {
    try {
      const response = await createTask(user?.id, data_vencimento, status);

      if (!user) return;

      if (!response) {
        throw new Error("Erro ao criar a nova tarefa.");
      }
      loadTasks();
    } catch (error) {
      console.error("Erro ao criar nova tarefa: ", error);
    }
  };

  const handleDeleteTask = async (taskID) => {
    try {
      const response = await deleteTask(user?.id, taskID);

      if (!user) return;

      if (!response) {
        throw new Error("Erro ao excluir a tarefa.");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskID));
    } catch (error) {
      console.error("Erro ao deletar tarefa.", error);
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
    <div className="flex flex-col bg-olive-900 lg:flex-row overflow-x-auto h-full lg:justify-center lg:overflow-y-hidden">
      <div
        data-component="coluna-tasks-hoje"
        className="flex w-full min-w-0 flex-col items-stretch bg-indigo-200 lg:h-full lg:w-3/12 lg:items-center lg:overflow-y-auto"
      >
        <p className="flex items-center self-center my-2 bg-black text-white p-2 rounded-xl">
          <button
            className="bg-indigo-500 text-white p-0.5 rounded-2xl hover:bg-indigo-900 cursor-pointer"
            onClick={() => newTask(hoje, "pendente")}
          >
            <Plus size={18} />
          </button>
          ⌚ Tasks de Hoje
        </p>

        <div
          data-component="taks-items-hoje"
          className="flex flex-row items-start gap-2 px-2 py-2 overflow-x-auto overflow-y-hidden
               lg:flex-col lg:items-center lg:w-full lg:overflow-x-visible lg:overflow-y-auto lg:px-0
               scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {tasks
            .filter((task) => {
              if (!task.data_vencimento) return false;
              const dataTask = task.data_vencimento.split("T")[0];
              return task.status === "pendente" && dataTask === hoje;
            })
            .map((task) => (
              <div
                key={task.id}
                className="shrink-0 w-full flex justify-center"
              >
                <TaskItem
                  taskId={task.id}
                  status={task.status}
                  prioridade={task.prioridade}
                  titulo={task.titulo}
                  descricao={task.descricao}
                  vencimento={task.data_vencimento}
                  onSave={(formData) => handleSaveTask(task.id, formData)}
                  onUpdate={loadTasks}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col items-stretch bg-indigo-400 lg:h-full lg:w-3/12 lg:items-center lg:overflow-y-auto">
        <p className="flex items-center self-center my-2 bg-black text-white p-2 rounded-xl">
          <button
            className="bg-indigo-500 text-white p-0.5 rounded-2xl hover:bg-indigo-900 cursor-pointer"
            onClick={() => newTask(null, "pendente")}
          >
            <Plus size={18} />
          </button>
          ⌛ Tasks Pendentes
        </p>
        <div
          data-component="taks-items-pendente"
          className="flex flex-row items-start gap-2 px-2 py-2 overflow-x-auto overflow-y-hidden
               lg:flex-col lg:items-center lg:w-full lg:overflow-x-visible lg:overflow-y-auto lg:px-0
               scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {tasks.length === 0
            ? null
            : tasks
                .filter(
                  (task) =>
                    task.status === "pendente" && task.data_vencimento === null,
                )
                .map((task) => (
                  <div
                    key={task.id}
                    className="shrink-0 w-full flex justify-center"
                  >
                    <TaskItem
                      key={task.id}
                      taskId={task.id}
                      prioridade={task.prioridade}
                      status={task.status}
                      titulo={task.titulo}
                      descricao={task.descricao}
                      vencimento={task.data_vencimento}
                      onSave={(formData) => handleSaveTask(task.id, formData)}
                      onUpdate={loadTasks}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col items-stretch bg-indigo-200 lg:h-full lg:w-3/12 lg:items-center lg:overflow-y-auto">
        <p className="flex items-center self-center my-2 bg-black text-white p-2 rounded-xl">
          ⏳ Tasks dessa semana
        </p>
        <div
          data-component="taks-items-semana"
          className="flex flex-row items-start gap-2 px-2 py-2 overflow-x-auto overflow-y-hidden
               lg:flex-col lg:items-center lg:w-full lg:overflow-x-visible lg:overflow-y-auto lg:px-0
               scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {tasks.length === 0
            ? null
            : tasks
                .filter((task) => {
                  if (!task.data_vencimento) return false;

                  const dataTask = task.data_vencimento.split("T")[0];

                  return (
                    task.status === "pendente" &&
                    isDateInCurrentWeek(dataTask) &&
                    dataTask !== hoje
                  );
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className="shrink-0 w-full flex justify-center"
                  >
                    <TaskItem
                      key={task.id}
                      taskId={task.id}
                      status={task.status}
                      prioridade={task.prioridade}
                      titulo={task.titulo}
                      descricao={task.descricao}
                      vencimento={task.data_vencimento}
                      onSave={(formData) => handleSaveTask(task.id, formData)}
                      onUpdate={loadTasks}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col items-stretch bg-indigo-400 lg:h-full lg:w-3/12 lg:items-center lg:overflow-y-auto">
        <p className="flex items-center self-center my-2 bg-black text-white p-2 rounded-xl">
          🗓️ Tasks a prazo
        </p>
        <div
          data-component="taks-items-prazo"
          className="flex flex-row items-start gap-2 px-2 py-2 overflow-x-auto overflow-y-hidden
               lg:flex-col lg:items-center lg:w-full lg:overflow-x-visible lg:overflow-y-auto lg:px-0
               scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {tasks.length === 0
            ? null
            : tasks
                .filter((task) => {
                  if (!task.data_vencimento) return false;

                  const dataTask = task.data_vencimento.split("T")[0];

                  return (
                    task.status === "pendente" &&
                    !isDateInCurrentWeek(dataTask) &&
                    dataTask !== hoje
                  );
                })
                .map((task) => (
                  <div
                    key={task.id}
                    className="shrink-0 w-full flex justify-center"
                  >
                    <TaskItem
                      key={task.id}
                      taskId={task.id}
                      status={task.status}
                      prioridade={task.prioridade}
                      titulo={task.titulo}
                      descricao={task.descricao}
                      vencimento={task.data_vencimento}
                      onSave={(formData) => handleSaveTask(task.id, formData)}
                      onUpdate={loadTasks}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col items-stretch bg-indigo-200 lg:h-full lg:w-3/12 lg:items-center lg:overflow-y-auto">
        <p className="flex items-center self-center my-2 bg-black text-white p-2 rounded-xl">
          ✅ Tasks Concluídas
        </p>
        <div
          data-component="taks-items-prazo"
          className="flex flex-row items-start gap-2 px-2 py-2 overflow-x-auto overflow-y-hidden
               lg:flex-col lg:items-center lg:w-full lg:overflow-x-visible lg:overflow-y-auto lg:px-0
               scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {tasks.length === 0
            ? null
            : tasks
                .filter((task) => task.status === "finalizado")
                .map((task) => (
                  <div
                    key={task.id}
                    className="shrink-0 w-full flex justify-center"
                  >
                    <TaskItem
                      key={task.id}
                      taskId={task.id}
                      status={task.status}
                      prioridade={task.prioridade}
                      titulo={task.titulo}
                      descricao={task.descricao}
                      vencimento={task.data_vencimento}
                      onSave={(formData) => handleSaveTask(task.id, formData)}
                      onUpdate={loadTasks}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
