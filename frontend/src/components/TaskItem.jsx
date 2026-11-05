import { ChevronDown, CalendarDays, Trash, Plus } from "lucide-react";
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useForm } from "react-hook-form";
import { updateTaskStatus } from "../services/taskService.js";
import { ptBR } from "date-fns/locale/pt-BR";
registerLocale("pt-BR", ptBR);

import "react-datepicker/dist/react-datepicker.css";

export default function TaskItem({
  taskId,
  status,
  prioridade,
  titulo,
  descricao,
  vencimento,
  onSave,
  onUpdate,
  onDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dataVencimento, setDataVencimento] = useState(
    vencimento ? new Date(vencimento) : null,
  );

  // Inicializa o formulário com os valores recebidos via props
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      status: status === "finalizado", // para transformar em boolean
      titulo: titulo || "",
      descricao: descricao || "",
      data_vencimento: vencimento || "",
    },
  });

  const handleDateChange = async (date) => {
    setDataVencimento(date);
    setValue("data_vencimento", date);
  };

  const handleStatusChange = async (e) => {
    const isChecked = e.target.checked;

    const novoStatus = isChecked ? "finalizado" : "pendente";

    setValue("status", isChecked);

    try {
      await updateTaskStatus(taskId, novoStatus);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setValue("status", !isChecked);
      alert("Não foi possível atualizar a tarefa. A alteração foi desfeita.");
      console.error("Falha ao atualizar tarefa:", error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(taskId);
    }
  };

  return (
    <form className="bg-neutral-600 w-11/12 sm:w-8/12 md:w-11/12 rounded-xl p-2 h-auto text-white flex flex-col gap-2">
      {isExpanded && prioridade === null && (
        <div
          data-component="prioridade"
          className="flex items-center gap-2 px-2 bg-amber-200 rounded-md w-fit text-black font-medium hover:bg-amber-400 cursor-pointer"
        >
          <Plus size={18} />
          <label for="prioridade">Prioridade:</label>
          <select
            name="prioridade"
            id="prioridade"
            className="cursor-pointer outline-none"
            {...register("prioridade", {
              onChange: () => {
                handleSubmit(onSave)();
              },
            })}
          >
            <option value="">Selecione...</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      )}

      {prioridade !== null && (
        <p
          className={`flex items-center gap-2 px-2rounded-md w-fit text-black font-medium cursor-pointer rounded-md 
          ${prioridade === "baixa" ? "bg-green-200" : null}
          ${prioridade === "media" ? "bg-amber-200" : null}
          ${prioridade === "alta" ? "bg-red-400" : null}`}
        >
          <select
            name="prioridade"
            id="prioridade"
            className="cursor-pointer outline-none"
            {...register("prioridade", {
              onChange: () => {
                handleSubmit(onSave)();
              },
            })}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="">Sem prioridade</option>
          </select>
        </p>
      )}

      <div
        data-component="cabecalho-task"
        className="flex gap-2 justify-between items-center"
      >
        <div className="flex gap-2 items-center flex-1">
          <input
            type="checkbox"
            {...register("status")}
            onChange={handleStatusChange}
            className="w-4 h-4 accent-gray-400 focus:ring-gray-600 cursor-pointer"
          />
          <textarea
            name="titulo"
            className="bg-neutral-400 rounded-md px-2 py-1 text-black w-full text-sm font-semibold focus:outline-none resize-none custom-scrollbar"
            placeholder="Título da tarefa"
            defaultValue={titulo}
            wrap="soft"
            {...register("titulo", {
              onBlur: handleSubmit(onSave),
            })}
          ></textarea>
        </div>

        {/* botão com type="button" para evitar submit indesejado ao alternar */}
        <button
          type="button"
          className="cursor-pointer hover:bg-neutral-500 rounded-md"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <ChevronDown
            className={`transition-transform duration-400 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div data-component="corpo-task">
          <textarea
            {...register("descricao", {
              onBlur: handleSubmit(onSave),
            })}
            placeholder="Descrição da tarefa"
            className="bg-neutral-400 rounded-md p-2 text-black w-full resize-y h-20 text-sm focus:outline-none scroll-smooth custom-scrollbar"
          />
        </div>
      )}

      <div
        data-component="rodape-task"
        className="flex items-center justify-between text-sm"
      >
        <div data-component="btn-excluir">
          {isExpanded && (
            <button
              type="button"
              className="hover:text-red-600 cursor-pointer"
              onClick={handleDelete}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Trash size={18} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays size={18} />
          {dataVencimento ? (
            <DatePicker
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              selected={dataVencimento}
              onChange={(date) => {
                handleDateChange(date);
                handleSubmit(onSave)(); // Salva automaticamente ao alterar a data
              }}
              onBlur={handleSubmit(onSave)}
              className="w-[10ch]"
            />
          ) : (
            <p
              onClick={() => setDataVencimento(new Date())}
              className="cursor-pointer"
            >
              Selecione uma data vencimento
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
