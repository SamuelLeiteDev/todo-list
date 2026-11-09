# TODO-LIST

Sistema de todo com autenticação JWT + CRUD

## 🎥 Apresentação

[![Apresentação do projeto](https://img.youtube.com/vi/mUj31fXFoxc/maxresdefault.jpg)](https://youtu.be/mUj31fXFoxc)

## 🛠️ Funcionalidades

- [x] Registro e login de usuário
- [x] Criar, Deletar, Editar task
- [x] Categorização por tags personalisaveis (Alta prioridade, média prioridade, urgente ...)
- [x] Prazo das tasks configuráveis

## 💻 Tecnologias

### Frontend

- React
- Tailwindcss
- Vite

### Backend

- Express
- Node.js
- JWT (JSON web token)
- bcrypt

## 🔗 Endpoints

### Autenticação

| Método | Rota                 | Descrição                 |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Cria novo usuário         |
| POST   | `/api/auth/login`    | Autentica e retorna o JWT |

### Tarefas

_(todas protegidas por middleware de autenticação)_

| Done | Método | Rota                    | Descrição                                                                              |
| ---- | ------ | ----------------------- | -------------------------------------------------------------------------------------- |
| ✅   | GET    | `/api/tasks`            | Lista as tarefas do usuário logado (aceita `?status=`, `?prioridade=`, `?ordenarPor=`) |
| ✅   | POST   | `/api/tasks`            | Cria uma nova tarefa                                                                   |
| ✅   | GET    | `/api/tasks/:id`        | Retorna uma tarefa específica                                                          |
| ✅   | PUT    | `/api/tasks/:id`        | Atualiza uma tarefa existente                                                          |
| ✅   | PATCH  | `/api/tasks/:id/status` | Atualiza apenas o status (pendente/concluída)                                          |
| ✅   | DELETE | `/api/tasks/:id`        | Remove uma tarefa                                                                      |
