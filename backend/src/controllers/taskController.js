import Task from "../models/tasks.js";

const TaskController = {
  async list(req, res) {
    try {
      const user_id = req.user?.id;

      const taskId = req.params;

      if (!user_id) {
        return res.status(401).json({ error: "Usuário não autorizado." });
      }

      const tasks = await Task.findTasks(user_id);

      return res.status(200).json({
        message: "Tasks consultadas com sucesso!",
        tasks,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao listar tarefas." });
    }
  },
  async show(req, res) {
    try {
      const user_id = req.user?.id;
      const { id } = req.params;

      if (!user_id) {
        return res.status(401).json({ error: "Usuário não autorizado." });
      }

      const task = await Task.findTaskId(user_id, id);

      return res.status(200).json({
        message: "Tasks consultadas com sucesso!",
        task,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao listar tarefas." });
    }
  },
  async update(req, res) {
    try {
      const user_id = req.user?.id;
      const { id } = req.params;

      const taskData = {
        ...req.body,
        id,
      };

      if (!user_id) {
        return res.status(401).json({ error: "Usuário não autorizado." });
      }

      const task = await Task.updateTask(user_id, taskData);

      if (!task) {
        return res
          .status(404)
          .json({ error: "Tarefa não encontrada ou não pertence ao usuário." });
      }

      return res.status(200).json({
        message: "Task atualizada com sucesso",
        task,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao atualizar tarefas." });
    }
  },

  async updateStatus(req, res) {
    try {
      const user_id = req.user?.id;
      const { id } = req.params;

      const taskData = {
        ...req.body,
        id,
      };

      if (!user_id) {
        return res.status(401).json({ error: "Usuário não autorizado." });
      }

      const task = await Task.updateStatusTask(user_id, taskData);

      if (!task) {
        return res
          .status(404)
          .json({ error: "Tarefa não encontrada ou não pertence ao usuário." });
      }

      return res.status(200).json({
        message: "Status da task foi atualizado com sucesso",
        task,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar status da tarefa." });
    }
  },
  async create(req, res) {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({ error: "Usuário não autorizado." });
      }

      const taskData = {
        ...req.body,
        user_id,
      };

      /* VALIDAÇÕES */
      const sendValidationError = (msgError) => {
        return res.status(422).json({ error: msgError });
      };

      if (!taskData.titulo) {
        return sendValidationError("Título é obrigatório.");
      }

      // taskData.data_vencimento =
      //   taskData.data_vencimento || new Date().toISOString().slice(0, 10);
      taskData.status = taskData.status || "PENDENTE";
      /* FIM VALIDAÇÕES */

      const newTask = await Task.create(taskData);

      if (!newTask) {
        return res
          .status(400)
          .json({ error: "Não foi possível criar a tarefa." });
      }

      return res.status(201).json({
        message: `Tarefa ID ${newTask.id} criada com sucesso.`,
        task: newTask,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao criar tarefas." });
    }
  },

  async delete(req, res) {
    try {
      const user_id = req.user?.id;
      const { id } = req.params;

      const task = await Task.deleteTask(user_id, id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      return res.status(201).json({
        message: `Tarefa ID ${task.id} deletada com sucesso.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao deletar tarefa." });
    }
  },
};

export default TaskController;
