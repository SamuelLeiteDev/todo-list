export async function loginUser(data) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    },
  );

  if (!response.ok) {
    const erro = await response.json(); // lê o corpo da resposta de erro
    throw new Error(erro.error || "Credenciais inválidas");
  }
  return response.json();
}

export async function registerUser(data) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const erro = await response.json(); // lê o corpo da resposta de erro
    throw new Error(erro.error || "Erro ao registrar usuário");
  }
  return response.json();
}

export async function logoutUser() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const erro = await response.json(); // lê o corpo da resposta de erro
    throw new Error(erro.error || "Erro ao registrar usuário");
  }
  return response.json();
}

export async function getMe() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Não autenticado");
  return response.json();
}
