import db from "../config/db.js";

const Tasks = {
  // Busca usuário por email (usado no login e para evitar duplicados no cadastro)
  async findTasks(user_id) {
    const query = "SELECT * FROM tasks WHERE user_id = $1";
    const { rows } = await db.query(query, [user_id]);
    return rows;
  },

  async findTaskId(user_id, id) {
    const query = "SELECT * FROM tasks WHERE user_id = $1 AND id = $2";
    const { rows } = await db.query(query, [user_id, id]);
    return rows[0];
  },

  async updateTask(user_id, data) {
    const { titulo, descricao, prioridade, data_vencimento, id } = data;

    const vencimentoFormatado =
      data_vencimento && data_vencimento !== "" ? data_vencimento : null;

    const query = `
      UPDATE tasks SET (titulo, descricao, prioridade, data_vencimento)
      = ($1, $2, $3, $4) WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    const values = [
      titulo,
      descricao,
      prioridade,
      vencimentoFormatado,
      id,
      user_id,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async updateStatusTask(user_id, data) {
    const { status, id } = data;

    const query = `
      UPDATE tasks SET status
      = $1 WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    const values = [status, id, user_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async create(data) {
    const { user_id, titulo, descricao, status, prioridade, data_vencimento } =
      data;

    const query = `
      INSERT INTO tasks (user_id, titulo, descricao, status, prioridade, data_vencimento)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      user_id,
      titulo,
      descricao,
      status,
      prioridade,
      data_vencimento,
    ];
    const { rows } = await db.query(query, values);

    return rows[0]; // Retorna a tarefa recém-criada como um objeto
  },

  async deleteTask(user_id, id) {
    const query =
      "DELETE FROM tasks WHERE user_id = $1 AND id = $2 RETURNING *";
    const values = [user_id, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },
};

export default Tasks;
