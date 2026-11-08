import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ScrollText } from "lucide-react";

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 text-center shadow-xl backdrop-blur-md">
        {/* Badge / Ícone decorativo */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700/60 bg-neutral-800/70 text-indigo-400 shadow-inner">
          <ScrollText className="h-6 w-6" />
        </div>

        {/* Textos de boas-vindas */}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Bem vindo ao to-do list que resolve!
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          É um prazer recebê-lo! Cadastre-se agora mesmo e comece a listar suas
          tarefas!
        </p>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col gap-3">
          {/* Botão Primário: Login */}
          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-base font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.98]"
          >
            Entrar na conta
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Botão Secundário: Registrar */}
          <Link
            to="/register"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800/60 text-base font-medium text-neutral-200 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-600/40 active:scale-[0.98]"
          >
            Criar nova conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
