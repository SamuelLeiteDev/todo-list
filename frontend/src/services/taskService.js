export async function updateTaskStatus(taskId, status) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar o status da tarefa.");
  }

  return response.json();
}

export async function getTasks(userId) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar tarefas.");
  }

  return response.json();
}
