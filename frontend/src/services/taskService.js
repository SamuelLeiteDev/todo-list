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

export async function updateTask(taskId, dadosAtualizados) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dadosAtualizados),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar a tarefa");
  }

  return await response.json();
}

export async function createTask(user_id, data_vencimento, status) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      user_id: user_id,
      titulo: "Nova Tarefa",
      data_vencimento: data_vencimento,
      status: status,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar tarefa");
  }

  return await response.json();
}

export async function deleteTask(userId, taskId) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao excluir tarefa.");
  }

  return response.json();
}
