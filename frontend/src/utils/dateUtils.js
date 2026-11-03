import { parseISO, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export function getHojeLocal() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function isDateInCurrentWeek(dateStr) {
  // Converte sua string "YYYY-MM-DD" para um objeto Date com segurança
  const date = parseISO(dateStr);
  const hoje = new Date();

  // Define o início e o fim da semana atual (começando na segunda-feira = 1)
  const start = startOfWeek(hoje, { weekStartsOn: 1 });
  const end = endOfWeek(hoje, { weekStartsOn: 1 });

  // Verifica se a data está dentro desse intervalo
  return isWithinInterval(date, { start, end });
}
